import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface StoryblokWebhookPayload {
  text: string;
  action: 'published' | 'unpublished' | 'deleted';
  space_id: number;
  story_id: number;
  full_slug: string;
  story: {
    id: number;
    name: string;
    slug: string;
    content: any;
    created_at: string;
    updated_at: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const payload: StoryblokWebhookPayload = JSON.parse(body);
    
    console.log('🔔 Storyblok webhook received:', {
      action: payload.action,
      story_id: payload.story_id,
      component: payload.story?.content?.component,
      story_name: payload.story?.name
    });

    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('webhook-signature');
    if (signature && !verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle different story types
    const storyContent = payload.story?.content;
    const component = storyContent?.component;

    switch (component) {
      case 'emergency_log':
        await handleEmergencyLogWebhook(payload);
        break;
        
      case 'hospital':
        await handleHospitalUpdateWebhook(payload);
        break;
        
      case 'emergency_protocol':
        await handleProtocolUpdateWebhook(payload);
        break;
        
      default:
        console.log(`ℹ️ Unhandled component type: ${component}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      action: payload.action,
      component: component
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle emergency log webhook
async function handleEmergencyLogWebhook(payload: StoryblokWebhookPayload) {
  try {
    const emergencyData = payload.story.content;
    
    console.log('🚨 Processing emergency log webhook:', {
      emergency_id: emergencyData.emergency_id,
      severity: emergencyData.severity_level,
      status: emergencyData.status
    });

    // Trigger additional actions based on emergency log
    if (payload.action === 'published') {
      // Send immediate notifications for high-severity emergencies
      if (emergencyData.severity_level >= 8) {
        await sendCriticalEmergencyAlerts(emergencyData);
      }
      
      // Update emergency dashboard in real-time
      await updateEmergencyDashboard(emergencyData);
      
      // Trigger external integrations
      await triggerExternalIntegrations(emergencyData);
    }

    // Log webhook processing
    console.log(`✅ Emergency log webhook processed for ${emergencyData.emergency_id}`);
    
  } catch (error) {
    console.error('❌ Error processing emergency log webhook:', error);
  }
}

// Handle hospital update webhook
async function handleHospitalUpdateWebhook(payload: StoryblokWebhookPayload) {
  try {
    const hospitalData = payload.story.content;
    
    console.log('🏥 Processing hospital update webhook:', {
      hospital_name: hospitalData.hospital_name,
      availability_status: hospitalData.availability_status
    });

    if (payload.action === 'published') {
      // Update active emergency routing based on hospital availability
      await updateEmergencyRouting(hospitalData);
      
      // Notify emergency coordinators of hospital status changes
      if (hospitalData.availability_status === 'Full' || hospitalData.availability_status === 'Closed') {
        await notifyEmergencyCoordinators(hospitalData);
      }
    }

    console.log(`✅ Hospital update webhook processed for ${hospitalData.hospital_name}`);
    
  } catch (error) {
    console.error('❌ Error processing hospital update webhook:', error);
  }
}

// Handle emergency protocol update webhook
async function handleProtocolUpdateWebhook(payload: StoryblokWebhookPayload) {
  try {
    const protocolData = payload.story.content;
    
    console.log('📋 Processing protocol update webhook:', {
      protocol_name: protocolData.protocol_name,
      severity_threshold: protocolData.severity_threshold
    });

    if (payload.action === 'published') {
      // Update VAPI agent with new protocols
      await updateVAPIProtocols(protocolData);
      
      // Notify medical staff of protocol changes
      await notifyMedicalStaff(protocolData);
      
      // Update emergency response algorithms
      await updateEmergencyAlgorithms(protocolData);
    }

    console.log(`✅ Protocol update webhook processed for ${protocolData.protocol_name}`);
    
  } catch (error) {
    console.error('❌ Error processing protocol update webhook:', error);
  }
}

// Send critical emergency alerts
async function sendCriticalEmergencyAlerts(emergencyData: any) {
  try {
    console.log('🚨 Sending critical emergency alerts...');
    
    // Send to emergency services dashboard
    const alertData = {
      emergency_id: emergencyData.emergency_id,
      severity: emergencyData.severity_level,
      location: emergencyData.location_address,
      timestamp: emergencyData.timestamp,
      user_id: emergencyData.user_id,
      ai_summary: emergencyData.agent_summary
    };

    // Mock sending to emergency services API
    console.log('📡 Alert sent to emergency services dashboard:', alertData);
    
    // Send to hospital emergency departments
    if (emergencyData.location_latitude && emergencyData.location_longitude) {
      console.log('🏥 Alert sent to nearby hospital emergency departments');
    }
    
  } catch (error) {
    console.error('❌ Error sending critical alerts:', error);
  }
}

// Update emergency dashboard
async function updateEmergencyDashboard(emergencyData: any) {
  try {
    console.log('📊 Updating emergency dashboard...');
    
    // This would update a real-time dashboard
    // For now, we'll log the update
    console.log('Dashboard updated with emergency:', {
      id: emergencyData.emergency_id,
      status: emergencyData.status,
      severity: emergencyData.severity_level
    });
    
  } catch (error) {
    console.error('❌ Error updating dashboard:', error);
  }
}

// Trigger external integrations
async function triggerExternalIntegrations(emergencyData: any) {
  try {
    console.log('🔗 Triggering external integrations...');
    
    // Example integrations:
    // - Emergency services dispatch systems
    // - Hospital management systems
    // - Insurance company notifications
    // - Family notification services
    
    const integrations = [
      { name: 'Emergency Dispatch', status: 'triggered' },
      { name: 'Hospital Network', status: 'notified' },
      { name: 'Insurance Provider', status: 'logged' }
    ];
    
    console.log('✅ External integrations triggered:', integrations);
    
  } catch (error) {
    console.error('❌ Error triggering integrations:', error);
  }
}

// Update emergency routing based on hospital availability
async function updateEmergencyRouting(hospitalData: any) {
  try {
    console.log('🗺️ Updating emergency routing...');
    
    // This would update the routing algorithm based on hospital capacity
    console.log('Routing updated for hospital:', {
      name: hospitalData.hospital_name,
      status: hospitalData.availability_status,
      capacity: hospitalData.current_capacity
    });
    
  } catch (error) {
    console.error('❌ Error updating routing:', error);
  }
}

// Notify emergency coordinators
async function notifyEmergencyCoordinators(hospitalData: any) {
  try {
    console.log('👨‍⚕️ Notifying emergency coordinators...');
    
    // Send notifications to emergency coordinators about hospital status
    console.log('Coordinators notified about hospital status change:', {
      hospital: hospitalData.hospital_name,
      new_status: hospitalData.availability_status
    });
    
  } catch (error) {
    console.error('❌ Error notifying coordinators:', error);
  }
}

// Update VAPI protocols
async function updateVAPIProtocols(protocolData: any) {
  try {
    console.log('🤖 Updating VAPI protocols...');
    
    // This would update the VAPI agent's training data/protocols
    console.log('VAPI protocols updated:', {
      protocol: protocolData.protocol_name,
      threshold: protocolData.severity_threshold
    });
    
  } catch (error) {
    console.error('❌ Error updating VAPI protocols:', error);
  }
}

// Notify medical staff
async function notifyMedicalStaff(protocolData: any) {
  try {
    console.log('👩‍⚕️ Notifying medical staff...');
    
    // Send protocol update notifications to medical staff
    console.log('Medical staff notified of protocol update:', {
      protocol: protocolData.protocol_name,
      updated_by: 'System Administrator'
    });
    
  } catch (error) {
    console.error('❌ Error notifying medical staff:', error);
  }
}

// Update emergency algorithms
async function updateEmergencyAlgorithms(protocolData: any) {
  try {
    console.log('⚙️ Updating emergency algorithms...');
    
    // Update the emergency response algorithms based on new protocols
    console.log('Algorithms updated with new protocol:', protocolData.protocol_name);
    
  } catch (error) {
    console.error('❌ Error updating algorithms:', error);
  }
}

// Verify webhook signature (optional security measure)
function verifyWebhookSignature(body: string, signature: string): boolean {
  try {
    const webhookSecret = process.env.STORYBLOK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.log('⚠️ No webhook secret configured, skipping signature verification');
      return true; // Allow if no secret is configured
    }
    
    const expectedSignature = crypto
      .createHmac('sha1', webhookSecret)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error);
    return false;
  }
}




