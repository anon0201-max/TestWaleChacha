import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { Otp } from '@/models/Otp';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, newPassword, resetToken } = await request.json();

    if (!email || !newPassword || !resetToken) {
      return NextResponse.json(
        { success: false, message: 'Email, new password, and reset token are required' },
        { status: 400 }
      );
    }

    // Validate reset token — decode and verify the OTP was verified
    let decodedEmail: string;
    let otpId: string;
    try {
      const decoded = Buffer.from(resetToken, 'base64url').toString('utf-8');
      const parts = decoded.split(':');
      decodedEmail = parts[0];
      otpId = parts[1];
      const tokenTime = parseInt(parts[2], 10);

      // Check token is not older than 10 minutes
      if (Date.now() - tokenTime > 10 * 60 * 1000) {
        return NextResponse.json(
          { success: false, message: 'Reset session expired. Please request OTP again.' },
          { status: 401 }
        );
      }

      // Verify email matches
      if (decodedEmail !== email) {
        return NextResponse.json(
          { success: false, message: 'Invalid reset token' },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid reset token' },
        { status: 401 }
      );
    }

    // Verify the OTP record exists and was verified
    const otpRecord = await Otp.findOne({ _id: otpId, email, purpose: 'reset-password', verified: true });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification. Please request OTP again.' },
        { status: 401 }
      );
    }

    // Find the student
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Hash and update password
    const hashedPassword = hashPassword(newPassword);

    await Student.findOneAndUpdate(
      { id: student.id },
      { passwordHash: hashedPassword }
    );

    // Clean up used OTP
    await Otp.deleteMany({ email, purpose: 'reset-password' });

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
