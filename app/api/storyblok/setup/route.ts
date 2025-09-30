import { NextResponse } from 'next/server';

interface StoryblokField {
  name: string;
  type: string;
  required?: boolean;
  options?: any;
  description?: string;
}

interface ContentType {
  name: string;
  display_name: string;
  schema: StoryblokField[];
}

export async function POST(request: Request) {
  try {
    console.log('🏗️ Setting up Storyblok content types and sample data...');

    const storyblokToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      return NextResponse.json({
        success: false,
        error: 'Storyblok credentials not configured. Please add STORYBLOK_MANAGEMENT_TOKEN and NEXT_PUBLIC_STORYBLOK_SPACE_ID to your .env.local file.',
        setup_required: true
      }, { status: 400 });
    }

    const results = {
      contentTypes: [] as any[],
      sampleData: [] as any[],
      errors: [] as string[]
    };

    // Define content types to create
    const contentTypes: ContentType[] = [
      {
        name: 'emergency_log',
        display_name: 'Emergency Log',
        schema: [
          { name: 'emergency_id', type: 'text', required: true, description: 'Unique emergency identifier' },
          { name: 'user_id', type: 'text', required: true, description: 'User who triggered emergency' },
          { name: 'emergency_type', type: 'text', required: true, description: 'Type of emergency' },
          { name: 'severity_level', type: 'number', required: true, description: 'Severity level 1-10' },
          { name: 'status', type: 'text', required: true, description: 'Current status' },
          { name: 'timestamp', type: 'datetime', required: true, description: 'When emergency occurred' },
          { name: 'response_time_seconds', type: 'number', description: 'Time to first response' },
          { name: 'call_duration', type: 'number', description: 'VAPI conversation length' },
          { name: 'location_latitude', type: 'number', description: 'GPS latitude' },
          { name: 'location_longitude', type: 'number', description: 'GPS longitude' },
          { name: 'location_address', type: 'text', description: 'Human-readable address' },
          { name: 'ai_transcript', type: 'textarea', description: 'Full VAPI conversation' },
          { name: 'ai_decision', type: 'text', description: 'AI assessment result' },
          { name: 'agent_summary', type: 'textarea', description: 'AI-generated summary' },
          { name: 'actions_taken', type: 'text', description: 'Actions performed' },
          { name: 'outcome_status', type: 'text', description: 'Final resolution' },
          { name: 'created_at', type: 'datetime', description: 'Log creation time' }
        ]
      },
      {
        name: 'emergency_contact',
        display_name: 'Emergency Contact',
        schema: [
          { name: 'contact_name', type: 'text', required: true, description: 'Full name' },
          { name: 'email', type: 'text', description: 'Email address' },
          { name: 'phone_number', type: 'text', required: true, description: 'Phone number' },
          { name: 'relationship', type: 'text', required: true, description: 'Relationship to user' },
          { name: 'is_primary', type: 'boolean', description: 'Primary contact flag' },
          { name: 'priority_order', type: 'number', description: 'Contact sequence order' },
          { name: 'preferred_contact_method', type: 'text', description: 'Preferred contact method' },
          { name: 'medical_proxy', type: 'boolean', description: 'Can make medical decisions' },
          { name: 'available_hours', type: 'text', description: 'When they are available' },
          { name: 'user_id', type: 'text', required: true, description: 'Associated user' },
          { name: 'contact_success_rate', type: 'number', description: 'Success rate percentage' }
        ]
      },
      {
        name: 'emergency_notification',
        display_name: 'Emergency Notification',
        schema: [
          { name: 'contact_name', type: 'text', required: true, description: 'Who was contacted' },
          { name: 'contact_email', type: 'text', description: 'Email used' },
          { name: 'contact_phone', type: 'text', description: 'Phone used' },
          { name: 'relationship', type: 'text', description: 'Contact relationship' },
          { name: 'emergency_type', type: 'text', required: true, description: 'Type of emergency' },
          { name: 'severity', type: 'number', required: true, description: 'Emergency severity' },
          { name: 'notification_status', type: 'text', required: true, description: 'sent, failed, delivered' },
          { name: 'sent_at', type: 'datetime', required: true, description: 'When notification sent' },
          { name: 'emergency_timestamp', type: 'datetime', required: true, description: 'Original emergency time' },
          { name: 'storyblok_log_reference', type: 'number', description: 'Link to emergency log' }
        ]
      },
      {
        name: 'message_template',
        display_name: 'Message Template',
        schema: [
          { name: 'template_name', type: 'text', required: true, description: 'Template identifier' },
          { name: 'template_type', type: 'text', required: true, description: 'email, sms, push' },
          { name: 'severity_level', type: 'number', description: 'Severity level this template is for' },
          { name: 'subject_template', type: 'text', description: 'Email subject template' },
          { name: 'html_template', type: 'textarea', description: 'HTML email template' },
          { name: 'text_template', type: 'textarea', description: 'Plain text template' },
          { name: 'sms_template', type: 'textarea', description: 'SMS message template' },
          { name: 'push_template', type: 'textarea', description: 'Push notification template' },
          { name: 'is_active', type: 'boolean', description: 'Whether template is active' },
          { name: 'created_at', type: 'datetime', description: 'Template creation time' }
        ]
      }
    ];

    // Create content types
    for (const contentType of contentTypes) {
      try {
        console.log(`📝 Creating content type: ${contentType.name}`);
        
        const schema = contentType.schema.map(field => ({
          name: field.name,
          type: field.type,
          required: field.required || false,
          description: field.description || ''
        }));

        const response = await fetch(
          `https://mapi.storyblok.com/v1/spaces/${spaceId}/components`,
          {
            method: 'POST',
            headers: {
              'Authorization': storyblokToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              component: {
                name: contentType.name,
                display_name: contentType.display_name,
                schema: schema,
                is_root: false,
                real_name: contentType.name
              }
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          results.contentTypes.push({
            name: contentType.name,
            id: result.component.id,
            status: 'created'
          });
          console.log(`✅ Created content type: ${contentType.name}`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️ Content type ${contentType.name} may already exist or failed:`, response.status);
          results.contentTypes.push({
            name: contentType.name,
            status: 'exists_or_failed',
            error: errorText
          });
        }
      } catch (error) {
        console.error(`❌ Error creating content type ${contentType.name}:`, error);
        results.errors.push(`Failed to create ${contentType.name}: ${error}`);
      }
    }

    // Create sample data
    await createSampleData(spaceId, storyblokToken, results);

    return NextResponse.json({
      success: true,
      message: 'Storyblok setup completed successfully',
      results: {
        contentTypesCreated: results.contentTypes.length,
        sampleDataCreated: results.sampleData.length,
        errors: results.errors.length,
        details: results
      },
      nextSteps: [
        'Content types have been created in Storyblok',
        'Sample emergency contacts and message templates added',
        'You can now test the panic button to create emergency logs',
        'Check your Storyblok space to see the new content'
      ]
    });

  } catch (error) {
    console.error('❌ Error setting up Storyblok:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

async function createSampleData(spaceId: string, token: string, results: any) {
  try {
    console.log('📊 Creating sample data...');

    // Sample emergency contacts
    const emergencyContacts = [
      {
        name: 'Primary Emergency Contact - John Doe',
        slug: 'primary-contact-john-doe',
        content: {
          component: 'emergency_contact',
          contact_name: 'John Doe',
          email: 'john.doe@example.com',
          phone_number: '+1-555-0123',
          relationship: 'Spouse',
          is_primary: true,
          priority_order: 1,
          preferred_contact_method: 'phone',
          medical_proxy: true,
          available_hours: '24/7',
          user_id: 'test-user',
          contact_success_rate: 95
        }
      },
      {
        name: 'Secondary Emergency Contact - Jane Smith',
        slug: 'secondary-contact-jane-smith',
        content: {
          component: 'emergency_contact',
          contact_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone_number: '+1-555-0456',
          relationship: 'Daughter',
          is_primary: false,
          priority_order: 2,
          preferred_contact_method: 'email',
          medical_proxy: false,
          available_hours: '8 AM - 6 PM',
          user_id: 'test-user',
          contact_success_rate: 87
        }
      },
      {
        name: 'Medical Contact - Dr. Sarah Wilson',
        slug: 'medical-contact-dr-wilson',
        content: {
          component: 'emergency_contact',
          contact_name: 'Dr. Sarah Wilson',
          email: 'dr.wilson@medical.com',
          phone_number: '+1-555-0789',
          relationship: 'Primary Care Physician',
          is_primary: false,
          priority_order: 3,
          preferred_contact_method: 'phone',
          medical_proxy: true,
          available_hours: '9 AM - 5 PM',
          user_id: 'test-user',
          contact_success_rate: 92
        }
      }
    ];

    // Sample message templates
    const messageTemplates = [
      {
        name: 'Critical Emergency Email Template',
        slug: 'critical-emergency-email-template',
        content: {
          component: 'message_template',
          template_name: 'critical_emergency_email',
          template_type: 'email',
          severity_level: 8,
          subject_template: '🚨 CRITICAL EMERGENCY ALERT - {{emergency_type}}',
          html_template: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">🚨 CRITICAL EMERGENCY ALERT</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Severity: CRITICAL ({{severity}}/10)</p>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0;">Emergency Details</h2>
                <p><strong>Type:</strong> {{emergency_type}}</p>
                <p><strong>Time:</strong> {{timestamp}}</p>
                <p><strong>Location:</strong> {{location}}</p>
                <p><strong>AI Assessment:</strong> {{ai_summary}}</p>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Hello {{contact_name}},</strong></p>
                <p style="margin: 10px 0 0 0;">Your emergency contact has activated their LifeGuard Pro system. This appears to be a critical emergency and emergency services may have been contacted.</p>
              </div>
              
              <div style="background: #e5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e40af; margin-top: 0;">IMMEDIATE ACTIONS REQUIRED:</h3>
                <ul style="color: #1e40af;">
                  <li>Call emergency services (911) if not already contacted</li>
                  <li>Go to the location immediately if safe to do so</li>
                  <li>Contact other family members</li>
                  <li>Stay in communication until situation is resolved</li>
                </ul>
              </div>
            </div>
          `,
          text_template: `
CRITICAL EMERGENCY ALERT - {{emergency_type}}
Severity: CRITICAL ({{severity}}/10)

Hello {{contact_name}},

Your emergency contact has activated their LifeGuard Pro system.

Details:
- Type: {{emergency_type}}
- Time: {{timestamp}}
- Location: {{location}}
- AI Assessment: {{ai_summary}}

IMMEDIATE ACTIONS REQUIRED:
• Call emergency services (911) if not already contacted
• Go to the location immediately if safe to do so
• Contact other family members
• Stay in communication until situation is resolved

This alert was generated by LifeGuard Pro Emergency Response System.
          `,
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      {
        name: 'Moderate Emergency Email Template',
        slug: 'moderate-emergency-email-template',
        content: {
          component: 'message_template',
          template_name: 'moderate_emergency_email',
          template_type: 'email',
          severity_level: 5,
          subject_template: '⚠️ EMERGENCY ALERT - {{emergency_type}}',
          html_template: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #ea580c; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">⚠️ EMERGENCY ALERT</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Severity: MODERATE ({{severity}}/10)</p>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0;">Emergency Details</h2>
                <p><strong>Type:</strong> {{emergency_type}}</p>
                <p><strong>Time:</strong> {{timestamp}}</p>
                <p><strong>Location:</strong> {{location}}</p>
                <p><strong>AI Assessment:</strong> {{ai_summary}}</p>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Hello {{contact_name}},</strong></p>
                <p style="margin: 10px 0 0 0;">Your emergency contact has activated their LifeGuard Pro system. This appears to be a moderate emergency requiring attention.</p>
              </div>
              
              <div style="background: #e5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e40af; margin-top: 0;">Recommended Actions:</h3>
                <ul style="color: #1e40af;">
                  <li>Contact them immediately by phone</li>
                  <li>Consider going to their location</li>
                  <li>Stay in communication until situation is resolved</li>
                  <li>Monitor their condition closely</li>
                </ul>
              </div>
            </div>
          `,
          text_template: `
EMERGENCY ALERT - {{emergency_type}}
Severity: MODERATE ({{severity}}/10)

Hello {{contact_name}},

Your emergency contact has activated their LifeGuard Pro system.

Details:
- Type: {{emergency_type}}
- Time: {{timestamp}}
- Location: {{location}}
- AI Assessment: {{ai_summary}}

Recommended Actions:
• Contact them immediately by phone
• Consider going to their location
• Stay in communication until situation is resolved
• Monitor their condition closely

This alert was generated by LifeGuard Pro Emergency Response System.
          `,
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      {
        name: 'SMS Emergency Template',
        slug: 'sms-emergency-template',
        content: {
          component: 'message_template',
          template_name: 'emergency_sms',
          template_type: 'sms',
          severity_level: 0,
          sms_template: `🚨 EMERGENCY ALERT: {{contact_name}}, {{emergency_type}} emergency at {{location}}. Time: {{timestamp}}. AI: {{ai_summary}}. Call immediately!`,
          is_active: true,
          created_at: new Date().toISOString()
        }
      }
    ];

    // Create emergency contacts
    for (const contact of emergencyContacts) {
      try {
        const response = await fetch(
          `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
          {
            method: 'POST',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: contact }),
          }
        );

        if (response.ok) {
          results.sampleData.push({ type: 'emergency_contact', name: contact.name, status: 'created' });
          console.log(`✅ Created emergency contact: ${contact.name}`);
        } else {
          console.log(`⚠️ Emergency contact ${contact.name} may already exist`);
          results.sampleData.push({ type: 'emergency_contact', name: contact.name, status: 'exists' });
        }
      } catch (error) {
        console.error(`❌ Error creating emergency contact ${contact.name}:`, error);
      }
    }

    // Create message templates
    for (const template of messageTemplates) {
      try {
        const response = await fetch(
          `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
          {
            method: 'POST',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: template }),
          }
        );

        if (response.ok) {
          results.sampleData.push({ type: 'message_template', name: template.name, status: 'created' });
          console.log(`✅ Created message template: ${template.name}`);
        } else {
          console.log(`⚠️ Message template ${template.name} may already exist`);
          results.sampleData.push({ type: 'message_template', name: template.name, status: 'exists' });
        }
      } catch (error) {
        console.error(`❌ Error creating message template ${template.name}:`, error);
      }
    }

    console.log('✅ Sample data creation completed');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    results.errors.push(`Sample data creation failed: ${error}`);
  }
}




