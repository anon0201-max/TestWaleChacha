import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface ITest {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  timeLimit: number;
  totalQuestions: number;
  examName: string;
  icon: string;
  isLocked: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
      ref: 'Category',
    },
    difficulty: {
      type: String,
      default: 'medium',
    },
    timeLimit: {
      type: Number,
      default: 600,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    examName: {
      type: String,
      default: 'Practice Test',
    },
    icon: {
      type: String,
      default: '',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    id: false,
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TestSchema.index({ id: 1 }, { unique: true });
TestSchema.index({ categoryId: 1 });
TestSchema.index({ isActive: 1, createdAt: -1 });

export const Test =
  mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

Test.syncIndexes();

export default Test;
