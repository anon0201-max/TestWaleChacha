import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: 'BookOpen' },
  color: { type: String, default: '#1e40af' },
  examType: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
