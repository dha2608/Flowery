import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Create transporter - uses SMTP if configured, otherwise console.log fallback
const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: (env.SMTP_PORT || 587) === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (transporter) {
    await transporter.sendMail({
      from: `"Flowery" <${env.SMTP_USER || 'noreply@flowery.vn'}>`,
      ...options,
    });
  } else {
    console.log(`[EMAIL] To: ${options.to} | Subject: ${options.subject}`);
    console.log(`[EMAIL] Body preview: ${options.html.substring(0, 200)}...`);
  }
}
