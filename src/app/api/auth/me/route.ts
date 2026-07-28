import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');

    if (!studentId && !email) {
      return NextResponse.json(
        { success: false, message: 'studentId or email is required' },
        { status: 400 }
      );
    }

    let student;

    if (studentId) {
      student = await Student.findOne({ id: studentId });
    } else if (email) {
      student = await Student.findOne({ email });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
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
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
        isSubscribed: student.isSubscribed,
        subscriptionAt: student.subscriptionAt,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error('Fetch student error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
