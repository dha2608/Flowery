import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Event, Relationship } from '../models/index.js';
import { NotFoundError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { EVENT_TYPES } from '../config/constants.js';

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(OBJECT_ID_RE, 'Invalid ObjectId format');

const buildSort = (sort: string): Record<string, 1 | -1> => {
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  return { [field]: desc ? -1 : 1 };
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

const paramsSchema = z.object({
  id: objectIdSchema,
});

// Matches the actual model: channels enum is 'push' | 'email' | 'sms'
const reminderSettingsSchema = z.object({
  enabled: z.boolean(),
  daysBefore: z
    .array(z.number().int().min(0).max(365))
    .min(1, 'At least one daysBefore value is required'),
  channels: z.array(z.enum(['push', 'email', 'sms'])).min(1),
});

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid date format' }),
  type: z.enum(EVENT_TYPES),
  relationshipId: objectIdSchema.optional(),
  reminderSettings: reminderSettingsSchema.optional(),
  isRecurring: z.boolean().optional(),
  // Model field is `recurrencePattern` (yearly | monthly only — no weekly)
  recurrencePattern: z.enum(['yearly', 'monthly']).optional(),
});

const updateEventSchema = createEventSchema.partial();

const listQuerySchema = z.object({
  type: z.enum(EVENT_TYPES).optional(),
  // upcoming=true filters events with date >= now
  upcoming: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  // ISO date strings for date range filtering
  startDate: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid startDate' })
    .optional(),
  endDate: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid endDate' })
    .optional(),
  // Filter events belonging to a specific relationship
  relationshipId: objectIdSchema.optional(),
  sort: z
    .enum(['date', '-date', 'createdAt', '-createdAt'])
    .optional()
    .default('date'),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

const upcomingQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).optional().default(30),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const eventRouter = Router();

// All event routes require authentication
eventRouter.use(requireAuth);

// POST /api/v1/events — Create a new event
eventRouter.post(
  '/',
  validate(createEventSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof createEventSchema>;

    // If a relationshipId is provided, verify it exists and belongs to the user
    if (body.relationshipId) {
      const relationship = await Relationship.findById(body.relationshipId).lean();
      if (!relationship) throw new NotFoundError('Relationship');
      if (relationship.userId.toString() !== req.user!.userId) {
        throw new ForbiddenError('You do not have access to this relationship');
      }
    }

    const event = await Event.create({
      ...body,
      userId: req.user!.userId,
      date: new Date(body.date),
    });

    res.status(201).json({ success: true, data: event });
  }),
);

// GET /api/v1/events — List the authenticated user's events (paginated)
eventRouter.get(
  '/',
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, upcoming, startDate, endDate, relationshipId, sort } =
      req.query as unknown as z.infer<typeof listQuerySchema>;
    const pagination = getPagination(req);

    const filter: Record<string, unknown> = { userId: req.user!.userId };
    if (type) filter.type = type;
    if (relationshipId) filter.relationshipId = relationshipId;

    // Build date range filter — startDate overrides the `upcoming` $gte bound
    const dateFilter: Record<string, Date> = {};
    if (upcoming) dateFilter.$gte = new Date();
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) filter.date = dateFilter;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(buildSort(sort))
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    res.json(paginateResponse(events, total, pagination));
  }),
);

// GET /api/v1/events/upcoming — Events occurring in the next N days
// ⚠️  This route MUST be declared before /:id to prevent "upcoming" being
//     matched as an ObjectId param.
eventRouter.get(
  '/upcoming',
  validate(upcomingQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { days } = req.query as unknown as z.infer<typeof upcomingQuerySchema>;

    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const events = await Event.find({
      userId: req.user!.userId,
      date: { $gte: now, $lte: until },
    })
      .populate('relationshipId', 'name type')
      .sort({ date: 1 })
      .lean();

    res.json({
      success: true,
      data: events,
      meta: { days, from: now, to: until },
    });
  }),
);

// GET /api/v1/events/:id — Get a single event (ownership verified)
eventRouter.get(
  '/:id',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id)
      .populate('relationshipId', 'name type')
      .lean();

    if (!event) throw new NotFoundError('Event');
    if (event.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this event');
    }

    res.json({ success: true, data: event });
  }),
);

// PUT /api/v1/events/:id — Update an event (ownership verified)
eventRouter.put(
  '/:id',
  validate(paramsSchema, 'params'),
  validate(updateEventSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof updateEventSchema>;

    // Verify existence and ownership before any write
    const existing = await Event.findById(req.params.id).lean();
    if (!existing) throw new NotFoundError('Event');
    if (existing.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this event');
    }

    // If relationshipId is being changed, verify the new relationship is owned by user
    if (body.relationshipId) {
      const relationship = await Relationship.findById(body.relationshipId).lean();
      if (!relationship) throw new NotFoundError('Relationship');
      if (relationship.userId.toString() !== req.user!.userId) {
        throw new ForbiddenError('You do not have access to this relationship');
      }
    }

    // Coerce date string → Date object if provided
    const updatePayload: Record<string, unknown> = { ...body };
    if (body.date) updatePayload.date = new Date(body.date);

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    )
      .populate('relationshipId', 'name type')
      .lean();

    res.json({ success: true, data: updated });
  }),
);

// DELETE /api/v1/events/:id — Delete an event (ownership verified)
eventRouter.delete(
  '/:id',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await Event.findById(req.params.id).lean();
    if (!existing) throw new NotFoundError('Event');
    if (existing.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this event');
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: { message: 'Event deleted successfully' } });
  }),
);
