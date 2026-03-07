import mongoose, { Schema, type Document } from 'mongoose';

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  label?: string;
  recipientName?: string;
  phone?: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role: 'user' | 'shop_owner' | 'admin';
  avatar?: {
    url: string;
    publicId: string;
  };
  addresses: IAddress[];
  preferences: {
    // Legacy field names (kept for backward compat)
    favoriteColors: string[];
    favoriteEmotions: string[];
    // Canonical field names
    colors: string[];
    emotions: string[];
    budget: {
      min: number;
      max: number;
    };
    favoriteFlowers: string[];
    occasions: string[];
    allergies: string[];
  };
  refreshTokens: string[];
  authProviders: {
    provider: 'google' | 'facebook';
    providerId: string;
  }[];
  // Email verification fields (select: false — never returned by default)
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  // Password reset fields (select: false — never returned in queries by default)
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  // Account lockout fields (select: false — never returned in queries by default)
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, trim: true, maxlength: [50, 'Label must be at most 50 characters'] },
    recipientName: {
      type: String,
      trim: true,
      minlength: [2, 'Recipient name must be at least 2 characters'],
      maxlength: [100, 'Recipient name must be at most 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number'],
    },
    street: { type: String, required: [true, 'Street is required'], trim: true },
    ward: { type: String, required: [true, 'Ward is required'], trim: true },
    district: { type: String, required: [true, 'District is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid Vietnamese phone number'],
    },
    role: {
      type: String,
      enum: ['user', 'shop_owner', 'admin'],
      default: 'user',
    },
    avatar: {
      url: String,
      publicId: String,
    },
    addresses: { type: [addressSchema], default: [] },
    preferences: {
      favoriteColors: { type: [String], default: [] },
      favoriteEmotions: { type: [String], default: [] },
      colors: { type: [String], default: [] },
      emotions: { type: [String], default: [] },
      budget: {
        min: { type: Number, default: 100000 },
        max: { type: Number, default: 1000000 },
      },
      favoriteFlowers: { type: [String], default: [] },
      occasions: { type: [String], default: [] },
      allergies: { type: [String], default: [] },
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    authProviders: [
      {
        provider: { type: String, enum: ['google', 'facebook'] },
        providerId: String,
      },
    ],
    emailVerified: { type: Boolean, default: false },
    // Email verification — excluded from all queries unless explicitly selected
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    // Password reset — excluded from all queries unless explicitly selected
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // Account lockout — excluded from all queries unless explicitly selected
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.loginAttempts;
        delete ret.lockUntil;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ phone: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
