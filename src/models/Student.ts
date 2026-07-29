import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface IStudent {
  id: string;
  name: string;
  email?: string;
  passwordHash?: string;
  phone?: string;
  deviceId?: string;
  freeTestsUsed: number;
  isSubscribed: boolean;
  subscriptionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
    },
    phone: {
      type: String,
    },
    deviceId: {
      type: String,
      unique: true,
      sparse: true,
    },
    freeTestsUsed: {
      type: Number,
      default: 0,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionAt: {
      type: Date,
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

StudentSchema.index({ id: 1 }, { unique: true });

export const Student =
  mongoose.models.Student ||
  mongoose.model<IStudent>('Student', StudentSchema);

Student.syncIndexes();

export default Student;
