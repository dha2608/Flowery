import mongoose, { Schema, type Document } from 'mongoose';

export interface IOTP extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: 'login' | 'phone_verify' | 'email_verify' | 'password_reset' | 'transaction';
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['login', 'phone_verify', 'email_verify', 'password_reset', 'transaction'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookup
OTPSchema.index({ userId: 1, type: 1, verified: 1 });

// TTL index to auto-delete expired OTPs after 1 hour
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

// Static method to generate OTP
OTPSchema.statics.generateOTP = function (length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Static method to create and save OTP
OTPSchema.statics.createOTP = async function (
  userId: mongoose.Types.ObjectId,
  type: IOTP['type'],
  expiresInMinutes = 5,
  metadata?: Record<string, unknown>
): Promise<IOTP> {
  // Invalidate any existing OTPs of same type for this user
  await this.updateMany({ userId, type, verified: false }, { $set: { expiresAt: new Date() } });

  const code = (this as any).generateOTP(6);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return this.create({
    userId,
    code,
    type,
    expiresAt,
    metadata,
  });
};

// Static method to verify OTP
OTPSchema.statics.verifyOTP = async function (
  userId: mongoose.Types.ObjectId,
  code: string,
  type: IOTP['type']
): Promise<{ success: boolean; message: string; otp?: IOTP }> {
  const otp = await this.findOne({
    userId,
    type,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    return { success: false, message: 'OTP không tồn tại hoặc đã hết hạn' };
  }

  // Check max attempts (5)
  if (otp.attempts >= 5) {
    otp.expiresAt = new Date(); // Invalidate
    await otp.save();
    return { success: false, message: 'Quá nhiều lần thử. Vui lòng yêu cầu OTP mới' };
  }

  // Increment attempts
  otp.attempts += 1;

  if (otp.code !== code) {
    await otp.save();
    return { success: false, message: `Mã OTP không đúng. Còn ${5 - otp.attempts} lần thử` };
  }

  // Success - mark as verified
  otp.verified = true;
  await otp.save();

  return { success: true, message: 'Xác thực thành công', otp };
};

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);
