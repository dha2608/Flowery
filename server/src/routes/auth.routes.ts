import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { User } from '../models/index.js';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  AppError,
} from '../middleware/error-handler.js';
import {
  getGoogleAuthUrl,
  getGoogleTokens,
  getGoogleUser,
  getFacebookAuthUrl,
  getFacebookTokens,
  getFacebookUser,
} from '../utils/oauth.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { sendEmail } from '../utils/email.js';
import { verificationEmail, passwordResetEmail } from '../utils/email-templates.js';
import { env } from '../config/env.js';
import { logSecurityEvent } from '../utils/security-logger.js';

// ─── Async Handler ────────────────────────────────────────────────────────────

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── Validation Schemas ───────────────────────────────────────────────────────

const VN_PHONE_REGEX = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])/;

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, 'Password must contain at least 1 uppercase letter and 1 number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z.string().regex(VN_PHONE_REGEX, 'Invalid Vietnamese phone number').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, 'Password must contain at least 1 uppercase letter and 1 number'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const authRouter = Router();

// POST /api/v1/auth/register
authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body as z.infer<typeof registerSchema>;

    // Check email uniqueness
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate tokens before saving so we can add refreshToken
    const newUser = new User({
      email,
      passwordHash,
      name,
      phone,
    });

    const accessToken = generateAccessToken({
      userId: String(newUser._id),
      email: newUser.email,
      role: newUser.role,
    });
    const refreshToken = generateRefreshToken({
      userId: String(newUser._id),
      email: newUser.email,
      role: newUser.role,
    });

    // Generate email verification token
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const hashedVerifyToken = crypto.createHash('sha256').update(rawVerifyToken).digest('hex');
    newUser.emailVerificationToken = hashedVerifyToken;
    newUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    newUser.refreshTokens = [refreshToken];
    newUser.lastLoginAt = new Date();
    await newUser.save();

    // Send verification email (fire-and-forget)
    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${rawVerifyToken}`;
    sendEmail({
      to: email,
      subject: 'Xác thực tài khoản Flowery',
      html: verificationEmail(name, verifyUrl),
    }).catch((err) => console.error('[EMAIL] Failed to send verification:', err));

    res.status(201).json({
      success: true,
      data: {
        user: newUser.toJSON(),
        tokens: { accessToken, refreshToken, expiresIn: 900 },
      },
    });
  })
);

// POST /api/v1/auth/login
authRouter.post(
  '/login',
  validate(loginSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    // Find user and explicitly select passwordHash + lockout fields (select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash +refreshTokens +loginAttempts +lockUntil'
    );
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      logSecurityEvent('LOGIN_BLOCKED_LOCKED', {
        email: email.toLowerCase(),
        lockUntil: user.lockUntil,
        ip: req.ip,
      });
      throw new AppError(
        'Tài khoản tạm khóa. Vui lòng thử lại sau 15 phút.',
        429,
        'ACCOUNT_LOCKED'
      );
    }

    // If lockout period has expired, reset the counter
    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts ?? 0) + 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        logSecurityEvent('ACCOUNT_LOCKOUT', {
          email: email.toLowerCase(),
          loginAttempts: user.loginAttempts,
          lockUntil: user.lockUntil,
          ip: req.ip,
        });
      } else {
        logSecurityEvent('LOGIN_FAILED', {
          email: email.toLowerCase(),
          loginAttempts: user.loginAttempts,
          ip: req.ip,
        });
      }

      await user.save();
      throw new UnauthorizedError('Invalid email or password');
    }

    // Successful login — reset lockout state
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    // Update lastLoginAt and persist refresh token
    user.lastLoginAt = new Date();
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        tokens: { accessToken, refreshToken, expiresIn: 900 },
      },
    });
  })
);

// POST /api/v1/auth/refresh
authRouter.post(
  '/refresh',
  validate(refreshTokenSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as z.infer<typeof refreshTokenSchema>;

    // Verify signature / expiry
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Find user with their stored refresh tokens
    const user = await User.findById(payload.userId).select('+refreshTokens');
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Confirm token is still in the array (handles revocation)
    if (!user.refreshTokens.includes(refreshToken)) {
      // Possible token reuse — clear all tokens as a security measure
      logSecurityEvent('REFRESH_TOKEN_REUSE', {
        userId: payload.userId,
        ip: req.ip,
      });
      user.refreshTokens = [];
      await user.save();
      throw new UnauthorizedError('Refresh token has already been used or revoked');
    }

    // Rotate: remove old, issue new
    const newAccessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      success: true,
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      },
    });
  })
);

// POST /api/v1/auth/logout
authRouter.post(
  '/logout',
  requireAuth,
  validate(logoutSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as z.infer<typeof logoutSchema>;
    const { userId } = req.user!;

    const user = await User.findById(userId).select('+refreshTokens');
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  })
);

// POST /api/v1/auth/forgot-password
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as z.infer<typeof forgotPasswordSchema>;

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success to prevent email enumeration
    if (user && user.isActive) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Persist hashed token + 1-hour expiry so reset-password can verify it
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      logSecurityEvent('PASSWORD_RESET_REQUESTED', {
        email: user.email,
        ip: req.ip,
      });

      // Send password reset email (fire-and-forget)
      const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
      sendEmail({
        to: user.email,
        subject: 'Đặt lại mật khẩu Flowery',
        html: passwordResetEmail(user.name, resetUrl),
      }).catch((err) => console.error('[EMAIL] Failed to send reset:', err));
    }

    res.json({
      success: true,
      data: {
        message: 'If that email exists in our system, a reset link has been sent.',
      },
    });
  })
);

// POST /api/v1/auth/reset-password
authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body as z.infer<typeof resetPasswordSchema>;

    // Hash the plain token from the URL to compare against the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find a user whose token matches and hasn't expired yet
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+passwordHash +resetPasswordToken +resetPasswordExpires');

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid or expired password reset token');
    }

    // Update password and clear reset fields so the token cannot be reused
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logSecurityEvent('PASSWORD_RESET_COMPLETED', {
      userId: String(user._id),
      email: user.email,
      ip: req.ip,
    });

    res.json({
      success: true,
      data: {
        message: 'Password has been reset successfully. Please log in with your new password.',
      },
    });
  })
);

// POST /api/v1/auth/verify-email
authRouter.post(
  '/verify-email',
  validate(verifyEmailSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body as z.infer<typeof verifyEmailSchema>;

    // Hash the plain token to compare against the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find a user whose verification token matches and hasn't expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid or expired email verification token');
    }

    // Mark email as verified and clear token fields
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      data: { message: 'Email đã được xác thực' },
    });
  })
);

// POST /api/v1/auth/resend-verification
authRouter.post(
  '/resend-verification',
  validate(resendVerificationSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as z.infer<typeof resendVerificationSchema>;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+emailVerificationToken +emailVerificationExpires'
    );

    // Always respond with success to prevent email enumeration
    if (user && user.isActive && !user.emailVerified) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

      // Store hashed token with 24-hour expiry
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      // Send verification email (fire-and-forget)
      const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      sendEmail({
        to: user.email,
        subject: 'Xác thực tài khoản Flowery',
        html: verificationEmail(user.name, verifyUrl),
      }).catch((err) => console.error('[EMAIL] Failed to send verification:', err));
    }

    res.json({
      success: true,
      data: { message: 'Email xác thực đã được gửi lại' },
    });
  })
);

// ─── Google OAuth ─────────────────────────────────────────────────────────────

// GET /api/v1/auth/google - Redirect to Google consent screen
authRouter.get(
  '/google',
  asyncHandler(async (_req: Request, res: Response) => {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new BadRequestError('Google OAuth chưa được cấu hình');
    }
    res.redirect(getGoogleAuthUrl());
  })
);

// GET /api/v1/auth/google/callback - Handle Google callback
authRouter.get(
  '/google/callback',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw new BadRequestError('Mã xác thực không hợp lệ');
    }

    const googleTokens = await getGoogleTokens(code);
    const googleUser = await getGoogleUser(googleTokens.access_token);

    // Find or create user
    let user = await User.findOne({
      'authProviders.provider': 'google',
      'authProviders.providerId': googleUser.sub,
    }).select('+refreshTokens');

    if (!user) {
      // Check if email already exists
      const existingUser = await User.findOne({ email: googleUser.email }).select('+refreshTokens');

      if (existingUser) {
        // Link Google to existing account
        existingUser.authProviders.push({ provider: 'google', providerId: googleUser.sub });
        if (!existingUser.avatar && googleUser.picture) {
          existingUser.avatar = { url: googleUser.picture, publicId: '' };
        }
        user = existingUser;
      } else {
        // Create new user — generate unusable random password for OAuth-only accounts
        const randomPassword = crypto.randomBytes(32).toString('hex');
        user = await User.create({
          email: googleUser.email,
          name: googleUser.name,
          avatar: { url: googleUser.picture, publicId: '' },
          emailVerified: true,
          authProviders: [{ provider: 'google', providerId: googleUser.sub }],
          passwordHash: await bcrypt.hash(randomPassword, 10),
        });
      }
    }

    // Generate JWT tokens
    const jwtPayload = { userId: String(user._id), email: user.email, role: user.role };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    // Persist refresh token and update last login
    user.refreshTokens.push(refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    // Redirect to client with tokens in query params
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      userId: String(user._id),
    });
    res.redirect(`${env.CLIENT_URL}/auth/callback?${params.toString()}`);
  })
);

// ─── Facebook OAuth ───────────────────────────────────────────────────────────

// GET /api/v1/auth/facebook - Redirect to Facebook consent screen
authRouter.get(
  '/facebook',
  asyncHandler(async (_req: Request, res: Response) => {
    if (!env.FACEBOOK_APP_ID) {
      throw new BadRequestError('Facebook OAuth chưa được cấu hình');
    }
    res.redirect(getFacebookAuthUrl());
  })
);

// GET /api/v1/auth/facebook/callback - Handle Facebook callback
authRouter.get(
  '/facebook/callback',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw new BadRequestError('Mã xác thực không hợp lệ');
    }

    const fbTokens = await getFacebookTokens(code);
    const fbUser = await getFacebookUser(fbTokens.access_token);

    // Find or create user
    let user = await User.findOne({
      'authProviders.provider': 'facebook',
      'authProviders.providerId': fbUser.id,
    }).select('+refreshTokens');

    if (!user) {
      // Check if email already exists (Facebook may not always provide email)
      if (fbUser.email) {
        const existingUser = await User.findOne({ email: fbUser.email }).select('+refreshTokens');

        if (existingUser) {
          // Link Facebook to existing account
          existingUser.authProviders.push({ provider: 'facebook', providerId: fbUser.id });
          if (!existingUser.avatar && fbUser.picture?.data?.url) {
            existingUser.avatar = { url: fbUser.picture.data.url, publicId: '' };
          }
          user = existingUser;
        }
      }

      if (!user) {
        // Create new user
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const email = fbUser.email || `fb_${fbUser.id}@flowery.local`;

        user = await User.create({
          email,
          name: fbUser.name,
          avatar: fbUser.picture?.data?.url
            ? { url: fbUser.picture.data.url, publicId: '' }
            : undefined,
          emailVerified: !!fbUser.email,
          authProviders: [{ provider: 'facebook', providerId: fbUser.id }],
          passwordHash: await bcrypt.hash(randomPassword, 10),
        });
      }
    }

    // Generate JWT tokens
    const jwtPayload = { userId: String(user._id), email: user.email, role: user.role };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    // Persist refresh token and update last login
    user.refreshTokens.push(refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    // Redirect to client with tokens in query params
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      userId: String(user._id),
    });
    res.redirect(`${env.CLIENT_URL}/auth/callback?${params.toString()}`);
  })
);
