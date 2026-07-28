import mongoose from 'mongoose';

const adminPasswordSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AdminPassword || mongoose.model('AdminPassword', adminPasswordSchema);
