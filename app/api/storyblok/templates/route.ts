import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  let type = 'panic_button';
  let severity = 8;
  
  try {
    const { searchParams } = new URL(request.url);
    type = searchParams.get('type') || 'panic_button';
    severity = parseInt(searchParams.get('severity') || '8');

    console.log('📧 Fetching emergency template:', { type, severity });

    const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID;
    
    if (!storyblokToken || !spaceId) {
      console.log('⚠️ Storyblok not configured, using fallback template');
      return NextResponse.json(getFallbackTemplate(type, severity));
    }

    // Determine severity level for Storyblok query
    let severityLevel = 'low';
    if (severity >= 8) {
      severityLevel = 'critical';
    } else if (severity >= 5) {
      severityLevel = 'moderate';
    }

    // Query Storyblok for matching template
    const query = `https://api.storyblok.com/v2/cdn/stories?token=${storyblokToken}&filter_query[component][eq]=emergency_template&filter_query[emergency_type][eq]=${type}&filter_query[severity_level][eq]=${severityLevel}&filter_query[is_active][eq]=true&per_page=1`;

    const response = await fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Storyblok API error:', response.status);
      return NextResponse.json(getFallbackTemplate(type, severity));
    }

    const data = await response.json();
    const template = data.stories?.[0]?.content;
    
    if (template) {
      console.log(`📧 Found Storyblok template: ${template.template_name}`);
      return NextResponse.json({
        success: true,
        template: template,
        source: 'storyblok'
      });
    } else {
      console.log('📧 No Storyblok template found, using fallback');
      return NextResponse.json(getFallbackTemplate(type, severity));
    }

  } catch (error) {
    console.error('❌ Error fetching template:', error);
    return NextResponse.json(getFallbackTemplate(type, severity));
  }
}

// Fallback template when Storyblok is not available
function getFallbackTemplate(type: string, severity: number) {
  console.log('⚠️ Using fallback template - Storyblok not configured or template not found');
  
  const severityText = severity >= 8 ? 'CRITICAL' : severity >= 5 ? 'MODERATE' : 'LOW';
  const urgencyEmoji = severity >= 8 ? '🚨' : severity >= 5 ? '⚠️' : 'ℹ️';
  
  return {
    success: true,
    template: {
      template_name: `Fallback ${severityText} Alert`,
      emergency_type: type,
      severity_level: severity >= 8 ? 'critical' : severity >= 5 ? 'moderate' : 'low',
      subject_line: `${urgencyEmoji} EMERGENCY ALERT - {{contact_name}} needs help`,
      email_body: `
        <div style="background: ${severity >= 8 ? '#dc2626' : severity >= 5 ? '#ea580c' : '#2563eb'}; color: white; padding: 20px; border-radius: 8px;">
          <h1>${urgencyEmoji} EMERGENCY ALERT</h1>
          <p>Severity: {{severity}}/10</p>
        </div>
        <div style="padding: 20px;">
          <p><strong>Hello {{contact_name}},</strong></p>
          <p>Your emergency contact has activated their Life GuardPro system.</p>
          <p><strong>Emergency Details:</strong></p>
          <ul>
            <li><strong>Type:</strong> {{emergency_type}}</li>
            <li><strong>Time:</strong> {{timestamp}}</li>
            <li><strong>Location:</strong> {{location}}</li>
            <li><strong>AI Assessment:</strong> {{ai_summary}}</li>
          </ul>
          <div style="background: #fef3c7; padding: 15px; margin: 20px 0;">
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              ${severity >= 8 ? 
                '<li>Call 911 immediately if not already done</li><li>Go to their location if safe to do so</li><li>Contact other family members</li>' :
                severity >= 5 ?
                '<li>Contact them immediately by phone</li><li>Consider going to their location</li><li>Stay in communication until resolved</li>' :
                '<li>Call them to check on their wellbeing</li><li>Follow up within the next hour</li>'
              }
            </ul>
          </div>
        </div>
      `,
      is_active: true,
      priority: 1
    },
    source: 'fallback'
  };
}
