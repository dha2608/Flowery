import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { User } from '../models/index.js';
import { NotFoundError } from '../middleware/error-handler.js';
import { EMOTIONS, OCCASIONS } from '../config/constants.js';

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ─── Validation Schemas ───────────────────────────────────────────────────────

const VN_PHONE_REGEX = /^(\+84|0)(3|5|7|8|9)\d{8}$/;

const updateMeSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(VN_PHONE_REGEX, 'Invalid Vietnamese phone number')
    .optional(),
});

const updatePreferencesSchema = z.object({
  // ── Canonical new field names ──────────────────────────────────────────────
  colors: z.array(z.string().min(1)).optional(),
  emotions: z.array(z.enum(EMOTIONS)).optional(),
  budgetRange: z
    .object({
      min: z.number().min(0, 'Budget min must be non-negative'),
      max: z.number().min(0, 'Budget max must be non-negative'),
    })
    .refine((b) => b.min <= b.max, { message: 'Budget min must be ≤ max' })
    .optional(),
  favoriteFlowers: z.array(z.string().min(1)).optional(),
  occasions: z.array(z.enum(OCCASIONS)).optional(),
  // ── Legacy field names (backward compat) ──────────────────────────────────
  favoriteColors: z.array(z.string().min(1)).optional(),
  favoriteEmotions: z.array(z.enum(EMOTIONS)).optional(),
  budget: z
    .object({
      min: z.number().min(0, 'Budget min must be non-negative'),
      max: z.number().min(0, 'Budget max must be non-negative'),
    })
    .refine((b) => b.min <= b.max, { message: 'Budget min must be ≤ max' })
    .optional(),
  // ── Kept unchanged ────────────────────────────────────────────────────────
  allergies: z.array(z.string().min(1)).optional(),
});

const updateAvatarSchema = z.object({
  url: z.string().url('Avatar URL must be a valid URL'),
  publicId: z.string().optional(),
});

const addAddressSchema = z.object({
  label: z.string().min(1).max(50, 'Label must be at most 50 characters').optional(),
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name must be at most 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(VN_PHONE_REGEX, 'Invalid Vietnamese phone number')
    .optional(),
  street: z.string().min(1, 'Street is required'),
  ward: z.string().min(1, 'Ward is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  isDefault: z.boolean().optional().default(false),
});

const updateAddressSchema = z.object({
  label: z.string().min(1).max(50, 'Label must be at most 50 characters').optional(),
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name must be at most 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(VN_PHONE_REGEX, 'Invalid Vietnamese phone number')
    .optional(),
  street: z.string().min(1, 'Street is required').optional(),
  ward: z.string().min(1, 'Ward is required').optional(),
  district: z.string().min(1, 'District is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  isDefault: z.boolean().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const userRouter = Router();

// All user routes require authentication
userRouter.use(requireAuth);

// GET /api/v1/users/me
userRouter.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  })
);

// PUT /api/v1/users/me
userRouter.put(
  '/me',
  validate(updateMeSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const updates = req.body as z.infer<typeof updateMeSchema>;

    // email and role are intentionally excluded from allowed updates
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: { user: user.toJSON() },
    });
  })
);

// PUT /api/v1/users/me/preferences
userRouter.put(
  '/me/preferences',
  validate(updatePreferencesSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const prefs = req.body as z.infer<typeof updatePreferencesSchema>;

    // Resolve old field names → canonical DB field names.
    // New name takes precedence; old name is the fallback for backward compat.
    const resolvedColors = prefs.colors ?? prefs.favoriteColors;
    const resolvedEmotions = prefs.emotions ?? prefs.favoriteEmotions;
    const resolvedBudget = prefs.budgetRange ?? prefs.budget;

    // Build a targeted $set so unspecified preference fields are untouched
    const prefSet: Record<string, unknown> = {};
    if (resolvedColors !== undefined) {
      prefSet['preferences.colors'] = resolvedColors;
    }
    if (resolvedEmotions !== undefined) {
      prefSet['preferences.emotions'] = resolvedEmotions;
    }
    if (resolvedBudget !== undefined) {
      prefSet['preferences.budget'] = resolvedBudget;
    }
    if (prefs.favoriteFlowers !== undefined) {
      prefSet['preferences.favoriteFlowers'] = prefs.favoriteFlowers;
    }
    if (prefs.occasions !== undefined) {
      prefSet['preferences.occasions'] = prefs.occasions;
    }
    if (prefs.allergies !== undefined) {
      prefSet['preferences.allergies'] = prefs.allergies;
    }

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { $set: prefSet },
      { new: true, runValidators: true }
    );
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: { user: user.toJSON() },
    });
  })
);

// PUT /api/v1/users/me/avatar
// MVP: accepts avatar URL directly (no file upload)
userRouter.put(
  '/me/avatar',
  validate(updateAvatarSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { url, publicId } = req.body as z.infer<typeof updateAvatarSchema>;

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      {
        $set: {
          'avatar.url': url,
          ...(publicId !== undefined && { 'avatar.publicId': publicId }),
        },
      },
      { new: true, runValidators: true }
    );
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: { user: user.toJSON() },
    });
  })
);

// DELETE /api/v1/users/me — soft delete
userRouter.delete(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: { message: 'Account deactivated successfully' },
    });
  })
);

// ─── Address Book Routes ──────────────────────────────────────────────────────

// GET /api/v1/users/me/addresses
userRouter.get(
  '/me/addresses',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: { addresses: user.addresses },
    });
  })
);

// POST /api/v1/users/me/addresses
userRouter.post(
  '/me/addresses',
  validate(addAddressSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as z.infer<typeof addAddressSchema>;

    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    // If new address is set as default, unset all existing defaults
    if (input.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(input as Parameters<typeof user.addresses.push>[0]);
    await user.save();

    res.status(201).json({
      success: true,
      data: { addresses: user.addresses },
    });
  })
);

// PUT /api/v1/users/me/addresses/:addressId
userRouter.put(
  '/me/addresses/:addressId',
  validate(updateAddressSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const updates = req.body as z.infer<typeof updateAddressSchema>;

    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    const address = user.addresses.find((addr) => String(addr._id) === addressId);
    if (!address) {
      throw new NotFoundError('Address');
    }

    // If setting as default, unset all other defaults first
    if (updates.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Apply updates to the subdocument in place
    Object.assign(address, updates);
    await user.save();

    res.json({
      success: true,
      data: { addresses: user.addresses },
    });
  })
);

// DELETE /api/v1/users/me/addresses/:addressId
userRouter.delete(
  '/me/addresses/:addressId',
  asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;

    const user = await User.findById(req.user!.userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User');
    }

    const idx = user.addresses.findIndex((addr) => String(addr._id) === addressId);
    if (idx === -1) {
      throw new NotFoundError('Address');
    }

    user.addresses.splice(idx, 1);
    await user.save();

    res.json({
      success: true,
      data: { addresses: user.addresses },
    });
  })
);
