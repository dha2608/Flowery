import admin from 'firebase-admin';
import { env } from '../config/env.js';
import { DeviceToken } from '../models/device-token.model.js';
import type mongoose from 'mongoose';

// Initialize Firebase Admin
let firebaseInitialized = false;

function initializeFirebase() {
  if (firebaseInitialized) return;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_PRIVATE_KEY || !env.FIREBASE_CLIENT_EMAIL) {
    console.warn('Firebase credentials not configured. Push notifications disabled.');
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    firebaseInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// Initialize on module load
initializeFirebase();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PushNotification {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
  link?: string;
}

// ─── Send to Single Token ─────────────────────────────────────────────────────

export async function sendPushNotification(
  token: string,
  notification: PushNotification
): Promise<boolean> {
  if (!firebaseInitialized) {
    console.warn('Firebase not initialized. Skipping push notification.');
    return false;
  }

  try {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: notification.data,
      webpush: notification.link
        ? {
            fcmOptions: {
              link: notification.link,
            },
          }
        : undefined,
    };

    const response = await admin.messaging().send(message);
    console.log('Push notification sent:', response);
    return true;
  } catch (error: any) {
    console.error('Failed to send push notification:', error);

    // If token is invalid, mark it as inactive
    if (
      error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered'
    ) {
      await DeviceToken.updateOne({ token }, { isActive: false });
    }
    return false;
  }
}

// ─── Send to User (All Devices) ───────────────────────────────────────────────

export async function sendPushToUser(
  userId: mongoose.Types.ObjectId | string,
  notification: PushNotification
): Promise<{ success: number; failed: number }> {
  const tokens = await DeviceToken.find({ userId, isActive: true });

  if (tokens.length === 0) {
    return { success: 0, failed: 0 };
  }

  const results = await Promise.all(tokens.map((t) => sendPushNotification(t.token, notification)));

  const success = results.filter(Boolean).length;
  return { success, failed: results.length - success };
}

// ─── Send to Multiple Users ───────────────────────────────────────────────────

export async function sendPushToUsers(
  userIds: (mongoose.Types.ObjectId | string)[],
  notification: PushNotification
): Promise<{ success: number; failed: number }> {
  const results = await Promise.all(userIds.map((userId) => sendPushToUser(userId, notification)));

  return results.reduce(
    (acc, r) => ({ success: acc.success + r.success, failed: acc.failed + r.failed }),
    { success: 0, failed: 0 }
  );
}

// ─── Broadcast to All Users ───────────────────────────────────────────────────

export async function broadcastPush(
  notification: PushNotification
): Promise<{ success: number; failed: number }> {
  if (!firebaseInitialized) {
    return { success: 0, failed: 0 };
  }

  const tokens = await DeviceToken.find({ isActive: true }).limit(500);

  if (tokens.length === 0) {
    return { success: 0, failed: 0 };
  }

  const message: admin.messaging.MulticastMessage = {
    tokens: tokens.map((t) => t.token),
    notification: {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.imageUrl,
    },
    data: notification.data,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    // Mark failed tokens as inactive
    const failedTokens = tokens
      .filter((_, i) => !response.responses[i].success)
      .map((t) => t.token);

    if (failedTokens.length > 0) {
      await DeviceToken.updateMany({ token: { $in: failedTokens } }, { isActive: false });
    }

    return {
      success: response.successCount,
      failed: response.failureCount,
    };
  } catch (error) {
    console.error('Failed to broadcast push:', error);
    return { success: 0, failed: tokens.length };
  }
}

// ─── Notification Templates ───────────────────────────────────────────────────

export const PushTemplates = {
  orderConfirmed: (orderId: string) => ({
    title: '🌸 Đơn hàng đã xác nhận',
    body: 'Đơn hàng của bạn đang được chuẩn bị. Theo dõi ngay!',
    data: { type: 'order', orderId },
    link: `/orders/${orderId}`,
  }),

  orderShipped: (orderId: string) => ({
    title: '🚚 Đang giao hàng',
    body: 'Đơn hàng của bạn đang trên đường giao. Chuẩn bị nhận hoa nào!',
    data: { type: 'order', orderId },
    link: `/orders/${orderId}`,
  }),

  orderDelivered: (orderId: string) => ({
    title: '✅ Giao hàng thành công',
    body: 'Đơn hàng đã được giao. Cảm ơn bạn đã mua hàng!',
    data: { type: 'order', orderId },
    link: `/orders/${orderId}`,
  }),

  newPromotion: (title: string, eventId?: string) => ({
    title: '🎉 Khuyến mãi mới',
    body: title,
    data: eventId ? { type: 'event', eventId } : { type: 'promotion' },
    link: eventId ? `/events/${eventId}` : '/events',
  }),

  subscriptionReminder: (daysLeft: number) => ({
    title: '💐 Nhắc nhở đăng ký',
    body: `Gói đăng ký của bạn sẽ hết hạn sau ${daysLeft} ngày. Gia hạn ngay!`,
    data: { type: 'subscription' },
    link: '/subscriptions',
  }),

  newFlowerMark: (senderName: string) => ({
    title: '🌷 Có người gửi hoa cho bạn',
    body: `${senderName} đã trồng một bông hoa trong vườn kỷ niệm`,
    data: { type: 'garden' },
    link: '/garden',
  }),
};
