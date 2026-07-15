import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  lectureId: mongoose.Schema.Types.ObjectId;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  attendanceMethod: 'qr' | 'location' | 'manual';
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from classroom in meters
  qrCode?: string;
  deviceInfo?: string;
  isEarlyArrival: boolean; // Arrived before class time
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'present',
    },
    attendanceMethod: {
      type: String,
      enum: ['qr', 'location', 'manual'],
      default: 'qr',
    },
    latitude: Number,
    longitude: Number,
    distance: Number,
    qrCode: String,
    deviceInfo: String,
    isEarlyArrival: {
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
attendanceSchema.index({ studentId: 1, date: 1 });
attendanceSchema.index({ courseId: 1, date: 1 });
attendanceSchema.index({ lectureId: 1 });
attendanceSchema.index({ status: 1 });

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', attendanceSchema);
