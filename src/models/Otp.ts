import mongoose, { Schema } from 'mongoose';

export interface IOtp {
  email: string;
  otp: string;
  purpose: 'reset-password';
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['reset-password'],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    id: false,
    versionKey: false,
    timestamps: true,
  }
);

// Auto-expire old OTPs (TTL index)
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp =
  mongoose.models.Otp ||
  mongoose.model<IOtp>('Otp', OtpSchema);

export default Otp;
