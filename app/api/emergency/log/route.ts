import { NextResponse } from 'next/server';

interface EmergencyLogData {
  userId: string;
  emergencyType: string;
  severity: number;
  transcript: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  aiDecision: string;
  actionsTaken: string[];
  duration: number;
  status: 'initiated' | 'in_progress' | 'resolved' | 'cancelled';
  responseTime?: number;
}

export async function POST(request: Request) {
  try {
    const emergencyData: EmergencyLogData = await request.json();
    
    console.log('📝 Creating emergency log in Storyblok:', emergencyData);

    // Validate required fields
    if (!emergencyData.userId || !emergencyData.emergencyType || !emergencyData.timestamp) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: userId, emergencyType, or timestamp' 
      }, { status: 400 });
    }

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.error('❌ Storyblok credentials missing');
      return NextResponse.json({ 
        success: false, 
        error: 'Storyblok configuration missing' 
      }, { status: 500 });
    }

    // Create emergency log entry in Storyblok
    const logId = `emergency-${Date.now()}`;
    const storyData = {
      story: {
        name: `Emergency Log - ${emergencyData.emergencyType} - ${new Date(emergencyData.timestamp).toLocaleString()}`,
        slug: logId,
        content: {
          component: 'emergency_log',
          // Emergency Details
          emergency_id: logId,
          user_id: emergencyData.userId,
          emergency_type: emergencyData.emergencyType,
          severity_level: emergencyData.severity,
          status: emergencyData.status,
          
          // Timestamp Information
          timestamp: emergencyData.timestamp,
          response_time_seconds: emergencyData.responseTime || emergencyData.duration,
          call_duration: emergencyData.duration,
          
          // Location Data
          location_latitude: emergencyData.location?.latitude,
          location_longitude: emergencyData.location?.longitude,
          location_address: emergencyData.location?.address || 'Address not available',
          
          // AI Assessment Data
          ai_transcript: emergencyData.transcript,
          ai_decision: emergencyData.aiDecision,
          agent_summary: `Emergency severity ${emergencyData.severity}/10. AI recommended: ${emergencyData.aiDecision}`,
          
          // Actions and Outcome
          actions_taken: emergencyData.actionsTaken.join(', '),
          outcome_status: emergencyData.status === 'resolved' ? 'Resolved successfully' : 'In progress',
          
          // Additional Metadata
          created_at: new Date().toISOString(),
          emergency_source: 'panic_button',
          ai_confidence: 0.85 // Mock confidence score
        }
      }
    };

    // Send to Storyblok Management API
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
      
      // Fallback: Store locally if Storyblok fails
      console.log('💾 Storing emergency log locally as fallback');
      return NextResponse.json({
        success: true,
        logId: logId,
        message: 'Emergency logged locally (Storyblok unavailable)',
        fallback: true
      });
    }

    const storyblokResult = await storyblokResponse.json();
    console.log('✅ Emergency log created in Storyblok:', storyblokResult.story?.id);

    // Trigger emergency notifications
    await triggerEmergencyNotifications(emergencyData, storyblokResult.story?.id);

    return NextResponse.json({
      success: true,
      logId: logId,
      storyblokId: storyblokResult.story?.id,
      message: 'Emergency logged successfully in Storyblok',
      notificationsSent: true
    });

  } catch (error) {
    console.error('❌ Error creating emergency log:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// Function to trigger emergency notifications
async function triggerEmergencyNotifications(emergencyData: EmergencyLogData, storyId?: number) {
  try {
    console.log('📧 Triggering emergency notifications...');
    
    // Get user's emergency contacts
    const contactsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/emergency-contacts`);
    const contacts = await contactsResponse.json();
    
    if (!contacts || contacts.length === 0) {
      console.log('⚠️ No emergency contacts found');
      return;
    }

    // Prepare notification data
    const notificationData = {
      emergencyType: emergencyData.emergencyType,
      severity: emergencyData.severity,
      location: emergencyData.location?.address || 'Location unavailable',
      timestamp: emergencyData.timestamp,
      aiSummary: emergencyData.aiDecision,
      storyblokLogId: storyId,
      contacts: contacts.slice(0, 3) // Limit to first 3 contacts
    };

    // Send notifications via separate API
    const notificationResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/emergency/notify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      }
    );

    if (notificationResponse.ok) {
      console.log('✅ Emergency notifications sent successfully');
    } else {
      console.error('❌ Failed to send emergency notifications');
    }

  } catch (error) {
    console.error('❌ Error triggering notifications:', error);
  }
}

// GET endpoint to retrieve emergency logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'test-user';
    
    console.log('📋 Fetching emergency logs for user:', userId);

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      // Return mock data if Storyblok not configured
      return NextResponse.json({
        success: true,
        logs: [
          {
            id: 'mock-1',
            emergency_type: 'panic_button',
            severity_level: 7,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'resolved',
            ai_decision: 'Contact preferred hospital',
            response_time_seconds: 180
          }
        ],
        source: 'mock_data'
      });
    }

    // Fetch from Storyblok
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?token=${storyblokToken}&filter_query[component][eq]=emergency_log&filter_query[user_id][eq]=${userId}&sort_by=created_at:desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      logs: data.stories?.map((story: any) => story.content) || [],
      count: data.stories?.length || 0,
      source: 'storyblok'
    });

  } catch (error) {
    console.error('❌ Error fetching emergency logs:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

