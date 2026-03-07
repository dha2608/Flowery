import mongoose, { Schema, type Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  productIds: mongoose.Types.ObjectId[];
  rating: {
    overall: number;
    quality: number;
    delivery: number;
    packaging: number;
  };
  comment?: string;
  images: {
    url: string;
    publicId: string;
  }[];
  shopReply?: {
    message: string;
    repliedAt: Date;
  };
  isVerifiedPurchase: boolean;
  isVisible: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    productIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    rating: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      quality: { type: Number, required: true, min: 1, max: 5 },
      delivery: { type: Number, required: true, min: 1, max: 5 },
      packaging: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: { type: String, maxlength: 1000 },
    images: [{
      url: { type: String, required: true },
      publicId: String,
    }],
    shopReply: {
      message: { type: String, maxlength: 500 },
      repliedAt: Date,
    },
    isVerifiedPurchase: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ shopId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ shopId: 1, 'rating.overall': -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
