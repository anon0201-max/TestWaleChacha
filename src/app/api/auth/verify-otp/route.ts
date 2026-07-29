import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Otp } from '@/models/Otp';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await Otp.findOne({
      email,
      otp,
      purpose: 'reset-password',
      verified: false,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate a reset token (valid for 10 minutes from now)
    const resetToken = Buffer.from(`${email}:${otpRecord._id}:${Date.now()}`).toString('base64url');

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
