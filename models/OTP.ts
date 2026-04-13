import mongoose, { Schema } from 'mongoose';

export interface IOTP extends mongoose.Document {
  mobileNumber: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  mobileNumber: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) },
  createdAt: { type: Date, default: Date.now },
});

// Auto‑delete expired OTPs (TTL index)
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);