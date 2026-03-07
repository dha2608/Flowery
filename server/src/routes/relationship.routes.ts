import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Relationship, Event } from '../models/index.js';
import { NotFoundError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { RELATIONSHIP_TYPES } from '../config/constants.js';

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(OBJECT_ID_RE, 'Invalid ObjectId format');

/** Convert a sort string like "-createdAt" into a Mongoose sort object. */
const buildSort = (sort: string): Record<string, 1 | -1> => {
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  return { [field]: desc ? -1 : 1 };
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

const paramsSchema = z.object({
  id: objectIdSchema,
});

const importantDateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid date format' }),
  isRecurring: z.boolean().optional(),
});

// favoriteFlowers / dislikedFlowers store ObjectId refs to Flower documents
const flowerPreferencesSchema = z.object({
  favoriteColors: z.array(z.string().min(1)).optional(),
  favoriteFlowers: z.array(objectIdSchema).optional(),
  dislikedFlowers: z.array(objectIdSchema).optional(),
  allergies: z.array(z.string().min(1)).optional(),
});

const createRelationshipSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(RELATIONSHIP_TYPES),
  birthday: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid birthday format' })
    .optional(),
  importantDates: z.array(importantDateSchema).optional(),
  flowerPreferences: flowerPreferencesSchema.optional(),
  notes: z.string().max(500).optional(),
});

const updateRelationshipSchema = createRelationshipSchema.partial();

const listQuerySchema = z.object({
  type: z.enum(RELATIONSHIP_TYPES).optional(),
  sort: z
    .enum(['name', '-name', 'createdAt', '-createdAt'])
    .optional()
    .default('createdAt'),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const relationshipRouter = Router();

// All relationship routes require authentication
relationshipRouter.use(requireAuth);

// POST /api/v1/relationships — Create a new relationship
relationshipRouter.post(
  '/',
  validate(createRelationshipSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof createRelationshipSchema>;

    const relationship = await Relationship.create({
      ...body,
      userId: req.user!.userId,
      // Coerce date strings → Date objects so Mongoose stores them correctly
      ...(body.birthday && { birthday: new Date(body.birthday) }),
      ...(body.importantDates && {
        importantDates: body.importantDates.map((d) => ({
          ...d,
          date: new Date(d.date),
        })),
      }),
    });

    res.status(201).json({ success: true, data: { relationship } });
  }),
);

// GET /api/v1/relationships — List the authenticated user's relationships
relationshipRouter.get(
  '/',
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, sort } = req.query as unknown as z.infer<typeof listQuerySchema>;
    const pagination = getPagination(req);

    const filter: Record<string, unknown> = { userId: req.user!.userId };
    if (type) filter.type = type;

    const [relationships, total] = await Promise.all([
      Relationship.find(filter)
        .sort(buildSort(sort))
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Relationship.countDocuments(filter),
    ]);

    res.json(paginateResponse(relationships, total, pagination));
  }),
);

// GET /api/v1/relationships/:id — Get a single relationship (ownership verified)
relationshipRouter.get(
  '/:id',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const relationship = await Relationship.findById(req.params.id).lean();

    if (!relationship) throw new NotFoundError('Relationship');
    if (relationship.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this relationship');
    }

    res.json({ success: true, data: relationship });
  }),
);

// PUT /api/v1/relationships/:id — Update a relationship (ownership verified)
relationshipRouter.put(
  '/:id',
  validate(paramsSchema, 'params'),
  validate(updateRelationshipSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof updateRelationshipSchema>;

    // Verify existence and ownership before any write
    const existing = await Relationship.findById(req.params.id).lean();
    if (!existing) throw new NotFoundError('Relationship');
    if (existing.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this relationship');
    }

    // Coerce date strings → Date objects
    const updatePayload: Record<string, unknown> = { ...body };
    if (body.birthday) updatePayload.birthday = new Date(body.birthday);
    if (body.importantDates) {
      updatePayload.importantDates = body.importantDates.map((d) => ({
        ...d,
        date: new Date(d.date),
      }));
    }

    const updated = await Relationship.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    ).lean();

    res.json({ success: true, data: { relationship: updated } });
  }),
);

// DELETE /api/v1/relationships/:id — Delete relationship + cascade-delete its events
relationshipRouter.delete(
  '/:id',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await Relationship.findById(req.params.id).lean();
    if (!existing) throw new NotFoundError('Relationship');
    if (existing.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this relationship');
    }

    // Run both deletes concurrently — cascade removes associated events
    await Promise.all([
      Relationship.findByIdAndDelete(req.params.id),
      Event.deleteMany({ relationshipId: req.params.id }),
    ]);

    res.json({
      success: true,
      data: { message: 'Relationship and associated events deleted successfully' },
    });
  }),
);
