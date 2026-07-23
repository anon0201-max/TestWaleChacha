import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');

    let student = null;

    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId } });
    }

    // Auto-create guest student if deviceId provided and no existing record
    if (!student && deviceId) {
      student = await db.student.create({
        data: {
          name: 'Guest Student',
          deviceId,
          freeTestsUsed: 0,
        },
      });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: student.id,
      name: student.name,
      email: student.email,
      freeTestsUsed: student.freeTestsUsed,
      freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
      isSubscribed: student.isSubscribed,
    });
  } catch (error) {
    console.error('Student fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, studentId, name, email, phone } = body;

    const whereClause: Record<string, string> = {};
    if (studentId) whereClause.id = studentId;
    else if (deviceId) whereClause.deviceId = deviceId;
    else return NextResponse.json({ error: 'studentId or deviceId required' }, { status: 400 });

    const student = await db.student.upsert({
      where: whereClause as { id?: string; deviceId?: string },
      update: { ...(name ? { name } : {}), ...(email ? { email } : {}), ...(phone ? { phone } : {}) },
      create: {
        name: name || 'Guest Student',
        deviceId: deviceId || undefined,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Student update error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
