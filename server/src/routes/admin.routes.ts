import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  User,
  Shop,
  Order,
  Notification,
  Relationship,
  Event,
  Flower,
  FlowerMeaning,
} from '../models/index.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { ROLES } from '../config/constants.js';

export const adminRouter = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// All admin routes require a valid token + admin role
adminRouter.use(requireAuth, requireRole(ROLES.ADMIN));

// ─── Schemas ───────────────────────────────────────────────────────────────

const listUsersQuerySchema = z.object({
  role: z.enum(['user', 'shop_owner', 'admin']).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const listShopsQuerySchema = z.object({
  isVerified: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  city: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// ─── GET /users ─ List all users ──────────────────────────────────────────
adminRouter.get(
  '/users',
  validate(listUsersQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { role, isActive } = req.query as any;
    const pagination = getPagination(req);

    const filter: Record<string, any> = {};
    if (role !== undefined) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive; // already coerced by zod

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshTokens')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      User.countDocuments(filter),
    ]);

    res.json(paginateResponse(users, total, pagination));
  })
);

// ─── GET /shops ─ List all shops (including unverified) ───────────────────
adminRouter.get(
  '/shops',
  validate(listShopsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { isVerified, isActive, city } = req.query as any;
    const pagination = getPagination(req);

    const filter: Record<string, any> = {};
    if (isVerified !== undefined) filter.isVerified = isVerified;
    if (isActive !== undefined) filter.isActive = isActive;
    if (city) filter['address.city'] = city;

    const [shops, total] = await Promise.all([
      Shop.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('ownerId', 'name email phone'),
      Shop.countDocuments(filter),
    ]);

    res.json(paginateResponse(shops, total, pagination));
  })
);

// ─── PUT /shops/:id/verify ─ Verify a shop ────────────────────────────────
adminRouter.put(
  '/shops/:id/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, verifiedAt: new Date() },
      { new: true }
    );
    if (!shop) throw new NotFoundError('Shop');

    await Notification.create({
      userId: shop.ownerId,
      type: 'system',
      title: 'Shop được xác minh',
      message: `Shop "${shop.name}" của bạn đã được xác minh thành công. Bạn có thể bắt đầu nhận đơn hàng!`,
      data: { shopId: shop._id },
      channels: ['in_app'],
    });

    res.json({ success: true, data: shop });
  })
);

// ─── PUT /shops/:id/reject ─ Reject a shop ────────────────────────────────
adminRouter.put(
  '/shops/:id/reject',
  asyncHandler(async (req: Request, res: Response) => {
    const { reason } = req.body as { reason?: string };

    const updateFields: Record<string, unknown> = { isVerified: false };
    if (reason) updateFields.rejectionReason = reason;

    const shop = await Shop.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!shop) throw new NotFoundError('Shop');

    await Notification.create({
      userId: shop.ownerId,
      type: 'system',
      title: 'Shop không được xác minh',
      message: `Shop "${shop.name}" của bạn chưa được xác minh.${reason ? ` Lý do: ${reason}` : ''}`,
      data: { shopId: shop._id },
      channels: ['in_app'],
    });

    res.json({ success: true, data: shop });
  })
);

// ─── GET /stats ─ Dashboard statistics ────────────────────────────────────
adminRouter.get(
  '/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalUsers,
      totalShops,
      totalOrders,
      revenueResult,
      todayOrdersResult,
      todayUsersResult,
      todayRevenueResult,
      topShops,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),

      Shop.countDocuments(),

      Order.countDocuments(),

      // All-time revenue from delivered orders
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } },
      ]),

      // Today's new order count
      Order.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),

      // Today's new user count
      User.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),

      // Today's revenue from delivered orders
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } },
      ]),

      // Top 5 shops by all-time delivered revenue
      Order.aggregate([
        { $match: { status: 'delivered' } },
        {
          $group: {
            _id: '$shopId',
            revenue: { $sum: '$pricing.totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'shops',
            localField: '_id',
            foreignField: '_id',
            as: 'shop',
          },
        },
        { $unwind: '$shop' },
        { $project: { shop: 1, revenue: 1, orderCount: 1, _id: 0 } },
      ]),

      // Last 5 orders with user and shop info
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber status pricing.totalAmount deliveryDate createdAt')
        .populate('userId', 'name email')
        .populate('shopId', 'name slug'),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalShops,
          totalOrders,
          totalRevenue: revenueResult[0]?.total ?? 0,
        },
        today: {
          newOrders: todayOrdersResult,
          newUsers: todayUsersResult,
          revenue: todayRevenueResult[0]?.total ?? 0,
        },
        topShops,
        recentOrders,
      },
    });
  })
);

// ─── PUT /users/:id/status ─ Enable / disable a user ─────────────────────
adminRouter.put(
  '/users/:id/status',
  validate(updateUserStatusSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { isActive } = req.body;
    const adminId = req.user!.userId;

    // Prevent self-lockout
    if (req.params.id === adminId) {
      throw new BadRequestError('You cannot change the status of your own account');
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User');

    if (user.role === ROLES.ADMIN) {
      throw new ForbiddenError('Cannot modify the status of admin accounts');
    }

    user.isActive = isActive;
    await user.save();

    res.json({ success: true, data: { _id: user._id, name: user.name, isActive: user.isActive } });
  })
);

// ─── DELETE /users/:id ─ Hard delete a user and their data ───────────────
adminRouter.delete(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!.userId;

    // Prevent self-deletion
    if (req.params.id === adminId) {
      throw new BadRequestError('You cannot delete your own account');
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User');

    if (user.role === ROLES.ADMIN) {
      throw new ForbiddenError('Cannot delete admin accounts');
    }

    // Clean up all user-owned data in parallel before removing the user document
    await Promise.all([
      Relationship.deleteMany({ userId: user._id }),
      Event.deleteMany({ userId: user._id }),
      Notification.deleteMany({ userId: user._id }),
    ]);

    await user.deleteOne();

    res.json({
      success: true,
      data: { message: 'User and all related data have been permanently deleted' },
    });
  })
);

// ═══════════════════════════════════════════════════════════════════════════════
// FLOWER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const listFlowersQuerySchema = z.object({
  search: z.string().optional(),
  color: z.string().optional(),
  season: z.enum(['spring', 'summer', 'autumn', 'winter', 'all_year']).optional(),
  isAvailable: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createFlowerSchema = z.object({
  name: z.object({ vi: z.string().min(1), en: z.string().min(1) }),
  scientificName: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  description: z.object({ vi: z.string().min(1), en: z.string().min(1) }),
  meanings: z.array(z.string()).default([]),
  colors: z.array(z.string()).min(1),
  seasons: z
    .array(z.enum(['spring', 'summer', 'autumn', 'winter', 'all_year']))
    .default(['all_year']),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .default([]),
  careInstructions: z.object({ vi: z.string(), en: z.string() }).optional(),
  culturalSignificance: z.object({ vi: z.string(), en: z.string() }).optional(),
  popularityScore: z.number().min(0).default(0),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

const updateFlowerSchema = createFlowerSchema.partial();

// ─── GET /flowers ─ List all flowers (admin) ─────────────────────────────
adminRouter.get(
  '/flowers',
  validate(listFlowersQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { search, color, season, isAvailable } = req.query as any;
    const pagination = getPagination(req);

    const filter: Record<string, any> = {};
    if (search) filter.$text = { $search: search };
    if (color) filter.colors = color;
    if (season) filter.seasons = season;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable;

    const [flowers, total] = await Promise.all([
      Flower.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
      Flower.countDocuments(filter),
    ]);

    res.json(paginateResponse(flowers, total, pagination));
  })
);

// ─── GET /flowers/:id ─ Get single flower detail ─────────────────────────
adminRouter.get(
  '/flowers/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const flower = await Flower.findById(req.params.id);
    if (!flower) throw new NotFoundError('Flower');

    const meanings = await FlowerMeaning.find({ flowerId: flower._id });

    res.json({ success: true, data: { ...flower.toObject(), meanings: meanings } });
  })
);

// ─── POST /flowers ─ Create a new flower ─────────────────────────────────
adminRouter.post(
  '/flowers',
  validate(createFlowerSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    // Check slug uniqueness
    const existing = await Flower.findOne({ slug: req.body.slug });
    if (existing) throw new BadRequestError('Slug đã tồn tại');

    const flower = await Flower.create(req.body);
    res.status(201).json({ success: true, data: flower });
  })
);

// ─── PUT /flowers/:id ─ Update a flower ──────────────────────────────────
adminRouter.put(
  '/flowers/:id',
  validate(updateFlowerSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    // If slug changed, check uniqueness
    if (req.body.slug) {
      const existing = await Flower.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (existing) throw new BadRequestError('Slug đã tồn tại');
    }

    const flower = await Flower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flower) throw new NotFoundError('Flower');

    res.json({ success: true, data: flower });
  })
);

// ─── PUT /flowers/:id/availability ─ Toggle availability ─────────────────
adminRouter.put(
  '/flowers/:id/availability',
  asyncHandler(async (req: Request, res: Response) => {
    const flower = await Flower.findById(req.params.id);
    if (!flower) throw new NotFoundError('Flower');

    flower.isAvailable = !flower.isAvailable;
    await flower.save();

    res.json({ success: true, data: flower });
  })
);

// ─── DELETE /flowers/:id ─ Delete a flower and its meanings ──────────────
adminRouter.delete(
  '/flowers/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const flower = await Flower.findById(req.params.id);
    if (!flower) throw new NotFoundError('Flower');

    await Promise.all([flower.deleteOne(), FlowerMeaning.deleteMany({ flowerId: flower._id })]);

    res.json({
      success: true,
      data: { message: 'Đã xóa hoa và tất cả dữ liệu liên quan' },
    });
  })
);
