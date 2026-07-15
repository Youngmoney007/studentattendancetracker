import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { hashPassword } from '@/lib/bcrypt';
import { StudentRegisterSchema, formatValidationError } from '@/lib/validation';
import { getClassNameFromIndex } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = StudentRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationError(validation.error) },
        { status: 400 }
      );
    }

    const { indexNumber, firstName, lastName, phone, password } = validation.data;

    // Check if student already exists
    const existingStudent = await Student.findOne({ indexNumber });
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this index number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get class name from index number
    const className = getClassNameFromIndex(indexNumber);
    const classId = className.split(' ')[1]; // Extract "A", "B", etc.

    // Create student
    const student = new Student({
      indexNumber,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      className,
      classId,
      role: 'student',
      isVerified: true,
      isActive: true,
    });

    await student.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. You can now login.',
        student: {
          id: student._id,
          indexNumber: student.indexNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          className: student.className,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
