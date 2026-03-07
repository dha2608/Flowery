import mongoose, { Schema, type Document } from 'mongoose';

export interface IShop extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  phone: string;
  email?: string;
  logo?: {
    url: string;
    publicId: string;
  };
  coverImage?: {
    url: string;
    publicId: string;
  };
  operatingHours: {
    day: number; // 0-6 (Sunday-Saturday)
    open: string; // HH:mm
    close: string; // HH:mm
    isClosed: boolean;
  }[];
  deliveryConfig: {
    maxDistance: number; // km
    baseFee: number;
    freeDeliveryMinOrder: number;
    estimatedTime: string; // e.g., "30-60 phút"
  };
  stats: {
    rating: number;
    totalReviews: number;
    totalOrders: number;
    totalProducts: number;
  };
  businessLicense?: {
    number: string;
    imageUrl: string;
  };
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  isVerified: boolean;
  isActive: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, maxlength: 1000 },
    address: {
      street: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
      match: [/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    logo: {
      url: String,
      publicId: String,
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    operatingHours: [{
      day: { type: Number, min: 0, max: 6 },
      open: { type: String, match: /^\d{2}:\d{2}$/ },
      close: { type: String, match: /^\d{2}:\d{2}$/ },
      isClosed: { type: Boolean, default: false },
    }],
    deliveryConfig: {
      maxDistance: { type: Number, default: 10 },
      baseFee: { type: Number, default: 30000 },
      freeDeliveryMinOrder: { type: Number, default: 500000 },
      estimatedTime: { type: String, default: '60-90 phút' },
    },
    stats: {
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalProducts: { type: Number, default: 0 },
    },
    businessLicense: {
      number: String,
      imageUrl: String,
    },
    bankAccount: {
      bankName: String,
      accountNumber: String,
      accountHolder: String,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verifiedAt: Date,
  },
  { timestamps: true }
);

shopSchema.index({ location: '2dsphere' });
shopSchema.index({ isVerified: 1, isActive: 1 });
shopSchema.index({ 'stats.rating': -1 });
shopSchema.index({ 'address.city': 1, 'address.district': 1 });

export const Shop = mongoose.model<IShop>('Shop', shopSchema);
