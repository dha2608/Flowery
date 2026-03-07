import mongoose, { Schema, type Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  planType: 'weekly' | 'biweekly' | 'monthly';
  preferences: {
    budget: {
      min: number;
      max: number;
    };
    emotions: string[];
    colors: string[];
    excludeFlowers: mongoose.Types.ObjectId[];
    notes?: string;
  };
  deliveryAddress: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  nextDeliveryDate: Date;
  lastDeliveryDate?: Date;
  status: 'active' | 'paused' | 'cancelled';
  pausedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  totalDeliveries: number;
  paymentMethod: 'vnpay' | 'momo' | 'zalopay' | 'bank_transfer';
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    planType: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: true,
    },
    preferences: {
      budget: {
        min: { type: Number, default: 200000, min: 100000 },
        max: { type: Number, default: 500000, max: 5000000 },
      },
      emotions: { type: [String], default: [] },
      colors: { type: [String], default: [] },
      excludeFlowers: [{ type: Schema.Types.ObjectId, ref: 'Flower' }],
      notes: { type: String, maxlength: 500 },
    },
    deliveryAddress: {
      recipientName: { type: String, required: true },
      recipientPhone: {
        type: String,
        required: true,
        match: [/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid phone number'],
      },
      street: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },
    nextDeliveryDate: {
      type: Date,
      required: true,
    },
    lastDeliveryDate: Date,
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active',
    },
    pausedAt: Date,
    cancelledAt: Date,
    cancelReason: { type: String, maxlength: 500 },
    totalDeliveries: { type: Number, default: 0, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['vnpay', 'momo', 'zalopay', 'bank_transfer'],
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ shopId: 1, status: 1 });
subscriptionSchema.index({ nextDeliveryDate: 1, status: 1 });
subscriptionSchema.index({ status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
