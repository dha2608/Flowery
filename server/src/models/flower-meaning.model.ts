import mongoose, { Schema, type Document } from 'mongoose';

export interface IFlowerMeaning extends Document {
  flowerId: mongoose.Types.ObjectId;
  emotion: 'romantic' | 'grateful' | 'joyful' | 'sympathetic' | 'respectful' | 'apologetic' | 'celebratory' | 'mourning' | 'friendly' | 'passionate';
  occasion: 'birthday' | 'anniversary' | 'valentines' | 'mothers_day' | 'womens_day' | 'tet' | 'graduation' | 'wedding' | 'funeral' | 'get_well' | 'custom';
  relationship: 'parent' | 'child' | 'sibling' | 'partner' | 'spouse' | 'friend' | 'colleague' | 'teacher' | 'boss' | 'other';
  culturalContext: 'vietnam' | 'general' | 'western';
  description?: {
    vi: string;
    en: string;
  };
  aiWeight: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const flowerMeaningSchema = new Schema<IFlowerMeaning>(
  {
    flowerId: {
      type: Schema.Types.ObjectId,
      ref: 'Flower',
      required: true,
    },
    emotion: {
      type: String,
      enum: ['romantic', 'grateful', 'joyful', 'sympathetic', 'respectful', 'apologetic', 'celebratory', 'mourning', 'friendly', 'passionate'],
      required: true,
    },
    occasion: {
      type: String,
      enum: ['birthday', 'anniversary', 'valentines', 'mothers_day', 'womens_day', 'tet', 'graduation', 'wedding', 'funeral', 'get_well', 'custom'],
      required: true,
    },
    relationship: {
      type: String,
      enum: ['parent', 'child', 'sibling', 'partner', 'spouse', 'friend', 'colleague', 'teacher', 'boss', 'other'],
      required: true,
    },
    culturalContext: {
      type: String,
      enum: ['vietnam', 'general', 'western'],
      default: 'vietnam',
    },
    description: {
      vi: String,
      en: String,
    },
    aiWeight: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 10,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

flowerMeaningSchema.index({ flowerId: 1, emotion: 1, occasion: 1 });
flowerMeaningSchema.index({ emotion: 1, culturalContext: 1 });
flowerMeaningSchema.index({ occasion: 1, relationship: 1 });
flowerMeaningSchema.index({ aiWeight: -1 });

export const FlowerMeaning = mongoose.model<IFlowerMeaning>('FlowerMeaning', flowerMeaningSchema);
