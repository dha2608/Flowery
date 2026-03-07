import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Shop, Product, Review, User } from '../models/index.js';
import { NotFoundError, ConflictError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { ROLES } from '../config/constants.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
  '-' +
  Date.now().toString(36);

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  ward: z.string().min(1, 'Ward is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
});

// Matches the model's phone regex: /^(\+84|0)(3|5|7|8|9)\d{8}$/
const VN_PHONE_RE = /^(\+84|0)(3|5|7|8|9)\d{8}$/;

const deliveryConfigSchema = z.object({
  maxDistance: z.number().min(0, 'Max distance must be non-negative'),
  baseFee: z.number().min(0, 'Base fee must be non-negative'),
  // Field name matches IShop / shopSchema
  freeDeliveryMinOrder: z.number().min(0, 'Threshold must be non-negative'),
  estimatedTime: z.string().min(1, 'Estimated time is required'),
});

const imageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required'),
});

// ── Validation schemas ────────────────────────────────────────────────────────

const listShopsQuerySchema = z.object({
  city: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['rating', 'totalOrders', 'createdAt']).default('rating'),
});

const nearbyQuerySchema = z.object({
  lng: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  lat: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  maxDistance: z.coerce.number().min(0.1).max(100).default(10),
});

const registerShopSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().max(1000).optional(),
  address: addressSchema,
  /**
   * Location is optional at registration — shops without coordinates won't
   * appear in /nearby results but can be found by slug/city.
   */
  location: z
    .object({
      coordinates: z.tuple([
        z.number().min(-180).max(180), // longitude first (GeoJSON convention)
        z.number().min(-90).max(90), // then latitude
      ]),
    })
    .optional(),
  phone: z.string().regex(VN_PHONE_RE, 'Invalid Vietnamese phone number'),
  email: z.string().email('Invalid email address').optional(),
  deliveryConfig: deliveryConfigSchema,
});

const updateShopSchema = z
  .object({
    name: z.string().min(2).max(200),
    description: z.string().max(1000),
    address: addressSchema,
    phone: z.string().regex(VN_PHONE_RE, 'Invalid Vietnamese phone number'),
    operatingHours: z.array(
      z.object({
        day: z.number().int().min(0).max(6),
        open: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
        close: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
        isClosed: z.boolean(),
      })
    ),
    deliveryConfig: deliveryConfigSchema,
    logo: imageSchema,
    coverImage: imageSchema,
  })
  .partial();

const shopProductsQuerySchema = z.object({
  category: z
    .enum([
      'single_flower',
      'bouquet',
      'arrangement',
      'basket',
      'box',
      'subscription_pack',
      'custom',
    ])
    .optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
});

// ── Sort helpers ──────────────────────────────────────────────────────────────

const SHOP_SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  rating: { 'stats.rating': -1 },
  totalOrders: { 'stats.totalOrders': -1 },
  createdAt: { createdAt: -1 },
};

// ── Router ────────────────────────────────────────────────────────────────────

export const shopRouter = Router();

/**
 * GET /api/v1/shops
 * List active, verified shops with optional city filter and sort.
 */
shopRouter.get(
  '/',
  validate(listShopsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    // validate() has already parsed req.query via listShopsQuerySchema
    const { city, minRating, sort } = req.query as unknown as z.infer<typeof listShopsQuerySchema>;
    const pagination = getPagination(req);

    const filter: Record<string, unknown> = {
      isActive: true,
      isVerified: true,
    };

    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }
    if (minRating !== undefined) {
      filter['stats.rating'] = { $gte: minRating };
    }

    const [shops, total] = await Promise.all([
      Shop.find(filter)
        .sort(SHOP_SORT_MAP[sort] ?? SHOP_SORT_MAP.rating)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .select('-bankAccount -businessLicense'),
      Shop.countDocuments(filter),
    ]);

    return res.json(paginateResponse(shops, total, pagination));
  })
);

/**
 * GET /api/v1/shops/nearby
 * Find active, verified shops within maxDistance km of [lng, lat].
 * Registered before /:slug to prevent 'nearby' matching as a slug.
 *
 * $near auto-sorts by distance ascending — ideal for proximity listing.
 * countDocuments does not support $near, so we use $geoWithin/$centerSphere
 * for the total count (minor count approximation is acceptable for pagination).
 */
shopRouter.get(
  '/nearby',
  validate(nearbyQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { lng, lat, maxDistance } = req.query as unknown as z.infer<typeof nearbyQuerySchema>;
    const pagination = getPagination(req);

    const baseFilter = { isActive: true, isVerified: true };

    const nearFilter = {
      ...baseFilter,
      location: {
        $near: {
          $geometry: { type: 'Point' as const, coordinates: [lng, lat] },
          $maxDistance: maxDistance * 1000, // km → metres
        },
      },
    };

    // $centerSphere radius in radians = km / Earth's mean radius (6371 km)
    const countFilter = {
      ...baseFilter,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], maxDistance / 6371],
        },
      },
    };

    const [shops, total] = await Promise.all([
      Shop.find(nearFilter)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .select('-bankAccount -businessLicense'),
      Shop.countDocuments(countFilter),
    ]);

    return res.json(paginateResponse(shops, total, pagination));
  })
);

/**
 * POST /api/v1/shops/register
 * Register the authenticated user as a new shop owner.
 * Raises ConflictError if the user already has a shop (ownerId is unique in DB).
 * Elevates user.role to SHOP_OWNER on success.
 */
shopRouter.post(
  '/register',
  requireAuth,
  validate(registerShopSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const existing = await Shop.findOne({ ownerId: userId }).select('_id');
    if (existing) {
      throw new ConflictError('You already own a shop');
    }

    const { name, description, address, location, phone, email, deliveryConfig } =
      req.body as z.infer<typeof registerShopSchema>;

    const shop = await Shop.create({
      ownerId: userId,
      name,
      slug: generateSlug(name),
      description,
      address,
      phone,
      email,
      deliveryConfig,
      // Only set location when coordinates are provided; shops without location
      // simply won't appear in /nearby results until they add coordinates.
      ...(location && {
        location: { type: 'Point', coordinates: location.coordinates },
      }),
    });

    // Elevate role so the owner can immediately manage their shop
    await User.findByIdAndUpdate(userId, { role: ROLES.SHOP_OWNER });

    return res.status(201).json({ success: true, data: shop });
  })
);

/**
 * GET /api/v1/shops/my-shop
 * Get the authenticated shop owner's own shop with full details.
 */
shopRouter.get(
  '/my-shop',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop) {
      throw new NotFoundError('Shop');
    }

    return res.json({ success: true, data: shop });
  })
);

/**
 * PUT /api/v1/shops/my-shop
 * Update the authenticated shop owner's own shop.
 * Regenerates slug when name changes (old URLs become invalid — inform clients).
 */
shopRouter.put(
  '/my-shop',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  validate(updateShopSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const shop = await Shop.findOne({ ownerId: userId }).select('_id');
    if (!shop) {
      throw new NotFoundError('Shop');
    }

    const { name, description, address, phone, operatingHours, deliveryConfig, logo, coverImage } =
      req.body as z.infer<typeof updateShopSchema>;

    const $set: Record<string, unknown> = {};

    if (name !== undefined) {
      $set.name = name;
      $set.slug = generateSlug(name);
    }
    if (description !== undefined) $set.description = description;
    if (address !== undefined) $set.address = address;
    if (phone !== undefined) $set.phone = phone;
    if (operatingHours !== undefined) $set.operatingHours = operatingHours;
    if (deliveryConfig !== undefined) $set.deliveryConfig = deliveryConfig;
    if (logo !== undefined) $set.logo = logo;
    if (coverImage !== undefined) $set.coverImage = coverImage;

    const updated = await Shop.findByIdAndUpdate(
      shop._id,
      { $set },
      { new: true, runValidators: true }
    ).select('-bankAccount -businessLicense');

    return res.json({ success: true, data: updated });
  })
);

/**
 * GET /api/v1/shops/:slug/products
 * List available products belonging to a shop with optional category/price filters.
 */
shopRouter.get(
  '/:slug/products',
  validate(shopProductsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { category, priceMin, priceMax } = req.query as unknown as z.infer<
      typeof shopProductsQuerySchema
    >;
    const pagination = getPagination(req);

    const shop = await Shop.findOne({ slug, isActive: true }).select('_id');
    if (!shop) throw new NotFoundError('Shop');

    const filter: Record<string, unknown> = {
      shopId: shop._id,
      isAvailable: true,
    };

    if (category) filter.category = category;
    if (priceMin !== undefined || priceMax !== undefined) {
      const priceRange: Record<string, number> = {};
      if (priceMin !== undefined) priceRange.$gte = priceMin;
      if (priceMax !== undefined) priceRange.$lte = priceMax;
      filter.price = priceRange;
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
      Product.countDocuments(filter),
    ]);

    return res.json(paginateResponse(products, total, pagination));
  })
);

/**
 * GET /api/v1/shops/:slug/reviews
 * List visible reviews for a shop, sorted newest-first.
 */
shopRouter.get(
  '/:slug/reviews',
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const pagination = getPagination(req);

    const shop = await Shop.findOne({ slug, isActive: true }).select('_id');
    if (!shop) throw new NotFoundError('Shop');

    const reviewFilter = { shopId: shop._id, isVisible: true };

    const [reviews, total] = await Promise.all([
      Review.find(reviewFilter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('userId', 'name avatar'),
      Review.countDocuments(reviewFilter),
    ]);

    return res.json(paginateResponse(reviews, total, pagination));
  })
);

/**
 * GET /api/v1/shops/:slug
 * Get a single active shop by slug, including stats.
 * Must be registered AFTER all /:slug/* sub-paths.
 */
shopRouter.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const shop = await Shop.findOne({ slug, isActive: true }).select(
      '-bankAccount -businessLicense'
    );
    if (!shop) throw new NotFoundError('Shop');

    return res.json({ success: true, data: shop });
  })
);
