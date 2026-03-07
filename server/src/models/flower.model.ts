import mongoose, { Schema, type Document } from 'mongoose';

export interface IFlower extends Document {
  name: {
    vi: string;
    en: string;
  };
  scientificName?: string;
  slug: string;
  description: {
    vi: string;
    en: string;
  };
  meanings: string[];
  colors: string[];
  seasons: ('spring' | 'summer' | 'autumn' | 'winter' | 'all_year')[];
  images: {
    url: string;
    publicId: string;
    isPrimary: boolean;
  }[];
  careInstructions?: {
    vi: string;
    en: string;
  };
  culturalSignificance?: {
    vi: string;
    en: string;
  };
  popularityScore: number;
  isAvailable: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const flowerSchema = new Schema<IFlower>(
  {
    name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    scientificName: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    meanings: { type: [String], default: [] },
    colors: { type: [String], required: true },
    seasons: {
      type: [String],
      enum: ['spring', 'summer', 'autumn', 'winter', 'all_year'],
      default: ['all_year'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    careInstructions: {
      vi: String,
      en: String,
    },
    culturalSignificance: {
      vi: String,
      en: String,
    },
    popularityScore: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

flowerSchema.index({ 'name.vi': 'text', 'name.en': 'text', tags: 'text' });
flowerSchema.index({ colors: 1 });
flowerSchema.index({ seasons: 1 });
flowerSchema.index({ popularityScore: -1 });
flowerSchema.index({ isAvailable: 1 });

export const Flower = mongoose.model<IFlower>('Flower', flowerSchema);
