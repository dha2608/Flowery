import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Review, Order, Shop } from '../models/index.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { ROLES } from '../config/constants.js';

export const reviewRouter = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── Schemas ───────────────────────────────────────────────────────────────

const ratingSchema = z.object({
  overall: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  delivery: z.number().int().min(1).max(5),
  packaging: z.number().int().min(1).max(5),
});

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
});

const createReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: ratingSchema,
  comment: z.string().max(1000).optional(),
  images: z.array(imageSchema).default([]),
});

const updateReviewSchema = z
  .object({
    rating: ratingSchema,
    comment: z.string().max(1000),
    images: z.array(imageSchema),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

const replySchema = z.object({
  message: z.string().min(1).max(500),
});

// ─── Utility ───────────────────────────────────────────────────────────────

/** Recalculate and persist the shop's average rating and review count. */
async function updateShopRatingStats(shopId: unknown) {
  const allReviews = await Review.find({ shopId, isVisible: true }).select('rating.overall');
  const count = allReviews.length;
  const avgRating =
    count > 0 ? allReviews.reduce((sum, r) => sum + r.rating.overall, 0) / count : 0;

  await Shop.findByIdAndUpdate(shopId, {
    'stats.rating': parseFloat(avgRating.toFixed(2)),
    'stats.totalReviews': count,
  });
}

// ─── POST / ─ Create review ───────────────────────────────────────────────
reviewRouter.post(
  '/',
  requireAuth,
  validate(createReviewSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { orderId, rating, comment, images } = req.body;

    // Verify order exists and belongs to this user
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    if (order.status !== 'delivered') {
      throw new BadRequestError('Order must be delivered before leaving a review');
    }

    // One review per order (enforced at DB level too via unique index on orderId)
    const existing = await Review.findOne({ orderId });
    if (existing) throw new BadRequestError('You have already reviewed this order');

    const productIds = order.items.map((item) => item.productId);

    const review = await Review.create({
      userId,
      orderId,
      shopId: order.shopId,
      productIds,
      rating,
      comment,
      images,
      isVerifiedPurchase: true,
      isVisible: true,
    });

    // Recalculate shop stats now that the new review is saved
    await updateShopRatingStats(order.shopId);

    res.status(201).json({ success: true, data: review });
  })
);

// ─── GET /shop/:shopId ─ Public: reviews for a shop ──────────────────────
// NOTE: this route must be declared before /:id to avoid matching conflicts
reviewRouter.get(
  '/shop/:shopId',
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId } = req.params;
    const pagination = getPagination(req);

    const filter = { shopId, isVisible: true };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('userId', 'name avatar'),
      Review.countDocuments(filter),
    ]);

    res.json(paginateResponse(reviews, total, pagination));
  })
);

// ─── GET /:id ─ Public: get single review ────────────────────────────────
reviewRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const review = await Review.findOne({ _id: req.params.id, isVisible: true }).populate(
      'userId',
      'name avatar'
    );
    if (!review) throw new NotFoundError('Review');

    res.json({ success: true, data: review });
  })
);

// ─── PUT /:id ─ Update own review (within 7 days) ────────────────────────
reviewRouter.put(
  '/:id',
  requireAuth,
  validate(updateReviewSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { rating, comment, images } = req.body;

    const review = await Review.findOne({ _id: req.params.id, isVisible: true });
    if (!review) throw new NotFoundError('Review');

    if (review.userId.toString() !== userId) throw new ForbiddenError('Access denied');

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - review.createdAt.getTime() > SEVEN_DAYS_MS) {
      throw new BadRequestError('Reviews can only be edited within 7 days of submission');
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    // Refresh shop stats in case the overall rating changed
    await updateShopRatingStats(review.shopId);

    res.json({ success: true, data: review });
  })
);

// ─── POST /:id/reply ─ Shop owner replies to a review ────────────────────
reviewRouter.post(
  '/:id/reply',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  validate(replySchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { message } = req.body;

    const review = await Review.findOne({ _id: req.params.id, isVisible: true });
    if (!review) throw new NotFoundError('Review');

    // Verify this review belongs to the owner's shop
    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop || review.shopId.toString() !== shop._id.toString()) {
      throw new ForbiddenError('Access denied');
    }

    if (review.shopReply) {
      throw new BadRequestError('You have already replied to this review');
    }

    review.shopReply = { message, repliedAt: new Date() };
    await review.save();

    res.json({ success: true, data: review });
  })
);

// ─── POST /:id/helpful ─ Increment helpful count ──────────────────────────
reviewRouter.post(
  '/:id/helpful',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, isVisible: true },
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) throw new NotFoundError('Review');

    res.json({ success: true, data: { helpfulCount: review.helpfulCount } });
  })
);
