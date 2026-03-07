import mongoose, { Schema, type Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'order_status' | 'event_reminder' | 'ai_suggestion' | 'promo' | 'review_request' | 'system' | 'subscription_renewal' | 'shop_reply';
  title: string;
  message: string;
  data?: {
    orderId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
    shopId?: mongoose.Types.ObjectId;
    productId?: mongoose.Types.ObjectId;
    actionUrl?: string;
  };
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  isRead: boolean;
  readAt?: Date;
  sentAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['order_status', 'event_reminder', 'ai_suggestion', 'promo', 'review_request', 'system', 'subscription_renewal', 'shop_reply'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
      shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      actionUrl: String,
    },
    channels: {
      type: [String],
      enum: ['push', 'email', 'sms', 'in_app'],
      default: ['in_app'],
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    sentAt: Date,
    expiresAt: {
      type: Date,
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
