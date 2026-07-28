import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  currency: { type: String, default: 'INR' },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
