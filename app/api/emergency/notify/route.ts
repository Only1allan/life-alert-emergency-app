import { NextResponse } from 'next/server';
import { sendEmailNotification } from '@/lib/emailService';

interface NotificationData {
  emergencyType: string;
  severity: number;
  location: string;
  timestamp: string;
  aiSummary: string;
  storyblokLogId?: number;
  contacts: Array<{
    contact_name: string;
    email?: string;
    phone_number: string;
    relationship: string;
    is_primary: boolean;
  }>;
}

export async function POST(request: Request) {
  try {
    const notificationData: NotificationData = await request.json();
    
    // Process emergency notification

    const results = {
      emailsSent: 0,
      pushNotificationsSent: 0,
      errors: [] as string[],
      notifications: [] as any[]
    };

    // Send notifications to each emergency contact
    for (const contact of notificationData.contacts) {
      try {
        // Prepare notification content using Storyblok templates
        const emergencyMessage = await createEmergencyMessage(notificationData, contact);
        
        // Send email notification (if email available)
        if (contact.email) {
          const emailResult = await sendEmailNotification(contact.email, emergencyMessage);
          
          if (emailResult.success) {
            results.emailsSent++;
            results.notifications.push({
              type: 'email',
              recipient: contact.email,
              status: 'sent',
              contact: contact.contact_name,
              messageId: emailResult.messageId,
              mock: (emailResult as any).mock || false
            });
          } else {
            results.errors.push(`Email failed for ${contact.contact_name}: ${(emailResult as any).error}`);
          }
        }

        // Send push notification (mock implementation)
        const pushResult = await sendPushNotification(contact, emergencyMessage);
        if (pushResult.success) {
          results.pushNotificationsSent++;
          results.notifications.push({
            type: 'push',
            recipient: contact.phone_number,
            status: 'sent',
            contact: contact.contact_name
          });
        }

        // Log notification in Storyblok
        await logNotificationToStoryblok(contact, notificationData, 'sent');

      } catch (error) {
        const errorMessage = `Failed to notify ${contact.contact_name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMessage);
      }
    }

    // Create summary notification log
    await createNotificationSummary(notificationData, results);

    return NextResponse.json({
      success: true,
      message: 'Emergency notifications processed',
      results: {
        emailsSent: results.emailsSent,
        pushNotificationsSent: results.pushNotificationsSent,
        totalContacts: notificationData.contacts.length,
        errors: results.errors,
        notifications: results.notifications
      }
    });

  } catch (error) {
    console.error('❌ Error processing emergency notifications:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// Create emergency message using Storyblok templates
async function createEmergencyMessage(data: NotificationData, contact: any) {
  try {
    console.log(`📧 Fetching template for: ${data.emergencyType}, severity: ${data.severity}`);
    
    // Fetch template from our simplified API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/storyblok/templates?type=${data.emergencyType}&severity=${data.severity}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Template API error: ${response.status}`);
    }

    const templateData = await response.json();
    const template = templateData.template;
    
    if (template) {
      console.log(`📧 Using template: ${template.template_name} (${templateData.source})`);
      return renderTemplate(template, data, contact);
    }
  } catch (error) {
    console.log('⚠️ Failed to load template, using fallback:', error);
  }

  // Simple fallback template
  console.log('📧 Using fallback template');
  const severityText = data.severity >= 8 ? 'CRITICAL' : data.severity >= 5 ? 'MODERATE' : 'LOW';
  const urgencyEmoji = data.severity >= 8 ? '🚨' : data.severity >= 5 ? '⚠️' : 'ℹ️';
  
  return {
    subject: `${urgencyEmoji} EMERGENCY ALERT - ${data.emergencyType.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${data.severity >= 8 ? '#dc2626' : data.severity >= 5 ? '#ea580c' : '#2563eb'}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">${urgencyEmoji} EMERGENCY ALERT</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Severity: ${severityText} (${data.severity}/10)</p>
        </div>
        
        <div style="padding: 20px;">
          <p><strong>Hello ${contact.contact_name},</strong></p>
          <p>Your emergency contact has activated their LifeGuard Pro system.</p>
          
          <p><strong>Emergency Details:</strong></p>
          <ul>
            <li><strong>Type:</strong> ${data.emergencyType.replace('_', ' ').toUpperCase()}</li>
            <li><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</li>
            <li><strong>Location:</strong> ${data.location}</li>
            <li><strong>AI Assessment:</strong> ${data.aiSummary}</li>
          </ul>
          
          <div style="background: #fef3c7; padding: 15px; margin: 20px 0;">
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              ${data.severity >= 8 ? 
                '<li>Call 911 immediately if not already done</li><li>Go to their location if safe to do so</li><li>Contact other family members</li>' :
                data.severity >= 5 ?
                '<li>Contact them immediately by phone</li><li>Consider going to their location</li><li>Stay in communication until resolved</li>' :
                '<li>Call them to check on their wellbeing</li><li>Follow up within the next hour</li>'
              }
            </ul>
          </div>
        </div>
      </div>
    `,
    text: `
EMERGENCY ALERT - ${data.emergencyType.toUpperCase()}
Severity: ${severityText} (${data.severity}/10)

Hello ${contact.contact_name},

Your emergency contact has activated their LifeGuard Pro system.

Details:
- Type: ${data.emergencyType.replace('_', ' ')}
- Time: ${new Date(data.timestamp).toLocaleString()}
- Location: ${data.location}
- AI Assessment: ${data.aiSummary}

${data.severity >= 8 ? 
  'This appears to be a critical emergency. Please call 911 if not already done and go to the location if safe.' :
  data.severity >= 5 ?
  'This appears to be a moderate emergency requiring attention. Please contact them immediately.' :
  'This appears to be a low-severity alert but still requires your attention. Please contact them to check on their wellbeing.'
}

This alert was generated by LifeGuard Pro Emergency Response System.
    `
  };
}



// Legacy function for backward compatibility
async function getMessageTemplate(severity: number) {
  try {
    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      return null;
    }

    // Determine template type based on severity
    let templateType = 'moderate_emergency_email';
    if (severity >= 8) {
      templateType = 'critical_emergency_email';
    } else if (severity < 5) {
      templateType = 'emergency_sms';
    }

    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?token=${storyblokToken}&filter_query[component][eq]=message_template&filter_query[template_name][eq]=${templateType}&per_page=1`,
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
        return data.stories[0].content;
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching message template:', error);
    return null;
  }
}

// Render template with data
function renderTemplate(template: any, data: NotificationData, contact: any) {
  const variables = {
    contact_name: contact.contact_name || 'Emergency Contact',
    severity: data.severity,
    emergency_type: data.emergencyType.replace('_', ' ').toUpperCase(),
    timestamp: new Date(data.timestamp).toLocaleString(),
    location: data.location,
    ai_summary: data.aiSummary,
    storyblok_log_id: data.storyblokLogId || 'N/A'
  };

  // Simple template variable replacement
  function replaceVariables(text: string) {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
    return result;
  }

  return {
    subject: replaceVariables(template.subject_line || 'Emergency Alert'),
    html: replaceVariables(template.email_body || ''),
    text: replaceVariables(template.text_template || '')
  };
}

// Email notification function is now imported from emailService.ts

// Send push notification (mock implementation)
async function sendPushNotification(contact: any, message: any) {
  try {
    console.log(`📱 Sending push notification to ${contact.contact_name}...`);
    
    // Mock push notification - integrate with Firebase, OneSignal, etc.
    // For demo purposes, we'll simulate success
    
    console.log(`✅ Push notification sent to ${contact.contact_name}`);
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Push notification failed for ${contact.contact_name}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Push notification failed' 
    };
  }
}

// Log notification to Storyblok
async function logNotificationToStoryblok(contact: any, emergencyData: NotificationData, status: string) {
  try {
    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.log('⚠️ Storyblok not configured, skipping notification log');
      return;
    }

    const notificationLogData = {
      story: {
        name: `Notification - ${contact.contact_name} - ${new Date().toLocaleString()}`,
        slug: `notification-${Date.now()}-${contact.contact_name.toLowerCase().replace(/\s+/g, '-')}`,
        content: {
          component: 'emergency_notification',
          contact_name: contact.contact_name,
          contact_email: contact.email || '',
          contact_phone: contact.phone_number,
          relationship: contact.relationship,
          emergency_type: emergencyData.emergencyType,
          severity: emergencyData.severity,
          notification_status: status,
          sent_at: new Date().toISOString(),
          emergency_timestamp: emergencyData.timestamp,
          storyblok_log_reference: emergencyData.storyblokLogId
        }
      }
    };

    await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
      {
        method: 'POST',
        headers: {
          'Authorization': storyblokToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationLogData),
      }
    );

    console.log(`📝 Notification logged to Storyblok for ${contact.contact_name}`);
    
  } catch (error) {
    console.error('❌ Error logging notification to Storyblok:', error);
  }
}

// Create notification summary in Storyblok
async function createNotificationSummary(data: NotificationData, results: any) {
  try {
    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) return;

    const summaryData = {
      story: {
        name: `Notification Summary - ${data.emergencyType} - ${new Date().toLocaleString()}`,
        slug: `notification-summary-${Date.now()}`,
        content: {
          component: 'notification_summary',
          emergency_type: data.emergencyType,
          severity: data.severity,
          total_contacts: data.contacts.length,
          emails_sent: results.emailsSent,
          push_notifications_sent: results.pushNotificationsSent,
          errors_count: results.errors.length,
          errors_details: results.errors.join('; '),
          created_at: new Date().toISOString(),
          emergency_reference: data.storyblokLogId
        }
      }
    };

    await fetch(
      `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`,
      {
        method: 'POST',
        headers: {
          'Authorization': storyblokToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(summaryData),
      }
    );

    console.log('📊 Notification summary logged to Storyblok');
    
  } catch (error) {
    console.error('❌ Error creating notification summary:', error);
  }
}
