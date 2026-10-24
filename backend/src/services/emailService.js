import nodemailer from 'nodemailer';
import config from '../config/config.js';

// Create transporter
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP)
  // For production, use real SMTP (Gmail, SendGrid, etc.)
  
  if (config.nodeEnv === 'production' && config.emailHost) {
    return nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
  }
  
  // Development mode - log to console
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 EMAIL SENT (Development Mode):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log('Content:');
      console.log(mailOptions.text || mailOptions.html);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, userName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: '"AICTE Nidhi Track" <noreply@aicte.gov.in>',
    to: email,
    subject: 'OTP for Institution Login - AICTE Nidhi Track',
    text: `
Dear ${userName},

Your One-Time Password (OTP) for accessing AICTE Nidhi Track is:

${otp}

This OTP is valid for 10 minutes only.

For security reasons:
- Do not share this OTP with anyone
- AICTE officials will never ask for your OTP

If you did not request this OTP, please ignore this email and contact AICTE support immediately.

Best regards,
AICTE Nidhi Track Team
All India Council for Technical Education
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .otp-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 AICTE Nidhi Track</h1>
      <p>Institution Login Verification</p>
    </div>
    
    <div class="content">
      <p>Dear <strong>${userName}</strong>,</p>
      
      <p>Your One-Time Password (OTP) for accessing AICTE Nidhi Track is:</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="color: #6b7280; margin-top: 10px;">Valid for 10 minutes</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Do not share this OTP with anyone</li>
          <li>AICTE officials will never ask for your OTP</li>
          <li>This OTP expires in 10 minutes</li>
        </ul>
      </div>
      
      <p>If you did not request this OTP, please ignore this email and contact AICTE support immediately at <a href="mailto:support@aicte.gov.in">support@aicte.gov.in</a></p>
    </div>
    
    <div class="footer">
      <p><strong>AICTE Nidhi Track</strong></p>
      <p>All India Council for Technical Education</p>
      <p>Ministry of Education, Government of India</p>
      <p style="margin-top: 10px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

export default {
  sendOTPEmail,
  generateOTP
};
