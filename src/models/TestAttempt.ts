import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface ITestAttempt {
  id: string;
  studentId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestAttemptSchema = new Schema<ITestAttempt>(
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
    testId: {
      type: String,
      required: true,
      ref: 'Test',
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    answers: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
TestAttemptSchema.index({ studentId: 1, createdAt: -1 });
TestAttemptSchema.index({ studentId: 1, testId: 1 });

export const TestAttempt =
  mongoose.models.TestAttempt ||
  mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);

export default TestAttempt;
