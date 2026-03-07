import crypto from 'node:crypto';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Order } from '../models/order.model.js';
import { env } from '../config/env.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error-handler.js';

export const paymentRouter = Router();

const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Schemas ───────────────────────────────────────────────────────────────

const vnpayCreateSchema = z.object({
  orderId: z.string().min(1),
  bankCode: z.string().optional(),
  language: z.enum(['vn', 'en']).optional().default('vn'),
});

const momoCreateSchema = z.object({
  orderId: z.string().min(1),
});

const zalopayCreateSchema = z.object({
  orderId: z.string().min(1),
});

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Format Date to VNPay's required yyyyMMddHHmmss in UTC+7 */
function formatVnpDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return (
    vnDate.getUTCFullYear().toString() +
    pad(vnDate.getUTCMonth() + 1) +
    pad(vnDate.getUTCDate()) +
    pad(vnDate.getUTCHours()) +
    pad(vnDate.getUTCMinutes()) +
    pad(vnDate.getUTCSeconds())
  );
}

/** Sort params, HMAC-SHA512 sign, and build full VNPay URL */
function buildVnpaySignedUrl(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  const signData = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
  const secureHash = crypto
    .createHmac('sha512', env.VNPAY_HASH_SECRET ?? '')
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
  const queryString = sortedKeys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
  return `${env.VNPAY_URL ?? ''}?${queryString}&vnp_SecureHash=${secureHash}`;
}

/** Best-effort client IP extraction */
function getClientIp(req: Request): string {
  return String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '127.0.0.1')
    .split(',')[0]
    .trim();
}

// ─── POST /vnpay/create-payment ───────────────────────────────────────────
paymentRouter.post(
  '/vnpay/create-payment',
  requireAuth,
  validate(vnpayCreateSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { orderId, bankCode, language } = req.body as z.infer<typeof vnpayCreateSchema>;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');
    if (order.paymentMethod !== 'vnpay')
      throw new BadRequestError('Order payment method is not VNPay');
    if (order.paymentStatus !== 'pending')
      throw new BadRequestError('Order is not pending payment');

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: env.VNPAY_TMN_CODE ?? '',
      // VNPay stores amount * 100 (no decimals)
      vnp_Amount: String(Math.round(order.pricing.totalAmount * 100)),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.orderNumber,
      vnp_OrderInfo: `Thanh toan don hang ${order.orderNumber}`,
      vnp_OrderType: '250006',
      vnp_Locale: language ?? 'vn',
      vnp_ReturnUrl: env.VNPAY_RETURN_URL ?? '',
      vnp_IpAddr: getClientIp(req),
      vnp_CreateDate: formatVnpDate(new Date()),
    };

    if (bankCode) params['vnp_BankCode'] = bankCode;

    res.json({ success: true, data: { paymentUrl: buildVnpaySignedUrl(params) } });
  })
);

// ─── POST /momo/create-payment ────────────────────────────────────────────
paymentRouter.post(
  '/momo/create-payment',
  requireAuth,
  validate(momoCreateSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { orderId } = req.body as z.infer<typeof momoCreateSchema>;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');
    if (order.paymentMethod !== 'momo')
      throw new BadRequestError('Order payment method is not MoMo');
    if (order.paymentStatus !== 'pending')
      throw new BadRequestError('Order is not pending payment');

    const partnerCode = env.MOMO_PARTNER_CODE ?? '';
    const accessKey = env.MOMO_ACCESS_KEY ?? '';
    const secretKey = env.MOMO_SECRET_KEY ?? '';
    const requestId = `${order.orderNumber}_${Date.now()}`;
    const amount = Math.round(order.pricing.totalAmount);
    const orderInfo = `Thanh toan don hang ${order.orderNumber}`;
    const redirectUrl = `${env.CLIENT_URL}/payment/result`;
    const ipnUrl = `${env.CLIENT_URL}/api/v1/webhooks/momo`;
    const requestType = 'payWithMethod';
    const extraData = '';
    const lang = 'vi';

    // MoMo signature fields must be in exact alphabetical order
    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${order.orderNumber}`,
      `orderInfo=${orderInfo}`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const momoResponse = await fetch('https://payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerCode,
        requestId,
        amount,
        orderId: order.orderNumber,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        lang,
        signature,
      }),
    });

    if (!momoResponse.ok) {
      throw new BadRequestError('Failed to connect to MoMo payment gateway');
    }

    const data = (await momoResponse.json()) as {
      payUrl?: string;
      deeplink?: string;
      qrCodeUrl?: string;
      resultCode: number;
      message: string;
    };

    if (data.resultCode !== 0) {
      throw new BadRequestError(`MoMo error: ${data.message}`);
    }

    res.json({
      success: true,
      data: { paymentUrl: data.payUrl, deeplink: data.deeplink, qrCodeUrl: data.qrCodeUrl },
    });
  })
);

// ─── POST /zalopay/create-payment ─────────────────────────────────────────
paymentRouter.post(
  '/zalopay/create-payment',
  requireAuth,
  validate(zalopayCreateSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { orderId } = req.body as z.infer<typeof zalopayCreateSchema>;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');
    if (order.paymentMethod !== 'zalopay')
      throw new BadRequestError('Order payment method is not ZaloPay');
    if (order.paymentStatus !== 'pending')
      throw new BadRequestError('Order is not pending payment');

    const appId = env.ZALOPAY_APP_ID ?? '';
    const key1 = env.ZALOPAY_KEY1 ?? '';
    const appUser = userId;
    const appTime = Date.now();

    // app_trans_id format: yyMMdd_<orderNumber>
    const now = new Date();
    const dateStr =
      String(now.getFullYear()).slice(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const appTransId = `${dateStr}_${order.orderNumber}`;

    const amount = Math.round(order.pricing.totalAmount);
    const embedData = JSON.stringify({ redirecturl: `${env.CLIENT_URL}/payment/result` });
    const item = JSON.stringify(
      order.items.map((i) => ({
        itemid: i.productId.toString(),
        itemname: i.productName,
        itemprice: i.unitPrice,
        itemquantity: i.quantity,
      }))
    );
    const description = `Flowery - Thanh toan don hang ${order.orderNumber}`;

    // mac = HMAC-SHA256("app_id|app_trans_id|app_user|amount|app_time|embed_data|item", KEY1)
    const macData = `${appId}|${appTransId}|${appUser}|${amount}|${appTime}|${embedData}|${item}`;
    const mac = crypto.createHmac('sha256', key1).update(macData).digest('hex');

    const zalopayResponse = await fetch('https://sb.zalopay.vn/v001/tpe/createorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        app_id: appId,
        app_trans_id: appTransId,
        app_user: appUser,
        app_time: String(appTime),
        item,
        embed_data: embedData,
        amount: String(amount),
        description,
        bank_code: '',
        mac,
      }).toString(),
    });

    if (!zalopayResponse.ok) {
      throw new BadRequestError('Failed to connect to ZaloPay payment gateway');
    }

    const data = (await zalopayResponse.json()) as {
      return_code: number;
      return_message: string;
      order_url?: string;
      zp_trans_token?: string;
    };

    if (data.return_code !== 1) {
      throw new BadRequestError(`ZaloPay error: ${data.return_message}`);
    }

    res.json({
      success: true,
      data: { paymentUrl: data.order_url, zp_trans_token: data.zp_trans_token },
    });
  })
);
