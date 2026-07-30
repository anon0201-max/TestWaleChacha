import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/mongodb';
import { FREE_TEST_LIMIT } from '@/lib/api-utils';
import { Student } from '@/models';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password, deviceId } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password);

    if (student.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update deviceId if different (non-critical — don't fail login if this fails)
    if (deviceId && student.deviceId !== deviceId) {
      try {
        // Remove any existing record with the new deviceId to avoid duplicate key
        const existingWithDevice = await Student.findOne({ deviceId });
        if (existingWithDevice && existingWithDevice.id !== student.id) {
          // Transfer free test usage from the other record
          if (existingWithDevice.freeTestsUsed > student.freeTestsUsed) {
            await Student.findOneAndUpdate(
              { id: student.id },
              { freeTestsUsed: existingWithDevice.freeTestsUsed }
            );
          }
          await Student.deleteOne({ id: existingWithDevice.id });
        }
        await Student.findOneAndUpdate({ id: student.id }, { deviceId });
        student.deviceId = deviceId;
      } catch (deviceError) {
        // Don't fail login — just log and continue
        console.error('DeviceId update failed (non-critical):', deviceError);
      }
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
        freeTestsRemaining: Math.max(0, FREE_TEST_LIMIT - student.freeTestsUsed),
        isSubscribed: student.isSubscribed,
        subscriptionAt: student.subscriptionAt,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
