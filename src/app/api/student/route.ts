import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');

    let student = null;

    if (studentId) {
      student = await Student.findOne({ id: studentId }).lean();
    } else if (deviceId) {
      student = await Student.findOne({ deviceId }).lean();
    }

    // Auto-create guest student if deviceId provided and no existing record
    if (!student && deviceId) {
      student = await Student.create({
        name: 'Guest Student',
        deviceId,
        freeTestsUsed: 0,
      });
      student = student.toObject();
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
    await dbConnect();

    const body = await request.json();
    const { deviceId, studentId, name, email, phone } = body;

    let filter: Record<string, string> = {};
    if (studentId) filter.id = studentId;
    else if (deviceId) filter.deviceId = deviceId;
    else return NextResponse.json({ error: 'studentId or deviceId required' }, { status: 400 });

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    const existing = await Student.findOne(filter);
    let student;

    if (existing) {
      student = await Student.findOneAndUpdate(filter, updateData, { new: true }).lean();
    } else {
      student = await Student.create({
        name: name || 'Guest Student',
        deviceId: deviceId || undefined,
        ...updateData,
      });
      student = student.toObject();
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Student update error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
