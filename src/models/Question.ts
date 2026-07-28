import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface IQuestion {
  id: string;
  testId: string;
  question: string;
  questionImage?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  order: number;
  negativeMark: number;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    testId: {
      type: String,
      required: true,
      ref: 'Test',
    },
    question: {
      type: String,
      required: true,
    },
    questionImage: {
      type: String,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    correctOption: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    negativeMark: {
      type: Number,
      default: 0,
    },
    section: {
      type: String,
      default: 'General',
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for querying questions by test
QuestionSchema.index({ testId: 1, order: 1 });

export const Question =
  mongoose.models.Question ||
  mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
