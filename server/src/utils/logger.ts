import winston from 'winston';

import { env } from '../config/env.js';

// ─── Log Formats ──────────────────────────────────────────────────────────────

const { combine, timestamp, printf, colorize, json } = winston.format;

// Human-readable format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}] ${message}${metaStr}`;
  }),
);

// JSON format for production (better for log aggregation)
const prodFormat = combine(timestamp(), json());

// ─── Logger Instance ──────────────────────────────────────────────────────────

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { service: 'flowery-api' },
  transports: [new winston.transports.Console()],
});

// ─── Specialized Loggers ──────────────────────────────────────────────────────

export const dbLogger = logger.child({ module: 'database' });
export const authLogger = logger.child({ module: 'auth' });
export const emailLogger = logger.child({ module: 'email' });
export const cronLogger = logger.child({ module: 'cron' });
export const orderLogger = logger.child({ module: 'order' });
export const securityLogger = logger.child({ module: 'security' });

// ─── Request Logging (Morgan integration) ─────────────────────────────────────

export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// ─── Error Logging Helper ─────────────────────────────────────────────────────

export function logError(error: Error | unknown, context?: Record<string, unknown>): void {
  if (error instanceof Error) {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      ...context,
    });
  } else {
    logger.error('Unknown error', { error, ...context });
  }
}
