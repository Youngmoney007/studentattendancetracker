import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'attendance' | 'performance' | 'announcement' | 'alert' | 'other';
  isRead: boolean;
  readAt?: Date;
  relatedResource?: string;
  relatedResourceId?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['attendance', 'performance', 'announcement', 'alert', 'other'],
      default: 'other',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
    relatedResource: String,
    relatedResourceId: String,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index for auto-deletion after expiry
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
