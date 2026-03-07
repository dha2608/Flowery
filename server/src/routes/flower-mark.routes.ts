import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { FlowerMark } from '../models/flower-mark.model.js';
import { optionalAuth, type JwtPayload } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthRequest extends Request {
  user?: JwtPayload & { _id?: string };
}

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Validation Schemas ───────────────────────────────────────────────────────

const createMarkSchema = z.object({
  displayName: z.string().max(50).optional().default('Khách'),
  message: z.string().min(1, 'Vui lòng nhập lời nhắn').max(200),
  flowerEmoji: z.string().optional().default('🌸'),
  isAnonymous: z.boolean().optional().default(false),
  orderId: z.string().optional(), // Optional for demo, required in production
});

const FLOWER_EMOJIS = ['🌹', '🌷', '🌻', '🌸', '💐', '🌺', '🌼', '🪻', '🪷', '💮', '🏵️', '🌾'];
const MARK_COLORS = [
  '#fce7f3', // pink-100
  '#fef3c7', // amber-100
  '#dbeafe', // blue-100
  '#dcfce7', // green-100
  '#f3e8ff', // purple-100
  '#ffe4e6', // rose-100
  '#e0f2fe', // sky-100
  '#fef9c3', // yellow-100
];

// Helper: Generate random position that doesn't overlap too much
function generatePosition(existingPositions: { x: number; y: number }[]): { x: number; y: number } {
  const maxAttempts = 50;
  const minDistance = 8; // Minimum distance between marks (percentage)

  for (let i = 0; i < maxAttempts; i++) {
    const x = Math.random() * 85 + 5; // 5-90
    const y = Math.random() * 85 + 5; // 5-90

    // Check distance from existing positions
    const isFarEnough = existingPositions.every((pos) => {
      const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
      return distance >= minDistance;
    });

    if (isFarEnough || existingPositions.length === 0) {
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }
  }

  // Fallback: random position
  return {
    x: Math.round((Math.random() * 85 + 5) * 10) / 10,
    y: Math.round((Math.random() * 85 + 5) * 10) / 10,
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/flower-marks
 * Get all approved flower marks for the garden
 */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const marks = await FlowerMark.find({ isApproved: true })
      .select('displayName message flowerEmoji isAnonymous position color createdAt')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const transformedMarks = marks.map((mark) => ({
      _id: mark._id,
      displayName: mark.isAnonymous ? 'Ẩn danh' : mark.displayName,
      message: mark.message,
      flowerEmoji: mark.flowerEmoji,
      position: mark.position,
      color: mark.color,
      createdAt: mark.createdAt,
    }));

    res.json({
      success: true,
      data: transformedMarks,
      total: transformedMarks.length,
    });
  })
);

/**
 * GET /api/v1/flower-marks/stats
 * Get statistics for the garden
 */
router.get(
  '/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const totalMarks = await FlowerMark.countDocuments({ isApproved: true });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMarks = await FlowerMark.countDocuments({
      isApproved: true,
      createdAt: { $gte: todayStart },
    });

    const emojiStats = await FlowerMark.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$flowerEmoji', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        totalMarks,
        todayMarks,
        topEmojis: emojiStats,
      },
    });
  })
);

/**
 * POST /api/v1/flower-marks
 * Create a new flower mark (1 mark per order only)
 */
router.post(
  '/',
  optionalAuth,
  validate(createMarkSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { displayName, message, flowerEmoji, isAnonymous, orderId } = req.body;

    // Check if this order already has a mark (only if orderId provided)
    if (orderId) {
      const existingMark = await FlowerMark.findOne({ orderId });
      if (existingMark) {
        res.status(400).json({
          success: false,
          message: 'Đơn hàng này đã có dấu ấn trong vườn rồi',
        });
        return;
      }
    }

    const recentMarks = await FlowerMark.find({ isApproved: true })
      .select('position')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const existingPositions = recentMarks.map(
      (m: { position: { x: number; y: number } }) => m.position
    );
    const position = generatePosition(existingPositions);

    const color = MARK_COLORS[Math.floor(Math.random() * MARK_COLORS.length)];
    const validEmoji = FLOWER_EMOJIS.includes(flowerEmoji) ? flowerEmoji : '🌸';

    const finalDisplayName = isAnonymous ? 'Ẩn danh' : displayName?.trim() || 'Khách';

    const mark = await FlowerMark.create({
      userId: req.user?.userId,
      orderId,
      displayName: finalDisplayName,
      message: message.trim(),
      flowerEmoji: validEmoji,
      isAnonymous,
      position,
      color,
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: mark._id,
        displayName: isAnonymous ? 'Ẩn danh' : mark.displayName,
        message: mark.message,
        flowerEmoji: mark.flowerEmoji,
        position: mark.position,
        color: mark.color,
        createdAt: mark.createdAt,
      },
    });
  })
);

/**
 * GET /api/v1/flower-marks/my
 * Get current user's marks
 */
router.get(
  '/my',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.json({ success: true, data: [] });
      return;
    }

    const marks = await FlowerMark.find({ userId: req.user.userId })
      .select('displayName message flowerEmoji position color createdAt isApproved')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: marks });
  })
);

export default router;
