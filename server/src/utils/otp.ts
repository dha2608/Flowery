import twilio from 'twilio';
import { env } from '../config/env.js';

let twilioClient: twilio.Twilio | null = null;

// Initialize Twilio
function initializeTwilio() {
  if (twilioClient) return;

  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured. SMS OTP disabled.');
    return;
  }

  twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  console.log('Twilio client initialized');
}

initializeTwilio();

// ─── Send SMS OTP ─────────────────────────────────────────────────────────────

export async function sendSMSOTP(phone: string, code: string): Promise<boolean> {
  if (!twilioClient) {
    console.warn('Twilio not initialized. SMS not sent.');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: `[Flowery] Mã xác thực của bạn là: ${code}. Có hiệu lực trong 5 phút.`,
      from: env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

// ─── Send Email OTP ───────────────────────────────────────────────────────────

import { sendEmail } from './email.js';

export async function sendEmailOTP(email: string, code: string, name?: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; }
        .title { font-size: 24px; color: #1a1a1a; margin: 10px 0; }
        .code-box { 
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 20px 0;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #be185d;
        }
        .info { color: #6b7280; font-size: 14px; line-height: 1.6; }
        .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌸</div>
          <h1 class="title">Flowery</h1>
        </div>
        
        <p>Xin chào${name ? ` ${name}` : ''},</p>
        <p>Đây là mã xác thực của bạn:</p>
        
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        
        <p class="info">
          Mã này có hiệu lực trong <strong>5 phút</strong>.<br>
          Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
        </p>
        
        <div class="footer">
          <p>© 2026 Flowery. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: email,
      subject: `[Flowery] Mã xác thực: ${code}`,
      html,
    });
    return true;
  } catch {
    return false;
  }
}
