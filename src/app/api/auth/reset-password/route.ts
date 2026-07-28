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

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    const hashedPassword = hashPassword(newPassword);

    await Student.findOneAndUpdate(
      { id: student.id },
      { passwordHash: hashedPassword }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
