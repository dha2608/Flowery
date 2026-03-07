import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Flower, FlowerMeaning } from '../models/index.js';
import { NotFoundError, BadRequestError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { EMOTIONS, OCCASIONS, SEASONS, CULTURAL_CONTEXTS } from '../config/constants.js';

// ─── Utility ─────────────────────────────────────────────────────────────────

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const asyncHandler =
  (fn: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ─── Validation Schemas ───────────────────────────────────────────────────────

/** GET / — query params */
const listQuerySchema = z.object({
  /** Filter by a specific color string (exact match against colors[]) */
  color: z.string().min(1).optional(),
  /** Filter by growing season */
  season: z.enum(SEASONS).optional(),
  /** Filter by emotion via FlowerMeaning lookup */
  emotion: z.enum(EMOTIONS).optional(),
  /** Filter by occasion via FlowerMeaning lookup */
  occasion: z.enum(OCCASIONS).optional(),
  /** Regex search across name.vi, name.en, and tags */
  search: z.string().min(1).optional(),
  /** Field to sort by */
  sortBy: z.enum(['popularityScore', 'name', 'createdAt']).default('popularityScore'),
  /** Sort direction */
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /search — query params */
const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /by-emotion/:emotion — path params */
const emotionParamSchema = z.object({
  emotion: z.enum(EMOTIONS),
});

/** GET /by-occasion/:occasion — path params */
const occasionParamSchema = z.object({
  occasion: z.enum(OCCASIONS),
});

/** GET /:id/meanings — query params */
const meaningQuerySchema = z.object({
  culturalContext: z.enum(CULTURAL_CONTEXTS).optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const flowerRouter = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /
// List flowers with pagination, filtering, and sorting.
// Public — no auth required.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/',
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { color, season, emotion, occasion, search, sortBy, order } = req.query as unknown as z.infer<
      typeof listQuerySchema
    >;
    const pagination = getPagination(req);

    // Base filter: only show available flowers
    const filter: Record<string, unknown> = { isAvailable: true };

    // Color filter: case-insensitive regex to match any color in the array
    if (color) {
      const safeColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter['colors'] = { $regex: new RegExp(`^${safeColor}$`, 'i') };
    }
    if (season) filter['seasons'] = season;

    // Optional full-text / regex search across Vietnamese name, English name, and tags
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      filter['$or'] = [{ 'name.vi': regex }, { 'name.en': regex }, { tags: regex }];
    }

    // For semantic filters (emotion / occasion) we must look up FlowerMeaning first
    // and restrict the flower result set to those flowerIds.
    if (emotion || occasion) {
      const meaningFilter: Record<string, unknown> = { isActive: true };
      if (emotion) meaningFilter['emotion'] = emotion;
      if (occasion) meaningFilter['occasion'] = occasion;

      const matchingFlowerIds = await FlowerMeaning.find(meaningFilter).distinct('flowerId');
      // Intersect with any existing _id filter (safe to always set here since it's the first use)
      filter['_id'] = { $in: matchingFlowerIds };
    }

    // Build sort document; 'name' sorts by the Vietnamese name field
    const sortDir = order === 'asc' ? (1 as const) : (-1 as const);
    const sort: Record<string, 1 | -1> =
      sortBy === 'name' ? { 'name.vi': sortDir } : { [sortBy]: sortDir };

    const [flowers, total] = await Promise.all([
      Flower.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit),
      Flower.countDocuments(filter),
    ]);

    res.json(paginateResponse(flowers, total, pagination));
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /search
// Full-text search using MongoDB $text index on name.vi, name.en, tags.
// Results sorted by text relevance score.
// Public — no auth required.
//
// IMPORTANT: must be registered before /:slug to avoid route conflict.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/search',
  validate(searchQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as unknown as z.infer<typeof searchQuerySchema>;
    const pagination = getPagination(req);

    const filter = {
      $text: { $search: q as string },
      isAvailable: true,
    };

    // Project the text score alongside the document so we can sort by relevance
    const scoreProjection = { score: { $meta: 'textScore' } };

    const [flowers, total] = await Promise.all([
      Flower.find(filter, scoreProjection)
        .sort({ score: { $meta: 'textScore' } })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Flower.countDocuments(filter),
    ]);

    res.json(paginateResponse(flowers, total, pagination));
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /emotions/:emotion
// Returns available flowers whose FlowerMeaning entries match the given emotion.
// Groups by flowerId (de-duplicate), orders by the highest aiWeight found.
// Paginated.
// Public — no auth required.
//
// IMPORTANT: must be registered before /:slug.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/emotions/:emotion',
  validate(emotionParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { emotion } = req.params as z.infer<typeof emotionParamSchema>;
    const pagination = getPagination(req);

    // We use aggregation so we can:
    //   1. Join flowers inline (avoids a separate round-trip)
    //   2. Filter unavailable flowers BEFORE pagination
    //   3. Deduplicate flowerId and rank by best aiWeight
    const basePipeline = [
      // Stage 1: Match active meanings for this emotion
      { $match: { emotion, isActive: true } },
      // Stage 2: Join flower document
      {
        $lookup: {
          from: 'flowers',
          localField: 'flowerId',
          foreignField: '_id',
          as: 'flower',
        },
      },
      { $unwind: '$flower' },
      // Stage 3: Exclude unavailable flowers
      { $match: { 'flower.isAvailable': true } },
      // Stage 4: Group by flowerId — keep flower doc and max aiWeight per flower
      {
        $group: {
          _id: '$flowerId',
          maxAiWeight: { $max: '$aiWeight' },
          flower: { $first: '$flower' },
        },
      },
      // Stage 5: Sort by best semantic weight desc
      { $sort: { maxAiWeight: -1 } },
    ] as const;

    const [results, countResult] = await Promise.all([
      FlowerMeaning.aggregate([
        ...basePipeline,
        { $skip: pagination.skip },
        { $limit: pagination.limit },
        { $project: { _id: 0, flower: 1, aiWeight: '$maxAiWeight' } },
      ]),
      FlowerMeaning.aggregate([...basePipeline, { $count: 'total' }]),
    ]);

    const total: number = countResult[0]?.total ?? 0;
    const flowers = results.map((r: { flower: unknown }) => r.flower);

    res.json(paginateResponse(flowers, total, pagination));
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /occasions/:occasion
// Same pattern as /emotions but filters by occasion instead.
// Public — no auth required.
//
// IMPORTANT: must be registered before /:slug.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/occasions/:occasion',
  validate(occasionParamSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const { occasion } = req.params as z.infer<typeof occasionParamSchema>;
    const pagination = getPagination(req);

    const basePipeline = [
      { $match: { occasion, isActive: true } },
      {
        $lookup: {
          from: 'flowers',
          localField: 'flowerId',
          foreignField: '_id',
          as: 'flower',
        },
      },
      { $unwind: '$flower' },
      { $match: { 'flower.isAvailable': true } },
      {
        $group: {
          _id: '$flowerId',
          maxAiWeight: { $max: '$aiWeight' },
          flower: { $first: '$flower' },
        },
      },
      { $sort: { maxAiWeight: -1 } },
    ] as const;

    const [results, countResult] = await Promise.all([
      FlowerMeaning.aggregate([
        ...basePipeline,
        { $skip: pagination.skip },
        { $limit: pagination.limit },
        { $project: { _id: 0, flower: 1, aiWeight: '$maxAiWeight' } },
      ]),
      FlowerMeaning.aggregate([...basePipeline, { $count: 'total' }]),
    ]);

    const total: number = countResult[0]?.total ?? 0;
    const flowers = results.map((r: { flower: unknown }) => r.flower);

    res.json(paginateResponse(flowers, total, pagination));
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /:slug
// Single flower detail by slug.
// Populates semanticMeanings from FlowerMeaning.
// Increments popularityScore as a fire-and-forget side effect.
// Public — optionalAuth sets req.user if a valid token is provided.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/:slug',
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const flower = await Flower.findOne({ slug, isAvailable: true });
    if (!flower) throw new NotFoundError('Flower');

    // Fetch all active semantic meanings for this flower, best-weighted first
    const semanticMeanings = await FlowerMeaning.find({
      flowerId: flower._id,
      isActive: true,
    }).sort({ aiWeight: -1 });

    // Fire-and-forget: increment popularity without blocking the response
    Flower.findByIdAndUpdate(flower._id, { $inc: { popularityScore: 1 } })
      .exec()
      .catch(() => {
        // Non-critical; swallow silently
      });

    res.json({
      success: true,
      data: {
        ...flower.toObject(),
        semanticMeanings,
      },
    });
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id/meanings
// All FlowerMeaning entries for a given flower (by MongoDB ObjectId).
// Optional query param `culturalContext` narrows results.
// Public — no auth required.
//
// NOTE: Express distinguishes this two-segment path from the one-segment /:slug
// above, so registration order relative to /:slug does not matter here.
// ─────────────────────────────────────────────────────────────────────────────
flowerRouter.get(
  '/:id/meanings',
  validate(meaningQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Express params are always strings; cast explicitly for @types/express v5 compatibility
    const flowerId = Array.isArray(id) ? id[0] : id;

    if (!mongoose.Types.ObjectId.isValid(flowerId)) {
      throw new BadRequestError('Invalid flower ID — must be a 24-character hex string');
    }

    const flower = await Flower.findById(flowerId);
    if (!flower) throw new NotFoundError('Flower');

    const filter: Record<string, unknown> = {
      flowerId: flower._id,
      isActive: true,
    };

    const { culturalContext } = req.query as unknown as z.infer<typeof meaningQuerySchema>;
    if (culturalContext) filter['culturalContext'] = culturalContext;

    const meanings = await FlowerMeaning.find(filter).sort({ aiWeight: -1 });

    res.json({ success: true, data: meanings });
  }),
);
