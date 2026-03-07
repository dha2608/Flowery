import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFlowerMark extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  orderId?: Types.ObjectId;
  displayName: string;
  message: string;
  flowerEmoji: string; // Emoji đại diện cho loại hoa: 🌹🌷🌻🌸💐
  isAnonymous: boolean;
  position: {
    x: number; // 0-100 (percentage)
    y: number; // 0-100 (percentage)
  };
  color: string; // Màu nền của mark
  isApproved: boolean; // Cần duyệt trước khi hiển thị
  createdAt: Date;
  updatedAt: Date;
}

const FlowerMarkSchema = new Schema<IFlowerMark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    flowerEmoji: {
      type: String,
      required: true,
      default: '🌸',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    position: {
      x: { type: Number, required: true, min: 5, max: 95 },
      y: { type: Number, required: true, min: 5, max: 95 },
    },
    color: {
      type: String,
      default: '#fce7f3', // pink-100
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve for now
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
FlowerMarkSchema.index({ isApproved: 1, createdAt: -1 });
FlowerMarkSchema.index({ userId: 1 });

export const FlowerMark = mongoose.model<IFlowerMark>('FlowerMark', FlowerMarkSchema);
