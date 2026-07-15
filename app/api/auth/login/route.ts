import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { hashPassword, comparePasswords } from '@/lib/bcrypt';
import { StudentLoginSchema, formatValidationError } from '@/lib/validation';
import { checkRateLimit } from '@/lib/security';
import { AuditLog } from '@/models/AuditLog';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = StudentLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationError(validation.error) },
        { status: 400 }
      );
    }

    const { indexNumber, password } = validation.data;

    // Rate limiting
    if (!checkRateLimit(`login-${indexNumber}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Find student
    const student = await Student.findOne({ indexNumber }).select('+password');
    if (!student) {
      return NextResponse.json(
        { error: 'Invalid index number or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!student.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, student.password);
    if (!isPasswordValid) {
      // Log failed attempt
      await AuditLog.create({
        userId: student._id,
        userEmail: student.email,
        action: 'LOGIN_FAILED',
        resource: 'Student',
        status: 'failure',
        errorMessage: 'Invalid password',
      });

      return NextResponse.json(
        { error: 'Invalid index number or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: student._id.toString(),
      indexNumber: student.indexNumber,
      role: student.role,
    });

    const refreshToken = generateRefreshToken({
      userId: student._id.toString(),
      indexNumber: student.indexNumber,
      role: student.role,
    });

    // Update last login
    student.lastLogin = new Date();
    await student.save();

    // Log successful login
    await AuditLog.create({
      userId: student._id,
      userEmail: student.email,
      action: 'LOGIN_SUCCESS',
      resource: 'Student',
      status: 'success',
    });

    // Set cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: student._id,
          indexNumber: student.indexNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          className: student.className,
          role: student.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
