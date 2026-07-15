import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  university: string;
  universityCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  // Lecture settings
  lectureStartTime: string; // "09:00"
  defaultLectureDuration: number; // in minutes
  lateArrivalThreshold: number; // in minutes
  earlyArrivalThreshold: number; // in minutes before lecture start
  // Geofence settings
  defaultGeofenceRadius: number; // in meters
  enableLocationVerification: boolean;
  // QR Code settings
  enableQRCode: boolean;
  qrCodeExpiryTime: number; // in minutes
  // Attendance settings
  minimumAttendancePercentage: number; // e.g., 75
  // Scoring weights
  attendanceWeight: number; // 40
  punctualityWeight: number; // 30
  earlyArrivalWeight: number; // 20
  participationWeight: number; // 10
  // Features
  enableNotifications: boolean;
  enableAutoRanking: boolean;
  enablePerformanceDashboard: boolean;
  // Academic settings
  currentSemester: string;
  currentAcademicYear: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    university: {
      type: String,
      required: true,
      default: 'University Name',
    },
    universityCode: {
      type: String,
      default: '52210',
    },
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
    email: String,
    website: String,
    lectureStartTime: {
      type: String,
      default: '09:00',
    },
    defaultLectureDuration: {
      type: Number,
      default: 120,
    },
    lateArrivalThreshold: {
      type: Number,
      default: 15, // 15 minutes
    },
    earlyArrivalThreshold: {
      type: Number,
      default: 5, // 5 minutes before
    },
    defaultGeofenceRadius: {
      type: Number,
      default: 500, // meters
    },
    enableLocationVerification: {
      type: Boolean,
      default: true,
    },
    enableQRCode: {
      type: Boolean,
      default: true,
    },
    qrCodeExpiryTime: {
      type: Number,
      default: 60, // minutes
    },
    minimumAttendancePercentage: {
      type: Number,
      default: 75,
    },
    attendanceWeight: {
      type: Number,
      default: 40,
    },
    punctualityWeight: {
      type: Number,
      default: 30,
    },
    earlyArrivalWeight: {
      type: Number,
      default: 20,
    },
    participationWeight: {
      type: Number,
      default: 10,
    },
    enableNotifications: {
      type: Boolean,
      default: true,
    },
    enableAutoRanking: {
      type: Boolean,
      default: true,
    },
    enablePerformanceDashboard: {
      type: Boolean,
      default: true,
    },
    currentSemester: {
      type: String,
      default: 'Fall 2024',
    },
    currentAcademicYear: {
      type: String,
      default: '2024-2025',
    },
    semesterStartDate: Date,
    semesterEndDate: Date,
  },
  {
    timestamps: true,
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
