import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { Attendance } from '@/models/Attendance';
import { Performance } from '@/models/Performance';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
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

    // Get student
    const student = await Student.findById(payload.userId);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get attendance stats
    const attendanceRecords = await Attendance.find({ studentId: payload.userId });
    const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
    const absentCount = attendanceRecords.filter((a) => a.status === 'absent').length;
    const lateCount = attendanceRecords.filter((a) => a.status === 'late').length;
    const attendancePercentage = attendanceRecords.length > 0 
      ? Math.round((presentCount / attendanceRecords.length) * 100)
      : 0;

    // Get performance data
    const performanceRecords = await Performance.find({ studentId: payload.userId });
    const avgOverallScore = performanceRecords.length > 0
      ? Math.round(performanceRecords.reduce((sum, p) => sum + p.overallScore, 0) / performanceRecords.length)
      : 0;

    return NextResponse.json(
      {
        student: {
          id: student._id,
          indexNumber: student.indexNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          className: student.className,
          email: student.email,
          phone: student.phone,
          profileImage: student.profileImage,
        },
        attendance: {
          total: attendanceRecords.length,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          percentage: attendancePercentage,
        },
        performance: {
          averageScore: avgOverallScore,
          coursesEnrolled: performanceRecords.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
