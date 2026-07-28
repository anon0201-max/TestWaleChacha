import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { stripMongoFields } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');

    if (!deviceId && !studentId) {
      return NextResponse.json(
        { success: false, message: 'deviceId or studentId is required' },
        { status: 400 }
      );
    }

    let student;

    if (studentId) {
      student = await Student.findOne({ id: studentId }).lean();
    } else if (deviceId) {
      // Use findOneAndUpdate with upsert to prevent race condition:
      // two simultaneous requests for the same deviceId won't both create
      // duplicate documents because the unique index on deviceId will
      // cause the second upsert to fail, at which point we fall back to a find.
      student = await Student.findOneAndUpdate(
        { deviceId },
        {
          $setOnInsert: { name: 'Guest User', deviceId },
        },
        { returnDocument: 'after', upsert: true, lean: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...stripMongoFields(student),
        freeTestsRemaining: Math.max(0, 5 - student!.freeTestsUsed),
      },
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, deviceId, name, email, phone } = body;

    if (!studentId && !deviceId) {
      return NextResponse.json(
        { success: false, message: 'studentId or deviceId is required' },
        { status: 400 }
      );
    }

    const whereClause = studentId ? { id: studentId } : { deviceId };

    const updateData: Record<string, string | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const student = await Student.findOneAndUpdate(
      whereClause,
      { $set: updateData },
      { returnDocument: 'after' }
    ).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...stripMongoFields(student),
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
      },
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update student' },
      { status: 500 }
    );
  }
}
