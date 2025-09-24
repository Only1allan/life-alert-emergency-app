import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('🧪 Creating test emergency data...');

    // Create test emergency log
    const testEmergencyData = {
      userId: 'test-user',
      emergencyType: 'panic_button',
      severity: 7,
      transcript: 'User reported feeling dizzy and chest pain. AI assessed situation as moderate emergency requiring immediate attention.',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main Street, New York, NY 10001'
      },
      timestamp: new Date().toISOString(),
      aiDecision: 'Contact preferred hospital immediately',
      actionsTaken: ['AI emergency assessment completed', 'Emergency contacts notified', 'Hospital contacted'],
      duration: 180,
      status: 'resolved' as const,
      responseTime: 120
    };

    // Send to emergency logging API
    const logResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/emergency/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEmergencyData)
    });

    const logResult = await logResponse.json();

    if (logResult.success) {
      console.log('✅ Test emergency logged successfully:', logResult.logId);
      
      return NextResponse.json({
        success: true,
        message: 'Test emergency data created successfully',
        emergencyLog: {
          logId: logResult.logId,
          storyblokId: logResult.storyblokId,
          data: testEmergencyData
        },
        instructions: {
          storyblok: 'Check your Storyblok space for the new emergency log entry',
          dashboard: 'Refresh your dashboard to see the emergency in the history',
          console: 'Check browser console for detailed logging information'
        }
      });
    } else {
      throw new Error(logResult.error || 'Failed to create emergency log');
    }

  } catch (error) {
    console.error('❌ Error creating test emergency:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: 'Emergency data will be stored locally as fallback'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Return test emergency data for display
    const testData = {
      emergency_logs: [
        {
          emergency_id: 'test-emergency-001',
          emergency_type: 'panic_button',
          severity_level: 8,
          status: 'resolved',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          ai_decision: 'Contact emergency services immediately',
          agent_summary: 'Critical emergency detected. User reported severe chest pain and difficulty breathing.',
          location_address: '123 Main Street, New York, NY 10001',
          response_time_seconds: 45,
          call_duration: 240,
          actions_taken: 'Emergency services contacted, family notified, hospital prepared',
          outcome_status: 'Resolved successfully - user transported to hospital'
        },
        {
          emergency_id: 'test-emergency-002',
          emergency_type: 'medical_emergency',
          severity_level: 5,
          status: 'resolved',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          ai_decision: 'Contact preferred hospital',
          agent_summary: 'Moderate emergency. User reported dizziness and nausea.',
          location_address: '456 Oak Avenue, Brooklyn, NY 11201',
          response_time_seconds: 90,
          call_duration: 180,
          actions_taken: 'Hospital contacted, family notified',
          outcome_status: 'Resolved - user received medical attention'
        },
        {
          emergency_id: 'test-emergency-003',
          emergency_type: 'fall_detection',
          severity_level: 3,
          status: 'resolved',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          ai_decision: 'Contact primary emergency contact',
          agent_summary: 'Low severity alert. User reported minor fall, no serious injury.',
          location_address: '789 Pine Street, Queens, NY 11375',
          response_time_seconds: 120,
          call_duration: 90,
          actions_taken: 'Family contacted, follow-up scheduled',
          outcome_status: 'Resolved - no medical attention needed'
        }
      ],
      emergency_contacts: [
        {
          contact_name: 'John Doe',
          email: 'john.doe@example.com',
          phone_number: '+1-555-0123',
          relationship: 'Spouse',
          is_primary: true,
          priority_order: 1
        },
        {
          contact_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone_number: '+1-555-0456',
          relationship: 'Daughter',
          is_primary: false,
          priority_order: 2
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: testData,
      message: 'Test emergency data retrieved successfully',
      note: 'This is mock data for testing. Real data will come from Storyblok when configured.'
    });

  } catch (error) {
    console.error('❌ Error retrieving test data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

