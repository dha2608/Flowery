import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Subscription, Shop } from '../models/index.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';

export const subscriptionRouter = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Calculate the next delivery date from today based on the plan cadence.
 * weekly   → +7 days
 * biweekly → +14 days
 * monthly  → +1 calendar month
 */
const calculateNextDeliveryDate = (planType: string): Date => {
  const date = new Date();
  switch (planType) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date;
};

// Subscriptions are pre-paid; COD is not accepted.
const SUBSCRIPTION_PAYMENT_METHODS = [
  'vnpay',
  'momo',
  'zalopay',
  'bank_transfer',
] as const;

// ─── Schemas ───────────────────────────────────────────────────────────────

const deliveryAddressSchema = z.object({
  recipientName: z.string().min(1),
  recipientPhone: z
    .string()
    .regex(/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number'),
  street: z.string().min(1),
  ward: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
});

const preferencesSchema = z.object({
  budget: z.object({
    min: z.number().min(100000),
    max: z.number().max(5000000),
  }),
  emotions: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  excludeFlowers: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
});

const createSubscriptionSchema = z.object({
  shopId: z.string().min(1),
  planType: z.enum(['weekly', 'biweekly', 'monthly']),
  preferences: preferencesSchema,
  deliveryAddress: deliveryAddressSchema,
  paymentMethod: z.enum(SUBSCRIPTION_PAYMENT_METHODS),
});

const updateSubscriptionSchema = z
  .object({
    planType: z.enum(['weekly', 'biweekly', 'monthly']),
    preferences: preferencesSchema.partial(),
    deliveryAddress: deliveryAddressSchema,
    paymentMethod: z.enum(SUBSCRIPTION_PAYMENT_METHODS),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// ─── GET /plans ─ Public — no auth required ───────────────────────────────
subscriptionRouter.get('/plans', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'weekly',
        name: 'Hàng Tuần',
        description: 'Giao hoa mỗi tuần',
        price: 299000,
        interval: 'weekly',
        features: ['Giao hàng miễn phí', 'Hoa tươi theo mùa', 'Thay đổi bất kỳ lúc nào'],
      },
      {
        id: 'biweekly',
        name: 'Hai Tuần',
        description: 'Giao hoa mỗi 2 tuần',
        price: 249000,
        interval: 'biweekly',
        features: ['Giao hàng miễn phí', 'Hoa tươi theo mùa', 'Tiết kiệm 15%'],
      },
      {
        id: 'monthly',
        name: 'Hàng Tháng',
        description: 'Giao hoa mỗi tháng',
        price: 199000,
        interval: 'monthly',
        features: ['Giao hàng miễn phí', 'Hoa cao cấp', 'Tiết kiệm 30%'],
      },
    ],
    pagination: { total: 3, page: 1, limit: 3, totalPages: 1 },
  });
});

// All remaining subscription endpoints require authentication
subscriptionRouter.use(requireAuth);

// ─── POST / ─ Create subscription ────────────────────────────────────────
subscriptionRouter.post(
  '/',
  validate(createSubscriptionSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { shopId, planType, preferences, deliveryAddress, paymentMethod } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop || !shop.isActive) throw new NotFoundError('Shop');

    const nextDeliveryDate = calculateNextDeliveryDate(planType);

    const subscription = await Subscription.create({
      userId,
      shopId: shop._id,
      planType,
      preferences,
      deliveryAddress,
      nextDeliveryDate,
      status: 'active',
      paymentMethod,
      totalDeliveries: 0,
    });

    res.status(201).json({ success: true, data: subscription });
  })
);

// ─── GET / ─ List the authenticated user's subscriptions ─────────────────
subscriptionRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const pagination = getPagination(req);

    const filter = { userId };

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('shopId', 'name slug logo'),
      Subscription.countDocuments(filter),
    ]);

    res.json(paginateResponse(subscriptions, total, pagination));
  })
);

// ─── GET /me ─ Return the current user's active subscriptions ────────────
// ⚠️  Must be declared before /:id to prevent "me" matching as an ObjectId.
subscriptionRouter.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const subscriptions = await Subscription.find({ userId, status: 'active' })
      .sort({ createdAt: -1 })
      .populate('shopId', 'name slug logo');

    res.json({ success: true, data: subscriptions });
  })
);

// ─── GET /:id ─ Get subscription detail ──────────────────────────────────
subscriptionRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const subscription = await Subscription.findById(req.params.id).populate(
      'shopId',
      'name slug logo address phone deliveryConfig'
    );
    if (!subscription) throw new NotFoundError('Subscription');

    if (subscription.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    res.json({ success: true, data: subscription });
  })
);

// ─── PUT /:id ─ Update subscription preferences / plan ───────────────────
subscriptionRouter.put(
  '/:id',
  validate(updateSubscriptionSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const updates = req.body;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) throw new NotFoundError('Subscription');
    if (subscription.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    if (subscription.status === 'cancelled') {
      throw new BadRequestError('Cannot update a cancelled subscription');
    }

    // Apply allowed field updates
    const allowedFields = [
      'planType',
      'preferences',
      'deliveryAddress',
      'paymentMethod',
    ] as const;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        (subscription as any)[field] = updates[field];
      }
    }

    // When the plan cadence changes, recalculate the next delivery date
    if (updates.planType) {
      subscription.nextDeliveryDate = calculateNextDeliveryDate(updates.planType);
    }

    await subscription.save();

    res.json({ success: true, data: subscription });
  })
);

// ─── POST /:id/pause ─ Pause an active subscription ──────────────────────
subscriptionRouter.post(
  '/:id/pause',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) throw new NotFoundError('Subscription');
    if (subscription.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    if (subscription.status !== 'active') {
      throw new BadRequestError(
        `Subscription must be 'active' to pause (current: '${subscription.status}')`
      );
    }

    subscription.status = 'paused';
    subscription.pausedAt = new Date();
    await subscription.save();

    res.json({ success: true, data: subscription });
  })
);

// ─── POST /:id/resume ─ Resume a paused subscription ─────────────────────
subscriptionRouter.post(
  '/:id/resume',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) throw new NotFoundError('Subscription');
    if (subscription.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    if (subscription.status !== 'paused') {
      throw new BadRequestError(
        `Subscription must be 'paused' to resume (current: '${subscription.status}')`
      );
    }

    subscription.status = 'active';
    subscription.pausedAt = undefined;
    // Recalculate delivery date from today so no deliveries are missed
    subscription.nextDeliveryDate = calculateNextDeliveryDate(subscription.planType);
    await subscription.save();

    res.json({ success: true, data: subscription });
  })
);

// ─── POST /:id/cancel ─ Cancel a subscription ────────────────────────────
subscriptionRouter.post(
  '/:id/cancel',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    // reason is optional for cancellation
    const reason: string | undefined = req.body?.reason;

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) throw new NotFoundError('Subscription');
    if (subscription.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    if (subscription.status === 'cancelled') {
      throw new BadRequestError('Subscription is already cancelled');
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    if (reason) subscription.cancelReason = reason;

    await subscription.save();

    res.json({ success: true, data: subscription });
  })
);
