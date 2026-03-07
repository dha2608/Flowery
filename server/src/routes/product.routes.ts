import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Shop, Product } from '../models/index.js';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import {
  ROLES,
  PRODUCT_CATEGORIES,
  EMOTIONS,
  OCCASIONS,
} from '../config/constants.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const generateSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
  '-' +
  Date.now().toString(36);

// ── Shared sub-schemas (match IProduct exactly) ───────────────────────────────

/**
 * IProduct.images: { url: string; publicId: string; isPrimary: boolean }
 */
const imageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required'),
  isPrimary: z.boolean().default(false),
});

/**
 * IProduct.flowerComposition: { flowerId, quantity, color? }
 */
const flowerCompositionSchema = z.object({
  flowerId: z.string().min(1, 'Flower ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  color: z.string().optional(),
});

/**
 * IProduct.customizationOptions: { name, options: [{ label, priceModifier }] }
 */
const customizationOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required'),
  options: z.array(
    z.object({
      label: z.string().min(1, 'Label is required'),
      priceModifier: z.number().default(0),
    })
  ),
});

const stockSchema = z.object({
  quantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  unlimited: z.boolean(),
});

// ── Validation schemas ────────────────────────────────────────────────────────

const listProductsQuerySchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  emotion: z.enum(EMOTIONS).optional(),
  occasion: z.enum(OCCASIONS).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  shopId: z.string().optional(),
  sort: z.enum(['price', 'createdAt', 'popularity']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
});

const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200),
  description: z.string().max(2000).optional(),
  price: z
    .number()
    .min(10_000, 'Price must be at least 10,000 VND')
    .max(50_000_000, 'Price must not exceed 50,000,000 VND'),
  salePrice: z.number().min(10_000).optional(),
  category: z.enum(PRODUCT_CATEGORIES),
  flowerComposition: z.array(flowerCompositionSchema).optional(),
  images: z
    .array(imageSchema)
    .min(1, 'At least one product image is required'),
  customizationOptions: z.array(customizationOptionSchema).optional(),
  occasions: z.array(z.enum(OCCASIONS)).optional(),
  emotions: z.array(z.enum(EMOTIONS)).optional(),
  tags: z.array(z.string()).optional(),
  stock: stockSchema,
});

// Partial for updates — name change triggers slug regeneration
const updateProductSchema = createProductSchema.partial();

// ── Sort builder ──────────────────────────────────────────────────────────────

const buildProductSort = (
  sort: string,
  order: string
): Record<string, 1 | -1 | { $meta: string }> => {
  const dir = order === 'asc' ? (1 as const) : (-1 as const);
  switch (sort) {
    case 'price':
      return { price: dir };
    // totalSold is the IProduct field that tracks units sold — best proxy for popularity
    case 'popularity':
      return { totalSold: -1 };
    default: // 'createdAt'
      return { createdAt: dir };
  }
};

// ── Router ────────────────────────────────────────────────────────────────────

export const productRouter = Router();

/**
 * GET /api/v1/products
 * List available products with optional filters and sorting.
 */
productRouter.get(
  '/',
  validate(listProductsQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    // validate() has already parsed req.query via listProductsQuerySchema
    const {
      category,
      emotion,
      occasion,
      priceMin,
      priceMax,
      shopId,
      sort,
      order,
    } = req.query as unknown as z.infer<typeof listProductsQuerySchema>;
    const pagination = getPagination(req);

    const filter: Record<string, unknown> = { isAvailable: true };

    if (category) filter.category = category;
    if (emotion) filter.emotions = emotion;       // emotions is an array field
    if (occasion) filter.occasions = occasion;    // occasions is an array field
    if (shopId) filter.shopId = shopId;
    if (priceMin !== undefined || priceMax !== undefined) {
      const priceRange: Record<string, number> = {};
      if (priceMin !== undefined) priceRange.$gte = priceMin;
      if (priceMax !== undefined) priceRange.$lte = priceMax;
      filter.price = priceRange;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(buildProductSort(sort, order))
        .skip(pagination.skip)
        .limit(pagination.limit),
      Product.countDocuments(filter),
    ]);

    return res.json(paginateResponse(products, total, pagination));
  })
);

/**
 * GET /api/v1/products/search
 * Full-text search across name, tags, and description using MongoDB text index.
 * Results ranked by text relevance score.
 * Registered BEFORE /:slug so the literal path 'search' is not captured as a slug.
 */
productRouter.get(
  '/search',
  validate(searchQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as unknown as z.infer<typeof searchQuerySchema>;
    const pagination = getPagination(req);

    if (!q || q.trim().length < 2) {
      throw new BadRequestError('Search query must be at least 2 characters');
    }

    const textFilter = { $text: { $search: q.trim() }, isAvailable: true };

    const [products, total] = await Promise.all([
      Product.find(textFilter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Product.countDocuments(textFilter),
    ]);

    return res.json(paginateResponse(products, total, pagination));
  })
);

/**
 * POST /api/v1/products
 * Create a new product for the authenticated shop owner's shop.
 * Auto-generates slug from name. Increments shop.stats.totalProducts.
 */
productRouter.post(
  '/',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  validate(createProductSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const shop = await Shop.findOne({ ownerId: userId }).select('_id');
    if (!shop) {
      throw new NotFoundError('Shop');
    }

    const body = req.body as z.infer<typeof createProductSchema>;

    const product = await Product.create({
      ...body,
      shopId: shop._id,
      slug: generateSlug(body.name),
    });

    // Keep shop product counter in sync
    await Shop.findByIdAndUpdate(shop._id, {
      $inc: { 'stats.totalProducts': 1 },
    });

    return res.status(201).json({ success: true, data: product });
  })
);

/**
 * GET /api/v1/products/:slug
 * Get a single available product by slug.
 * Populates shop (name, slug, stats.rating) and linked flower (name, images).
 * Registered AFTER /search to avoid 'search' being treated as a slug.
 */
productRouter.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isAvailable: true })
      .populate('shopId', 'name slug stats.rating')
      .populate('flowerId', 'name images');

    if (!product) throw new NotFoundError('Product');

    return res.json({ success: true, data: product });
  })
);

/**
 * PUT /api/v1/products/:id
 * Update a product. Only the owning shop's authenticated user may update.
 * Regenerates slug when name changes.
 */
productRouter.put(
  '/:id',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  validate(updateProductSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { id } = req.params;

    // Resolve the authenticated owner's shop
    const shop = await Shop.findOne({ ownerId: userId }).select('_id');
    if (!shop) throw new NotFoundError('Shop');

    // Verify the product belongs to this shop (ownership check)
    const product = await Product.findOne({
      _id: id,
      shopId: shop._id,
    }).select('_id');
    if (!product) {
      throw new ForbiddenError(
        'Product not found or does not belong to your shop'
      );
    }

    const updates = req.body as z.infer<typeof updateProductSchema>;
    const $set: Record<string, unknown> = { ...updates };

    // Regenerate slug when the product name changes to keep it meaningful
    if (updates.name) {
      $set.slug = generateSlug(updates.name);
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set },
      { new: true, runValidators: true }
    );

    return res.json({ success: true, data: updated });
  })
);

/**
 * DELETE /api/v1/products/:id
 * Soft-delete a product by setting isAvailable = false.
 * Verifies ownership and decrements shop.stats.totalProducts.
 */
productRouter.delete(
  '/:id',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { id } = req.params;

    const shop = await Shop.findOne({ ownerId: userId }).select('_id');
    if (!shop) throw new NotFoundError('Shop');

    // findOne returns the full document so we can check isAvailable
    const product = await Product.findOne({
      _id: id,
      shopId: shop._id,
    });
    if (!product) {
      throw new ForbiddenError(
        'Product not found or does not belong to your shop'
      );
    }

    if (!product.isAvailable) {
      throw new BadRequestError('Product is already deactivated');
    }

    await Promise.all([
      Product.findByIdAndUpdate(id, { $set: { isAvailable: false } }),
      // Decrement counter — $inc with -1 never goes below 0 thanks to DB-level min constraint
      Shop.findByIdAndUpdate(shop._id, {
        $inc: { 'stats.totalProducts': -1 },
      }),
    ]);

    return res.json({
      success: true,
      data: { message: 'Product deactivated successfully' },
    });
  })
);
