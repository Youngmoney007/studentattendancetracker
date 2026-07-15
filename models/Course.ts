import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  courseCode: string; // e.g., "CS101"
  courseName: string; // e.g., "Introduction to Computer Science"
  lecturer: mongoose.Schema.Types.ObjectId;
  teachingAssistants: mongoose.Schema.Types.ObjectId[];
  classes: string[]; // Classes this course is taught to (e.g., ["A", "B", "C"])
  creditHours: number;
  semester: string; // e.g., "Fall 2024"
  academicYear: string; // e.g., "2024-2025"
  schedule: {
    day: string; // "Monday", "Tuesday", etc.
    startTime: string; // "09:00"
    endTime: string; // "11:00"
  }[];
  classroom?: string; // e.g., "Building A, Room 101"
  geofenceLatitude?: number;
  geofenceLogitude?: number;
  geofenceRadius: number; // in meters, default 500
  totalLectures: number;
  totalAttendanceMarks: number; // Points contributed to final grade
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    teachingAssistants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    classes: {
      type: [String],
      default: [],
    },
    creditHours: {
      type: Number,
      default: 3,
    },
    semester: {
      type: String,
      default: '',
    },
    academicYear: {
      type: String,
      default: '',
    },
    schedule: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    classroom: String,
    geofenceLatitude: Number,
    geofenceLogitude: Number,
    geofenceRadius: {
      type: Number,
      default: 500,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    totalAttendanceMarks: {
      type: Number,
      default: 10,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ lecturer: 1 });
courseSchema.index({ classes: 1 });
courseSchema.index({ semester: 1, academicYear: 1 });

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
