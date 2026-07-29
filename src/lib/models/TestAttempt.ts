import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  answers: { type: String },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.TestAttempt || mongoose.model('TestAttempt', testAttemptSchema);
