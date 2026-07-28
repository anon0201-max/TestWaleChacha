import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Payment, Student } from '@/models';

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

    let resolvedStudentId = studentId;

    if (!resolvedStudentId && deviceId) {
      const student = await Student.findOne({ deviceId }).lean();
      if (!student) {
        return NextResponse.json(
          { success: false, message: 'Student not found' },
          { status: 404 }
        );
      }
      resolvedStudentId = student.id;
    }

    const payments = await Payment.find({ studentId: resolvedStudentId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
