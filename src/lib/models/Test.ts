import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  difficulty: { type: String, default: 'medium' },
  timeLimit: { type: Number, default: 600 },
  totalQuestions: { type: Number, required: true },
  examName: { type: String, default: 'Practice Test' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Test || mongoose.model('Test', testSchema);
