import mongoose, { Schema, type Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  customizations?: {
    name: string;
    selected: string;
    priceModifier: number;
  }[];
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled' | 'refunded';
  deliveryAddress: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    notes?: string;
  };
  deliveryDate: Date;
  deliveryTimeSlot?: string;
  giftMessage?: string;
  isAnonymous: boolean;
  paymentMethod: 'cod' | 'vnpay' | 'momo' | 'zalopay' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: {
    transactionId: string;
    paidAt: Date;
  };
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  cancelReason?: string;
  cancelledBy?: 'user' | 'shop' | 'system';
  refundAmount?: number;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
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
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
      customizations: [{
        name: String,
        selected: String,
        priceModifier: { type: Number, default: 0 },
      }],
      subtotal: { type: Number, required: true, min: 0 },
    }],
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      deliveryFee: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      couponCode: String,
      totalAmount: { type: Number, required: true, min: 0 },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
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
      notes: String,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    deliveryTimeSlot: String,
    giftMessage: { type: String, maxlength: 500 },
    isAnonymous: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ['cod', 'vnpay', 'momo', 'zalopay', 'bank_transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
    },
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    cancelReason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'shop', 'system'],
    },
    refundAmount: { type: Number, min: 0 },
    refundedAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ shopId: 1, status: 1 });
orderSchema.index({ shopId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ paymentStatus: 1 });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const prefix = `BS${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
