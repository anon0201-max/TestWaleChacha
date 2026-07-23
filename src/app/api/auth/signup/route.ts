import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_quizmaster_salt').digest('hex');
}

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, deviceId } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existingByEmail = await db.student.findFirst({ where: { email } });
    if (existingByEmail) {
      return NextResponse.json({ error: 'Email already registered. Please login.' }, { status: 409 });
    }

    // Check if deviceId already exists (guest student) — upgrade it
    const existingByDevice = deviceId ? await db.student.findFirst({ where: { deviceId } }) : null;

    let student;

    if (existingByDevice) {
      // Upgrade existing guest student to registered account
      student = await db.student.update({
        where: { id: existingByDevice.id },
        data: {
          name,
          email,
          passwordHash: hashPassword(password),
          phone: phone || null,
        },
      });
    } else {
      // Create new student with auth
      student = await db.student.create({
        data: {
          name,
          email,
          passwordHash: hashPassword(password),
          phone: phone || null,
          deviceId: deviceId || null,
          freeTestsUsed: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        freeTestsUsed: student.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
        isSubscribed: student.isSubscribed,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
