import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Notification } from '../models/index.js';
import { NotFoundError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { NOTIFICATION_TYPES } from '../config/constants.js';

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(OBJECT_ID_RE, 'Invalid ObjectId format');

// ─── Schemas ──────────────────────────────────────────────────────────────────

const paramsSchema = z.object({
  id: objectIdSchema,
});

const listQuerySchema = z.object({
  type: z.enum(NOTIFICATION_TYPES).optional(),
  // isRead arrives as a query string ('true' / 'false') — transform to boolean
  isRead: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.use(requireAuth);

// GET /api/v1/notifications — List user's notifications (paginated)
// Response includes a top-level `unreadCount` alongside pagination metadata.
notificationRouter.get(
  '/',
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, isRead } =
      req.query as unknown as z.infer<typeof listQuerySchema>;
    const pagination = getPagination(req);

    const filter: Record<string, unknown> = { userId: req.user!.userId };
    if (type !== undefined) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Notification.countDocuments(filter),
      // Always compute total unread count regardless of current filter
      Notification.countDocuments({ userId: req.user!.userId, isRead: false }),
    ]);

    const paginated = paginateResponse(notifications, total, pagination);
    res.json({ ...paginated, unreadCount });
  }),
);

// PUT /api/v1/notifications/read-all — Mark ALL unread notifications as read
// ⚠️  Declared before /:id/read so Express doesn't treat "read-all" as an id param.
//     (Routes differ in segment count so they don't conflict, but explicit ordering
//      is safer and more readable.)
notificationRouter.put(
  '/read-all',
  asyncHandler(async (req: Request, res: Response) => {
    const result = await Notification.updateMany(
      { userId: req.user!.userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    res.json({
      success: true,
      data: {
        message: 'All notifications marked as read',
        modifiedCount: result.modifiedCount,
      },
    });
  }),
);

// PUT /api/v1/notifications/:id/read — Mark a single notification as read
notificationRouter.put(
  '/:id/read',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    // Fetch first to verify ownership before updating
    const notification = await Notification.findById(req.params.id).lean();
    if (!notification) throw new NotFoundError('Notification');
    if (notification.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this notification');
    }

    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true, readAt: new Date() } },
      { new: true },
    ).lean();

    res.json({ success: true, data: updated });
  }),
);

// DELETE /api/v1/notifications/:id — Delete a notification (ownership verified)
notificationRouter.delete(
  '/:id',
  validate(paramsSchema, 'params'),
  asyncHandler(async (req: Request, res: Response) => {
    const notification = await Notification.findById(req.params.id).lean();
    if (!notification) throw new NotFoundError('Notification');
    if (notification.userId.toString() !== req.user!.userId) {
      throw new ForbiddenError('You do not have access to this notification');
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: { message: 'Notification deleted successfully' } });
  }),
);
