import mongoose, { Schema, type Document } from 'mongoose';

export interface IProduct extends Document {
  shopId: mongoose.Types.ObjectId;
  flowerId?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: 'single_flower' | 'bouquet' | 'arrangement' | 'basket' | 'box' | 'subscription_pack' | 'custom';
  flowerComposition: {
    flowerId: mongoose.Types.ObjectId;
    quantity: number;
    color?: string;
  }[];
  images: {
    url: string;
    publicId: string;
    isPrimary: boolean;
  }[];
  customizationOptions: {
    name: string;
    options: {
      label: string;
      priceModifier: number;
    }[];
  }[];
  occasions: string[];
  emotions: string[];
  stock: {
    quantity: number;
    unlimited: boolean;
  };
  isAvailable: boolean;
  totalSold: number;
  averageRating: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    flowerId: {
      type: Schema.Types.ObjectId,
      ref: 'Flower',
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, maxlength: 2000 },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [10000, 'Minimum price is 10,000 VND'],
      max: [50000000, 'Maximum price is 50,000,000 VND'],
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      enum: ['single_flower', 'bouquet', 'arrangement', 'basket', 'box', 'subscription_pack', 'custom'],
      required: true,
    },
    flowerComposition: [{
      flowerId: { type: Schema.Types.ObjectId, ref: 'Flower' },
      quantity: { type: Number, min: 1 },
      color: String,
    }],
    images: [{
      url: { type: String, required: true },
      publicId: String,
      isPrimary: { type: Boolean, default: false },
    }],
    customizationOptions: [{
      name: String,
      options: [{
        label: String,
        priceModifier: { type: Number, default: 0 },
      }],
    }],
    occasions: { type: [String], default: [] },
    emotions: { type: [String], default: [] },
    stock: {
      quantity: { type: Number, default: 0 },
      unlimited: { type: Boolean, default: false },
    },
    isAvailable: { type: Boolean, default: true },
    totalSold: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1, isAvailable: 1 });
productSchema.index({ shopId: 1, slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ occasions: 1 });
productSchema.index({ emotions: 1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ name: 'text', tags: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
