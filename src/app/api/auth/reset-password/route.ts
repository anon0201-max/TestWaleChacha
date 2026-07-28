import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find student by email
    const student = await Student.findOne({ email }).lean();

    if (!student) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Hash and update the new password
    const hashedPassword = hashPassword(newPassword);
    await Student.findOneAndUpdate(
      { id: student.id },
      { passwordHash: hashedPassword }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
