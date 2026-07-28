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

    const { name, email, password, phone, deviceId } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existingByEmail = await Student.findOne({ email }).lean();
    if (existingByEmail) {
      return NextResponse.json({ error: 'Email already registered. Please login.' }, { status: 409 });
    }

    // Check if deviceId already exists (guest student) — upgrade it
    const existingByDevice = deviceId ? await Student.findOne({ deviceId }).lean() : null;

    let student;

    if (existingByDevice) {
      // Upgrade existing guest student to registered account
      student = await Student.findOneAndUpdate(
        { id: existingByDevice.id },
        {
          name,
          email,
          passwordHash: hashPassword(password),
          phone: phone || null,
        },
        { new: true }
      ).lean();
    } else {
      // Create new student with auth
      student = await Student.create({
        name,
        email,
        passwordHash: hashPassword(password),
        phone: phone || null,
        deviceId: deviceId || null,
        freeTestsUsed: 0,
      });
      student = student.toObject();
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
