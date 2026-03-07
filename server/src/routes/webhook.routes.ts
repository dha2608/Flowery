import crypto from 'node:crypto';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { Order } from '../models/order.model.js';
import { env } from '../config/env.js';

export const webhookRouter = Router();

const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helper: mark order paid + auto-confirm ───────────────────────────────

async function updateOrderPaid(orderNumber: string, transactionId: string): Promise<void> {
  const order = await Order.findOne({ orderNumber });
  if (!order || order.paymentStatus === 'paid') return; // Not found or already processed

  const now = new Date();
  order.paymentStatus = 'paid';
  order.paymentDetails = { transactionId, paidAt: now };
  order.status = 'confirmed';
  (order.statusHistory as { status: string; timestamp: Date; note?: string }[]).push({
    status: 'confirmed',
    timestamp: now,
    note: 'Payment confirmed automatically',
  });

  await order.save();
}

// ─── POST /vnpay ─ VNPay IPN ──────────────────────────────────────────────
webhookRouter.post(
  '/vnpay',
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const secureHash = query['vnp_SecureHash'];

    // Build sorted params excluding signature fields
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(query)) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        params[key] = value;
      }
    }

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
    const computedHash = crypto
      .createHmac('sha512', env.VNPAY_HASH_SECRET ?? '')
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    if (computedHash !== secureHash) {
      res.json({ RspCode: '97', Message: 'Invalid signature' });
      return;
    }

    const responseCode = query['vnp_ResponseCode'];
    const txnRef = query['vnp_TxnRef'] ?? '';
    const vnpAmount = parseInt(query['vnp_Amount'] ?? '0', 10);
    const transactionNo = query['vnp_TransactionNo'] ?? '';

    // Payment failed — mark failed and acknowledge
    if (responseCode !== '00') {
      await Order.findOneAndUpdate({ orderNumber: txnRef }, { paymentStatus: 'failed' });
      res.json({ RspCode: '00', Message: 'Confirm Success' });
      return;
    }

    // Verify order exists
    const order = await Order.findOne({ orderNumber: txnRef });
    if (!order) {
      res.json({ RspCode: '01', Message: 'Order not found' });
      return;
    }

    if (order.paymentStatus === 'paid') {
      res.json({ RspCode: '02', Message: 'Order already confirmed' });
      return;
    }

    // VNPay transmits amount * 100 (e.g. 100,000 VND → 10,000,000)
    if (Math.round(order.pricing.totalAmount * 100) !== vnpAmount) {
      res.json({ RspCode: '04', Message: 'Invalid amount' });
      return;
    }

    await updateOrderPaid(txnRef, transactionNo);
    res.json({ RspCode: '00', Message: 'Confirm Success' });
  })
);

// ─── POST /momo ─ MoMo IPN ───────────────────────────────────────────────
webhookRouter.post(
  '/momo',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body as Record<string, string | number>;

    // Rebuild HMAC-SHA256 raw signature string (fields must be in exact order)
    const rawSignature = [
      `accessKey=${env.MOMO_ACCESS_KEY ?? ''}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `message=${message}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `orderType=${orderType}`,
      `partnerCode=${partnerCode}`,
      `payType=${payType}`,
      `requestId=${requestId}`,
      `responseTime=${responseTime}`,
      `resultCode=${resultCode}`,
      `transId=${transId}`,
    ].join('&');

    const computedSig = crypto
      .createHmac('sha256', env.MOMO_SECRET_KEY ?? '')
      .update(rawSignature)
      .digest('hex');

    if (computedSig !== signature) {
      res.status(400).json({ message: 'Invalid signature' });
      return;
    }

    const numericResultCode =
      typeof resultCode === 'number' ? resultCode : parseInt(String(resultCode), 10);
    const orderIdStr = String(orderId);
    const transIdStr = String(transId);

    if (numericResultCode !== 0) {
      await Order.findOneAndUpdate({ orderNumber: orderIdStr }, { paymentStatus: 'failed' });
      res.status(204).send();
      return;
    }

    await updateOrderPaid(orderIdStr, transIdStr);
    res.status(204).send();
  })
);

// ─── POST /zalopay ─ ZaloPay callback ─────────────────────────────────────
webhookRouter.post(
  '/zalopay',
  asyncHandler(async (req: Request, res: Response) => {
    const { data, mac } = req.body as { data: string; mac: string; type?: number };

    // Verify mac = HMAC-SHA256(data, ZALOPAY_KEY2)
    const computedMac = crypto
      .createHmac('sha256', env.ZALOPAY_KEY2 ?? '')
      .update(data)
      .digest('hex');

    if (computedMac !== mac) {
      res.json({ return_code: -1, return_message: 'mac not equal' });
      return;
    }

    const parsed = JSON.parse(data) as {
      app_trans_id: string;
      amount: number;
      app_id: number;
    };

    // app_trans_id format: yyMMdd_<orderNumber>
    const orderNumber = parsed.app_trans_id.split('_').slice(1).join('_');

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      res.json({ return_code: 0, return_message: 'order not found' });
      return;
    }

    if (order.paymentStatus === 'paid') {
      res.json({ return_code: 1, return_message: 'success' });
      return;
    }

    await updateOrderPaid(orderNumber, parsed.app_trans_id);
    res.json({ return_code: 1, return_message: 'success' });
  })
);
