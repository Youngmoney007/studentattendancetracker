import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPerformance extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  semester: string;
  academicYear: string;
  // Attendance metrics
  totalLectures: number;
  attendedLectures: number;
  attendancePercentage: number; // 0-100
  // Punctuality metrics
  lateArrivals: number;
  punctualityScore: number; // 0-100 (30% weight)
  // Early arrival bonus
  earlyArrivals: number;
  earlyArrivalBonus: number; // 0-100 (20% weight)
  // Participation (can be updated by lecturer)
  participationScore: number; // 0-100 (10% weight)
  // Overall score
  overallScore: number; // Weighted: Attendance(40%) + Punctuality(30%) + Early Arrival(20%) + Participation(10%)
  gradeContribution: number; // Points contributed to final grade
  rank?: number; // Rank in class
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const performanceSchema = new Schema<IPerformance>(
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
    semester: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    attendedLectures: {
      type: Number,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lateArrivals: {
      type: Number,
      default: 0,
    },
    punctualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    earlyArrivals: {
      type: Number,
      default: 0,
    },
    earlyArrivalBonus: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    participationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    gradeContribution: {
      type: Number,
      default: 0,
    },
    rank: Number,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
performanceSchema.index({ studentId: 1, courseId: 1 });
performanceSchema.index({ semester: 1, academicYear: 1 });
performanceSchema.index({ overallScore: -1 }); // For rankings

export const Performance: Model<IPerformance> =
  mongoose.models.Performance || mongoose.model<IPerformance>('Performance', performanceSchema);
