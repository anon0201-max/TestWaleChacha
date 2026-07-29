import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { Otp } from '@/models/Otp';

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

    // Check if student has a password (can't reset if no password)
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
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // In production, send OTP via email/SMS service (e.g., Resend, Twilio)
    // For now, log the OTP for development and return it
    console.log(`[OTP] Reset password OTP for ${email}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email successfully',
      // In production, remove the `otp` field from response
      // This is only returned for development/testing
      otp, // TODO: Remove in production - send via email/SMS instead
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
