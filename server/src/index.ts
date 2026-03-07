import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { requestId } from './middleware/request-id.js';
import { globalLimiter, authLimiter, searchLimiter } from './middleware/rate-limit.js';
import { mongoSanitize } from './middleware/sanitize.js';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { relationshipRouter } from './routes/relationship.routes.js';
import { eventRouter } from './routes/event.routes.js';
import { flowerRouter } from './routes/flower.routes.js';
import { recommendationRouter } from './routes/recommendation.routes.js';
import { shopRouter } from './routes/shop.routes.js';
import { productRouter } from './routes/product.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { reviewRouter } from './routes/review.routes.js';
import { notificationRouter } from './routes/notification.routes.js';
import { subscriptionRouter } from './routes/subscription.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';
import { paymentRouter } from './routes/payment.routes.js';
import contactRouter from './routes/contact.routes.js';
import flowerMarkRouter from './routes/flower-mark.routes.js';
import { startCronJobs } from './jobs/index.js';
import { logger, httpLogStream, logError } from './utils/logger.js';

const app = express();

// Security & parsing middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          'data:',
          'https://res.cloudinary.com',
          'https://images.unsplash.com',
        ],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(requestId);
app.use(globalLimiter);
app.use(
  cors({
    origin: env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: httpLogStream }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/relationships', relationshipRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/flowers', searchLimiter, flowerRouter);
app.use('/api/v1/recommendations', searchLimiter, recommendationRouter);
app.use('/api/v1/shops', shopRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/webhooks', webhookRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/flower-marks', flowerMarkRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  startCronJobs();
  app.listen(env.PORT, () => {
    logger.info(`Flowery API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

start().catch((err) => logError(err, { context: 'startup' }));

export { app };
