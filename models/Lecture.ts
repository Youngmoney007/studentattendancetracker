import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILecture extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  lectureDate: Date;
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  expectedStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  qrCode?: string;
  geofenceLatitude?: number;
  geofenceLogitude?: number;
  geofenceRadius: number; // in meters
  isActive: boolean;
  attendanceClosed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectureDate: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    expectedStudents: {
      type: Number,
      default: 0,
    },
    presentStudents: {
      type: Number,
      default: 0,
    },
    absentStudents: {
      type: Number,
      default: 0,
    },
    lateStudents: {
      type: Number,
      default: 0,
    },
    qrCode: String,
    geofenceLatitude: Number,
    geofenceLogitude: Number,
    geofenceRadius: {
      type: Number,
      default: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attendanceClosed: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
lectureSchema.index({ courseId: 1, lectureDate: 1 });
lectureSchema.index({ lectureDate: 1 });
lectureSchema.index({ isActive: 1 });

export const Lecture: Model<ILecture> =
  mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', lectureSchema);
