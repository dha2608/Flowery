import { Notification, User } from '../models/index.js';

export async function cleanupExpiredData(): Promise<void> {
  const now = new Date();

  // Remove expired notifications (belt-and-suspenders alongside the TTL index)
  const nResult = await Notification.deleteMany({
    expiresAt: { $lt: now },
  });

  // Unset expired password reset tokens so they can no longer be used
  // Note: resetPasswordToken/resetPasswordExpires are select:false but still queryable
  const prResult = await User.updateMany(
    { resetPasswordExpires: { $lt: now } },
    { $unset: { resetPasswordToken: '', resetPasswordExpires: '' } },
  );

  console.log(
    `[CRON] Cleanup: ${nResult.deletedCount} expired notifications, ` +
      `${prResult.modifiedCount} expired password-reset tokens cleared ` +
      `at ${now.toISOString()}`,
  );
}
