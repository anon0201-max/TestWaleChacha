import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface IAdminPassword {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminPasswordSchema = new Schema<IAdminPassword>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const AdminPassword =
  mongoose.models.AdminPassword ||
  mongoose.model<IAdminPassword>('AdminPassword', AdminPasswordSchema);

export default AdminPassword;
