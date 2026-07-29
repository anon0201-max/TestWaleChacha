import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  question: { type: String, required: true },
  questionImage: { type: String },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctOption: { type: String, required: true },
  explanation: { type: String },
  order: { type: Number, default: 0 },
  negativeMark: { type: Number, default: 0 },
  section: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
