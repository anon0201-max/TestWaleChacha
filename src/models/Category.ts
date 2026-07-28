import mongoose, { Schema } from 'mongoose';

function generateShortId(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 24);
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  examType: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: {
      type: String,
      default: generateShortId,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    color: {
      type: String,
      default: '#1e40af',
    },
    examType: {
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

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
