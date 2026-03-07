import cron from 'node-cron';
import { processEventReminders } from './event-reminder.js';
import { processSubscriptionReminders } from './subscription-reminder.js';
import { cleanupExpiredData } from './cleanup.js';

export function startCronJobs(): void {
  // Event reminders — every day at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      await processEventReminders();
    } catch (error) {
      console.error('[CRON] Event reminder error:', error);
    }
  });

  // Subscription reminders — every day at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      await processSubscriptionReminders();
    } catch (error) {
      console.error('[CRON] Subscription reminder error:', error);
    }
  });

  // Cleanup expired data — every day at 03:00 AM
  cron.schedule('0 3 * * *', async () => {
    try {
      await cleanupExpiredData();
    } catch (error) {
      console.error('[CRON] Cleanup error:', error);
    }
  });

  console.log('[CRON] Scheduled jobs started');
}
