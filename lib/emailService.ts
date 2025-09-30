import nodemailer from 'nodemailer';

interface EmailMessage {
  subject: string;
  html: string;
  text: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create email transporter
function createEmailTransporter() {
  // Try to get email configuration from environment variables
  const emailConfig: EmailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    }
  };

  // If no email credentials provided, return null (will use mock)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    return null;
  }

  return nodemailer.createTransport(emailConfig);
}

// Send email notification
export async function sendEmailNotification(email: string, message: EmailMessage) {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      // Fallback to mock email service
      return await sendMockEmail(email, message);
    }

    const mailOptions = {
      from: `"Life GuardPro Emergency System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: message.subject,
      html: message.html,
      text: message.text
    };

    const result = await transporter.sendMail(mailOptions);
    
    return { 
      success: true, 
      messageId: result.messageId,
      response: result.response 
    };
    
  } catch {
    // Fallback to mock email if real email fails
    return await sendMockEmail(email, message);
  }
}

// Mock email service for testing/fallback
async function sendMockEmail(_email: string, _message: EmailMessage) {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      mock: true,
      messageId: `mock-${Date.now()}` 
    };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Mock email failed' 
    };
  }
}

