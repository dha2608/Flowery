import { Router } from 'express';
import { z } from 'zod';

import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rate-limit.js';
import { sendEmail } from '../utils/email.js';
import { env } from '../config/env.js';

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  subject: z.enum(['general', 'order', 'partnership', 'feedback', 'other'], {
    errorMap: () => ({ message: 'Chủ đề không hợp lệ' }),
  }),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự').max(2000),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Câu hỏi chung',
  order: 'Hỗ trợ đơn hàng',
  partnership: 'Hợp tác kinh doanh',
  feedback: 'Góp ý / Phản hồi',
  other: 'Khác',
};

function buildAdminEmailHtml(data: z.infer<typeof contactSchema>): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
        📬 Tin nhắn mới từ trang liên hệ
      </h2>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;">
            <strong>Tên:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            ${data.name}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
            <strong>Email:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <a href="mailto:${data.email}">${data.email}</a>
          </td>
        </tr>
        ${
          data.phone
            ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
            <strong>Điện thoại:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <a href="tel:${data.phone}">${data.phone}</a>
          </td>
        </tr>
        `
            : ''
        }
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
            <strong>Chủ đề:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            ${SUBJECT_LABELS[data.subject] || data.subject}
          </td>
        </tr>
      </table>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong style="color: #333;">Nội dung:</strong>
        <p style="color: #555; line-height: 1.6; margin-top: 10px; white-space: pre-wrap;">
          ${data.message}
        </p>
      </div>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Tin nhắn được gửi từ trang liên hệ Flowery vào ${new Date().toLocaleString('vi-VN')}
      </p>
    </div>
  `;
}

function buildConfirmationEmailHtml(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #f0f0f0;">
        <h1 style="color: #333; margin: 0; font-size: 24px;">🌸 Flowery</h1>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">
          Cảm ơn bạn đã liên hệ, ${name}!
        </h2>
        
        <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
          Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 24-48 giờ làm việc.
        </p>
        
        <p style="color: #555; line-height: 1.8; margin-bottom: 20px;">
          Trong thời gian chờ đợi, bạn có thể:
        </p>
        
        <ul style="color: #555; line-height: 2;">
          <li>Khám phá <a href="${env.CLIENT_URL}/flowers" style="color: #e91e63;">bộ sưu tập hoa</a> của chúng tôi</li>
          <li>Đọc <a href="${env.CLIENT_URL}/faq" style="color: #e91e63;">câu hỏi thường gặp</a></li>
          <li>Theo dõi chúng tôi trên mạng xã hội</li>
        </ul>
        
        <p style="color: #555; line-height: 1.8; margin-top: 30px;">
          Trân trọng,<br>
          <strong>Đội ngũ Flowery</strong>
        </p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 2px solid #f0f0f0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Flowery. Mang yêu thương qua từng cánh hoa.
        </p>
      </div>
    </div>
  `;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/contact
 * Submit contact form - sends email to admin and confirmation to user
 */
router.post('/', authLimiter, validate(contactSchema, 'body'), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof contactSchema>;

    // Send notification to admin
    const adminEmail = env.ADMIN_EMAIL || env.SMTP_USER || 'admin@flowery.vn';
    await sendEmail({
      to: adminEmail,
      subject: `[Flowery] Liên hệ mới: ${SUBJECT_LABELS[data.subject]} - ${data.name}`,
      html: buildAdminEmailHtml(data),
    });

    // Send confirmation to user
    await sendEmail({
      to: data.email,
      subject: 'Flowery - Cảm ơn bạn đã liên hệ!',
      html: buildConfirmationEmailHtml(data.name),
    });

    res.status(200).json({
      success: true,
      message: 'Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể!',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
