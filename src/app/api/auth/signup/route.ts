import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, deviceId } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    let student;

    if (deviceId) {
      const guestStudent = await Student.findOne({ deviceId });

      if (guestStudent) {
        const hashedPassword = hashPassword(password);
        student = await Student.findOneAndUpdate(
          { id: guestStudent.id },
          {
            name,
            email,
            passwordHash: hashedPassword,
          },
          { new: true }
        );
      }
    }

    if (!student) {
      const hashedPassword = hashPassword(password);
      student = await Student.create({
        name,
        email,
        passwordHash: hashedPassword,
        deviceId: deviceId || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        deviceId: student.deviceId,
        freeTestsUsed: student.freeTestsUsed,
        isSubscribed: student.isSubscribed,
        subscriptionAt: student.subscriptionAt,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
