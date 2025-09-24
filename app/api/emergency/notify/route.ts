import { NextResponse } from 'next/server';

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
    
    console.log('📧 Sending emergency notifications:', {
      type: notificationData.emergencyType,
      severity: notificationData.severity,
      contactCount: notificationData.contacts.length
    });

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
              contact: contact.contact_name
            });
          } else {
            results.errors.push(`Email failed for ${contact.contact_name}: ${emailResult.error}`);
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
        console.error('❌', errorMessage);
      }
    }

    // Create summary notification log
    await createNotificationSummary(notificationData, results);

    console.log('📊 Notification results:', {
      emailsSent: results.emailsSent,
      pushSent: results.pushNotificationsSent,
      errors: results.errors.length
    });

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

// Create emergency message content using Storyblok templates
async function createEmergencyMessage(data: NotificationData, contact: any) {
  try {
    // Try to get message template from Storyblok
    const template = await getMessageTemplate(data.severity);
    
    if (template) {
      console.log(`📧 Using Storyblok template: ${template.template_name}`);
      return renderTemplate(template, data, contact);
    }
  } catch (error) {
    console.log('⚠️ Failed to load Storyblok template, using fallback');
  }

  // Fallback to hardcoded template
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
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Emergency Details</h2>
          <p><strong>Type:</strong> ${data.emergencyType.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>AI Assessment:</strong> ${data.aiSummary}</p>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Hello ${contact.contact_name},</strong></p>
          <p style="margin: 10px 0 0 0;">Your emergency contact has activated their Life Alert system. ${data.severity >= 8 ? 'This appears to be a critical emergency and emergency services may have been contacted.' : data.severity >= 5 ? 'This appears to be a moderate emergency requiring attention.' : 'This appears to be a low-severity alert but still requires your attention.'}</p>
        </div>
        
        <div style="background: #e5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">Recommended Actions:</h3>
          <ul style="color: #1e40af;">
            ${data.severity >= 8 ? 
              '<li>Call emergency services (911) if not already contacted</li><li>Go to the location immediately if safe to do so</li><li>Contact other family members</li>' :
              data.severity >= 5 ?
              '<li>Contact them immediately by phone</li><li>Consider going to their location</li><li>Stay in communication until situation is resolved</li>' :
              '<li>Contact them by phone to check on their wellbeing</li><li>Follow up within the next hour</li>'
            }
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px;">
            This alert was generated by Life Alert Emergency Response System<br>
            ${data.storyblokLogId ? `Log ID: ${data.storyblokLogId}` : ''}<br>
            Time sent: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `,
    text: `
EMERGENCY ALERT - ${data.emergencyType.toUpperCase()}
Severity: ${severityText} (${data.severity}/10)

Hello ${contact.contact_name},

Your emergency contact has activated their Life Alert system.

Details:
- Type: ${data.emergencyType.replace('_', ' ')}
- Time: ${new Date(data.timestamp).toLocaleString()}
- Location: ${data.location}
- AI Assessment: ${data.aiSummary}

${data.severity >= 8 ? 
  'This appears to be a critical emergency. Emergency services may have been contacted. Please call 911 if not already done and go to the location if safe.' :
  data.severity >= 5 ?
  'This appears to be a moderate emergency requiring attention. Please contact them immediately.' :
  'This appears to be a low-severity alert but still requires your attention. Please contact them to check on their wellbeing.'
}

This alert was generated by Life Alert Emergency Response System.
    `
  };
}

// Get message template from Storyblok based on severity
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
  const templateData = {
    contact_name: contact.contact_name,
    emergency_type: data.emergencyType.replace('_', ' ').toUpperCase(),
    severity: data.severity,
    timestamp: new Date(data.timestamp).toLocaleString(),
    location: data.location,
    ai_summary: data.aiSummary,
    storyblok_log_id: data.storyblokLogId || 'N/A'
  };

  // Simple template replacement
  const replaceVariables = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return templateData[key as keyof typeof templateData] || match;
    });
  };

  return {
    subject: replaceVariables(template.subject_template || 'Emergency Alert'),
    html: replaceVariables(template.html_template || 'Emergency notification'),
    text: replaceVariables(template.text_template || 'Emergency notification'),
    sms: replaceVariables(template.sms_template || 'Emergency alert')
  };
}

// Send email notification (mock implementation - integrate with your email service)
async function sendEmailNotification(email: string, message: any) {
  try {
    console.log(`📧 Sending email to ${email}...`);
    
    // Mock email sending - replace with actual email service (SendGrid, AWS SES, etc.)
    // For demo purposes, we'll simulate success
    
    // Example with a hypothetical email service:
    /*
    const emailResponse = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: email,
        subject: message.subject,
        html: message.html,
        text: message.text
      })
    });
    */
    
    // Mock successful response
    console.log(`✅ Email sent successfully to ${email}`);
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Email failed for ${email}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Email sending failed' 
    };
  }
}

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
