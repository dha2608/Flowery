import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';
import { dbLogger, logError } from '../utils/logger.js';

// Use Google/Cloudflare DNS for SRV resolution (fixes ISP DNS issues)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
    });
    dbLogger.info(`Connected to ${conn.connection.host}`);
  } catch (error) {
    logError(error, { context: 'database connection' });
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  dbLogger.warn('Disconnected');
});

mongoose.connection.on('error', (err) => {
  logError(err, { context: 'mongoose connection error' });
});
