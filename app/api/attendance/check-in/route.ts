import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lecture } from '@/models/Lecture';
import { Attendance } from '@/models/Attendance';
import { Course } from '@/models/Course';
import { isWithinGeofence } from '@/lib/geofence';
import { verifyAccessToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lectureId, latitude, longitude, qrCode } = body;

    // Get lecture
    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
    }

    if (!lecture.isActive) {
      return NextResponse.json(
        { error: 'Attendance for this lecture is not active' },
        { status: 400 }
      );
    }

    // Check if student already marked attendance
    const existingAttendance = await Attendance.findOne({
      lectureId,
      studentId: payload.userId,
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'You have already marked attendance for this lecture' },
        { status: 400 }
      );
    }

    // Determine attendance method and validate
    let attendanceMethod = 'manual';
    let isValid = false;

    if (qrCode) {
      // QR code validation
      attendanceMethod = 'qr';
      isValid = qrCode === lecture.qrCode;
    } else if (latitude && longitude) {
      // Location verification
      attendanceMethod = 'location';
      isValid = isWithinGeofence(
        latitude,
        longitude,
        lecture.geofenceLatitude || 0,
        lecture.geofenceLogitude || 0,
        lecture.geofenceRadius
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Attendance validation failed. Please try again.' },
        { status: 400 }
      );
    }

    // Determine if early arrival
    const now = new Date();
    const [lectureSameDay] = lecture.startTime.split(':');
    const lectureStartHour = parseInt(lectureSameDay);
    const isEarlyArrival = now.getHours() < lectureStartHour;

    // Determine status
    let status = 'present';
    const lateThreshold = 15; // 15 minutes
    const lectureTime = new Date(`${lecture.lectureDate.toDateString()} ${lecture.startTime}`);
    if (now.getTime() - lectureTime.getTime() > lateThreshold * 60 * 1000) {
      status = 'late';
    }

    // Create attendance record
    const attendance = new Attendance({
      studentId: payload.userId,
      courseId: lecture.courseId,
      lectureId: lecture._id,
      date: lecture.lectureDate,
      checkInTime: now,
      status,
      attendanceMethod,
      latitude,
      longitude,
      qrCode,
      isEarlyArrival,
    });

    await attendance.save();

    // Update lecture stats
    lecture.presentStudents = (lecture.presentStudents || 0) + (status === 'present' ? 1 : 0);
    lecture.lateStudents = (lecture.lateStudents || 0) + (status === 'late' ? 1 : 0);
    await lecture.save();

    return NextResponse.json(
      {
        success: true,
        message: `Attendance marked as ${status}`,
        attendance: {
          id: attendance._id,
          status,
          checkInTime: attendance.checkInTime,
          isEarlyArrival,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
