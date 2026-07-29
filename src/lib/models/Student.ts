import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  phone: { type: String },
  deviceId: { type: String, unique: true, sparse: true },
  freeTestsUsed: { type: Number, default: 0 },
  isSubscribed: { type: Boolean, default: false },
  subscriptionAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
