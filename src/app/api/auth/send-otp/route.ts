import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { Otp } from '@/models/Otp';
import { sendOtpEmail } from '@/lib/send-email';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if student exists with this email
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Check if student has a password
    if (!student.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'This account does not have a password set. Please sign up first.' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOtp();

    // Invalidate any previous unverified OTPs for this email
    await Otp.deleteMany({ email, purpose: 'reset-password', verified: false });

    // Store new OTP (expires in 5 minutes)
    await Otp.create({
      email,
      otp,
      purpose: 'reset-password',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Try to send real email via Gmail SMTP
    const emailResult = await sendOtpEmail(email, otp, student.name || undefined);

    if (!emailResult.success && process.env.SMTP_EMAIL) {
      // SMTP configured but failed to send
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email successfully',
      // Only return OTP in development mode (no SMTP configured)
      ...(process.env.SMTP_EMAIL ? {} : { otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
