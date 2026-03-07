// ─── Email Template Helpers ────────────────────────────────────────────────────

const BRAND_COLOR = '#EC4899';
const BRAND_BG = '#FDF2F8';

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%">
<!-- Header -->
<tr><td style="background:${BRAND_COLOR};padding:24px 32px;text-align:center">
  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">🌸 Flowery</h1>
  <p style="margin:4px 0 0;color:#fce7f3;font-size:13px">Hoa gửi yêu thương</p>
</td></tr>
<!-- Body -->
<tr><td style="padding:32px">
  ${content}
</td></tr>
<!-- Footer -->
<tr><td style="background:${BRAND_BG};padding:20px 32px;text-align:center;border-top:1px solid #fce7f3">
  <p style="margin:0;color:#9ca3af;font-size:12px">
    © ${new Date().getFullYear()} Flowery — Hoa gửi yêu thương<br>
    <a href="https://flowery.vn" style="color:${BRAND_COLOR};text-decoration:none">flowery.vn</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function button(text: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0">
<tr><td align="center">
  <a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600">${text}</a>
</td></tr>
</table>`;
}

// ─── Templates ─────────────────────────────────────────────────────────────────

export function verificationEmail(name: string, verifyUrl: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px">Chào ${name}! 👋</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6">
      Cảm ơn bạn đã đăng ký tài khoản <strong>Flowery</strong>. Để hoàn tất đăng ký và bảo vệ tài khoản, vui lòng xác thực email của bạn.
    </p>
    ${button('Xác thực email', verifyUrl)}
    <p style="color:#6b7280;font-size:13px;line-height:1.5">
      Link xác thực có hiệu lực trong <strong>24 giờ</strong>.<br>
      Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <p style="color:#9ca3af;font-size:12px">
      Không click được nút? Sao chép link sau vào trình duyệt:<br>
      <a href="${verifyUrl}" style="color:${BRAND_COLOR};word-break:break-all">${verifyUrl}</a>
    </p>
  `);
}

export function passwordResetEmail(name: string, resetUrl: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px">Đặt lại mật khẩu</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6">
      Xin chào <strong>${name}</strong>, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Flowery của bạn.
    </p>
    ${button('Đặt lại mật khẩu', resetUrl)}
    <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px 16px;border-radius:4px;margin:16px 0">
      <p style="color:#991B1B;font-size:13px;margin:0">
        ⚠️ <strong>Lưu ý bảo mật:</strong> Link có hiệu lực trong <strong>1 giờ</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và đảm bảo tài khoản của bạn an toàn.
      </p>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <p style="color:#9ca3af;font-size:12px">
      Không click được nút? Sao chép link:<br>
      <a href="${resetUrl}" style="color:${BRAND_COLOR};word-break:break-all">${resetUrl}</a>
    </p>
  `);
}

export interface OrderEmailData {
  orderNumber: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  };
  deliveryDate: Date;
  deliveryAddress: { recipientName: string; city: string };
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function orderConfirmationEmail(name: string, order: OrderEmailData): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px">${item.productName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right">${formatVND(item.unitPrice * item.quantity)}</td>
    </tr>`
    )
    .join('');

  const deliveryDateStr = new Date(order.deliveryDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return layout(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px">Đặt hàng thành công! 🎉</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6">
      Xin chào <strong>${name}</strong>, đơn hàng <strong>#${order.orderNumber}</strong> của bạn đã được tiếp nhận.
    </p>

    <!-- Order Items -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <tr style="background:#f9fafb">
        <th style="padding:10px 12px;text-align:left;color:#6b7280;font-size:13px;font-weight:600">Sản phẩm</th>
        <th style="padding:10px 12px;text-align:center;color:#6b7280;font-size:13px;font-weight:600">SL</th>
        <th style="padding:10px 12px;text-align:right;color:#6b7280;font-size:13px;font-weight:600">Thành tiền</th>
      </tr>
      ${itemRows}
    </table>

    <!-- Pricing -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px">Tạm tính</td><td style="padding:4px 0;text-align:right;color:#374151;font-size:14px">${formatVND(order.pricing.subtotal)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px">Phí giao hàng</td><td style="padding:4px 0;text-align:right;color:#374151;font-size:14px">${formatVND(order.pricing.deliveryFee)}</td></tr>
      ${order.pricing.discount > 0 ? `<tr><td style="padding:4px 0;color:#059669;font-size:14px">Giảm giá</td><td style="padding:4px 0;text-align:right;color:#059669;font-size:14px">-${formatVND(order.pricing.discount)}</td></tr>` : ''}
      <tr><td style="padding:8px 0 0;color:#111827;font-size:16px;font-weight:700;border-top:2px solid #e5e7eb">Tổng cộng</td><td style="padding:8px 0 0;text-align:right;color:${BRAND_COLOR};font-size:16px;font-weight:700;border-top:2px solid #e5e7eb">${formatVND(order.pricing.totalAmount)}</td></tr>
    </table>

    <!-- Delivery Info -->
    <div style="background:${BRAND_BG};padding:16px;border-radius:8px;margin:16px 0">
      <p style="margin:0 0 4px;color:#111827;font-size:14px;font-weight:600">📦 Thông tin giao hàng</p>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.5">
        Người nhận: <strong>${order.deliveryAddress.recipientName}</strong><br>
        Khu vực: ${order.deliveryAddress.city}<br>
        Ngày giao: <strong>${deliveryDateStr}</strong>
      </p>
    </div>

    ${button('Xem đơn hàng', 'https://flowery.vn/orders')}
  `);
}

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Chờ xác nhận',
  confirmed: '✅ Đã xác nhận',
  preparing: '💐 Đang chuẩn bị',
  delivering: '🚚 Đang giao hàng',
  delivered: '🎉 Đã giao thành công',
  cancelled: '❌ Đã hủy',
  refunded: '💰 Đã hoàn tiền',
};

export function orderStatusEmail(
  name: string,
  orderNumber: string,
  status: string,
  note?: string
): string {
  const statusLabel = STATUS_LABELS[status] ?? status;

  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px">Cập nhật đơn hàng</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6">
      Xin chào <strong>${name}</strong>, đơn hàng <strong>#${orderNumber}</strong> của bạn đã được cập nhật.
    </p>

    <div style="background:${BRAND_BG};padding:20px;border-radius:8px;text-align:center;margin:20px 0">
      <p style="margin:0;color:#111827;font-size:18px;font-weight:700">${statusLabel}</p>
    </div>

    ${note ? `<div style="background:#f9fafb;padding:12px 16px;border-radius:8px;margin:16px 0"><p style="margin:0;color:#374151;font-size:14px">📝 ${note}</p></div>` : ''}

    ${button('Xem chi tiết đơn hàng', `https://flowery.vn/orders`)}
  `);
}

export function eventReminderEmail(
  name: string,
  eventTitle: string,
  eventDate: Date,
  daysUntil: number,
  recipientName: string
): string {
  const dateStr = new Date(eventDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const urgencyColor = daysUntil <= 1 ? '#EF4444' : daysUntil <= 3 ? '#F59E0B' : '#10B981';

  return layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px">Nhắc nhở sự kiện 🔔</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6">
      Xin chào <strong>${name}</strong>, sự kiện quan trọng sắp đến!
    </p>

    <div style="background:${BRAND_BG};padding:20px;border-radius:8px;margin:20px 0">
      <p style="margin:0 0 8px;color:#111827;font-size:18px;font-weight:700">${eventTitle}</p>
      <p style="margin:0 0 4px;color:#374151;font-size:14px">
        📅 ${dateStr}
      </p>
      <p style="margin:0 0 4px;color:#374151;font-size:14px">
        👤 Dành cho: <strong>${recipientName}</strong>
      </p>
      <p style="margin:8px 0 0">
        <span style="display:inline-block;background:${urgencyColor};color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600">
          Còn ${daysUntil} ngày
        </span>
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.6">
      Hãy chuẩn bị một bó hoa thật đẹp để gửi tặng ${recipientName} nhé! 🌸
    </p>

    ${button('Chọn hoa ngay', 'https://flowery.vn/flowers')}
  `);
}
