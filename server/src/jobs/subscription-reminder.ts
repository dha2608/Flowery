import { Subscription, Notification } from '../models/index.js';

export async function processSubscriptionReminders(): Promise<void> {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Find active subscriptions with delivery in next 3 days
  const subscriptions = await Subscription.find({
    status: 'active',
    nextDeliveryDate: { $gte: now, $lte: threeDaysFromNow },
  }).populate('shopId', 'name');

  for (const sub of subscriptions) {
    const deliveryDate = new Date(sub.nextDeliveryDate);
    const daysUntil = Math.ceil(
      (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Only remind at 3 days and 1 day before
    if (daysUntil !== 3 && daysUntil !== 1) continue;

    const shop = sub.shopId as unknown as { name: string } | null;

    // Deduplication via actionUrl — Notification.data has no subscriptionId field,
    // so we encode subscriptionId + daysUntil into actionUrl as a unique key
    const dedupeKey = `sub-reminder:${sub._id.toString()}:${daysUntil}`;
    const existing = await Notification.findOne({
      userId: sub.userId,
      type: 'subscription_renewal',
      'data.actionUrl': dedupeKey,
    });
    if (existing) continue;

    await Notification.create({
      userId: sub.userId,
      type: 'subscription_renewal',
      title: 'Giao hoa định kỳ sắp đến',
      message:
        daysUntil === 1
          ? `Đơn hoa từ ${shop?.name ?? 'cửa hàng'} sẽ được giao vào ngày mai!`
          : `Còn ${daysUntil} ngày đến lượt giao hoa từ ${shop?.name ?? 'cửa hàng'}`,
      data: {
        actionUrl: dedupeKey,
      },
      channels: ['in_app'],
    });
  }

  console.log(
    `[CRON] Subscription reminders processed at ${now.toISOString()}`,
  );
}
