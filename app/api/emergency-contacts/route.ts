import { NextResponse } from 'next/server';

// Mock emergency contacts data - in production, this would come from Storyblok
const mockEmergencyContacts = [
  {
    id: 'contact-1',
    contact_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '+1-555-0123',
    relationship: 'Spouse',
    is_primary: true,
    priority_order: 1,
    preferred_contact_method: 'phone',
    medical_proxy: true,
    available_hours: '24/7',
    last_contacted: null,
    contact_success_rate: 95
  },
  {
    id: 'contact-2',
    contact_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '+1-555-0456',
    relationship: 'Daughter',
    is_primary: false,
    priority_order: 2,
    preferred_contact_method: 'email',
    medical_proxy: false,
    available_hours: '8 AM - 6 PM',
    last_contacted: null,
    contact_success_rate: 87
  },
  {
    id: 'contact-3',
    contact_name: 'Dr. Sarah Wilson',
    email: 'dr.wilson@medical.com',
    phone_number: '+1-555-0789',
    relationship: 'Primary Care Physician',
    is_primary: false,
    priority_order: 3,
    preferred_contact_method: 'phone',
    medical_proxy: true,
    available_hours: '9 AM - 5 PM',
    last_contacted: null,
    contact_success_rate: 92
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'test-user';
    const priorityOnly = searchParams.get('priorityOnly') === 'true';
    
    console.log('📞 Fetching emergency contacts for user:', userId);

    // In production, fetch from Storyblok
    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    let contacts = mockEmergencyContacts;
    let source = 'mock_data';

    if (storyblokToken && spaceId) {
      try {
        // Fetch emergency contacts from Storyblok
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?token=${storyblokToken}&filter_query[component][eq]=emergency_contact&filter_query[user_id][eq]=${userId}&sort_by=priority_order:asc`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.stories && data.stories.length > 0) {
            contacts = data.stories.map((story: any) => story.content);
            source = 'storyblok';
            console.log(`✅ Loaded ${contacts.length} contacts from Storyblok`);
          }
        }
      } catch (error) {
        console.log('⚠️ Storyblok fetch failed, using mock data:', error);
      }
    }

    // Filter by priority if requested
    if (priorityOnly) {
      contacts = contacts.filter(contact => contact.is_primary || contact.priority_order <= 2);
    }

    // Sort by priority order
    contacts.sort((a, b) => a.priority_order - b.priority_order);

    return NextResponse.json({
      success: true,
      contacts: contacts,
      count: contacts.length,
      source: source,
      userId: userId
    });

  } catch (error) {
    console.error('❌ Error fetching emergency contacts:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      contacts: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contactData = await request.json();
    
    console.log('📝 Creating/updating emergency contact:', contactData.contact_name);

    // Validate required fields
    const requiredFields = ['contact_name', 'phone_number', 'relationship'];
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.log('⚠️ Storyblok not configured, returning mock success');
      return NextResponse.json({
        success: true,
        contact: { ...contactData, id: `mock-${Date.now()}` },
        message: 'Contact saved locally (Storyblok unavailable)',
        source: 'mock'
      });
    }

    // Create emergency contact in Storyblok
    const storyData = {
      story: {
        name: `Emergency Contact - ${contactData.contact_name}`,
        slug: `emergency-contact-${contactData.contact_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        content: {
          component: 'emergency_contact',
          contact_name: contactData.contact_name,
          email: contactData.email || '',
          phone_number: contactData.phone_number,
          relationship: contactData.relationship,
          is_primary: contactData.is_primary || false,
          priority_order: contactData.priority_order || 99,
          preferred_contact_method: contactData.preferred_contact_method || 'phone',
          medical_proxy: contactData.medical_proxy || false,
          available_hours: contactData.available_hours || '24/7',
          user_id: contactData.user_id || 'test-user',
          created_at: new Date().toISOString(),
          contact_success_rate: 100 // Default for new contacts
        }
      }
    };

    const storyblokResponse = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
      {
        method: 'POST',
        headers: {
          'Authorization': storyblokToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      }
    );

    if (!storyblokResponse.ok) {
      const errorText = await storyblokResponse.text();
      console.error('❌ Storyblok API error:', storyblokResponse.status, errorText);
      throw new Error(`Storyblok API error: ${storyblokResponse.status}`);
    }

    const storyblokResult = await storyblokResponse.json();
    console.log('✅ Emergency contact created in Storyblok:', storyblokResult.story?.id);

    return NextResponse.json({
      success: true,
      contact: storyblokResult.story?.content,
      storyblokId: storyblokResult.story?.id,
      message: 'Emergency contact saved successfully to Storyblok'
    });

  } catch (error) {
    console.error('❌ Error creating emergency contact:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');
    const updateData = await request.json();
    
    if (!contactId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Contact ID is required for updates' 
      }, { status: 400 });
    }

    console.log('✏️ Updating emergency contact:', contactId);

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.log('⚠️ Storyblok not configured, returning mock success');
      return NextResponse.json({
        success: true,
        contact: { ...updateData, id: contactId },
        message: 'Contact updated locally (Storyblok unavailable)',
        source: 'mock'
      });
    }

    // Update contact in Storyblok
    const storyData = {
      story: {
        content: {
          ...updateData,
          updated_at: new Date().toISOString()
        }
      }
    };

    const storyblokResponse = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': storyblokToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      }
    );

    if (!storyblokResponse.ok) {
      throw new Error(`Storyblok API error: ${storyblokResponse.status}`);
    }

    const storyblokResult = await storyblokResponse.json();
    console.log('✅ Emergency contact updated in Storyblok');

    return NextResponse.json({
      success: true,
      contact: storyblokResult.story?.content,
      message: 'Emergency contact updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating emergency contact:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');
    
    if (!contactId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Contact ID is required for deletion' 
      }, { status: 400 });
    }

    console.log('🗑️ Deleting emergency contact:', contactId);

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.log('⚠️ Storyblok not configured, returning mock success');
      return NextResponse.json({
        success: true,
        message: 'Contact deleted locally (Storyblok unavailable)',
        source: 'mock'
      });
    }

    // Delete contact from Storyblok
    const storyblokResponse = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/${contactId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': storyblokToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!storyblokResponse.ok) {
      throw new Error(`Storyblok API error: ${storyblokResponse.status}`);
    }

    console.log('✅ Emergency contact deleted from Storyblok');

    return NextResponse.json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting emergency contact:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}