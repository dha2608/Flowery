import mongoose, { Schema, type Document } from 'mongoose';

export interface IRelationship extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'family' | 'friend' | 'lover' | 'colleague' | 'other';
  birthday?: Date;
  importantDates: {
    title: string;
    date: Date;
    isRecurring: boolean;
  }[];
  flowerPreferences: {
    favoriteColors: string[];
    favoriteFlowers: mongoose.Types.ObjectId[];
    dislikedFlowers: mongoose.Types.ObjectId[];
    allergies: string[];
  };
  notes?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const relationshipSchema = new Schema<IRelationship>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ['family', 'friend', 'lover', 'colleague', 'other'],
      required: true,
    },
    birthday: Date,
    importantDates: [
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        isRecurring: { type: Boolean, default: true },
      },
    ],
    flowerPreferences: {
      favoriteColors: { type: [String], default: [] },
      favoriteFlowers: [{ type: Schema.Types.ObjectId, ref: 'Flower' }],
      dislikedFlowers: [{ type: Schema.Types.ObjectId, ref: 'Flower' }],
      allergies: { type: [String], default: [] },
    },
    notes: { type: String, maxlength: 500 },
    avatar: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
);

relationshipSchema.index({ userId: 1, type: 1 });
relationshipSchema.index({ userId: 1, name: 'text' });

export const Relationship = mongoose.model<IRelationship>('Relationship', relationshipSchema);
