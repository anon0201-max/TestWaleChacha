import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password, deviceId } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find student by email
    const student = await db.student.findFirst({ where: { email } });

    if (!student || !student.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const inputHash = hashPassword(password);
    if (inputHash !== student.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Link deviceId if provided (for continuity)
    if (deviceId && !student.deviceId) {
      try {
        await db.student.update({
          where: { id: student.id },
          data: { deviceId },
        });
      } catch {
        // deviceId already taken by another student, ignore
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        freeTestsUsed: student.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
        isSubscribed: student.isSubscribed,
        subscriptionAt: student.subscriptionAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
