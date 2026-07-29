import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface IPayment {
  id: string;
  studentId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  status: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    studentId: {
      type: String,
      required: true,
      ref: 'Student',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for querying payments by student
PaymentSchema.index({ studentId: 1, createdAt: -1 });

export const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
