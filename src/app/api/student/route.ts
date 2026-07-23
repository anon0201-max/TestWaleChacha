import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    let student = await db.student.findUnique({
      where: { deviceId },
    });

    // Auto-create if doesn't exist
    if (!student) {
      student = await db.student.create({
        data: {
          name: 'Guest Student',
          deviceId,
          freeTestsUsed: 0,
        },
      });
    }

    return NextResponse.json({
      id: student.id,
      freeTestsUsed: student.freeTestsUsed,
      freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
      isSubscribed: student.isSubscribed,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, name } = body;

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    const student = await db.student.upsert({
      where: { deviceId },
      update: { ...(name ? { name } : {}) },
      create: {
        name: name || 'Guest Student',
        deviceId,
      },
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
