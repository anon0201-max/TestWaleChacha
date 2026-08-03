import mongoose, { Schema } from 'mongoose';

export interface IContactSubmission {
  name: string;
  mobile: string;
  email: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ContactSubmissionSchema.index({ createdAt: -1 });

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;
