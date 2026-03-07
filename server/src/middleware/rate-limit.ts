import rateLimit from 'express-rate-limit';

// Global: 300 requests per minute
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    },
  },
});

// Auth: 20 requests per minute (login/register/reset)
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Quá nhiều lần thử, vui lòng đợi 1 phút',
    },
  },
});

// Search/AI: 30 requests per minute
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'SEARCH_RATE_LIMIT',
      message: 'Quá nhiều tìm kiếm, vui lòng thử lại sau',
    },
  },
});

// Upload: 10 requests per minute
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'UPLOAD_RATE_LIMIT',
      message: 'Quá nhiều tải lên, vui lòng thử lại sau',
    },
  },
});
