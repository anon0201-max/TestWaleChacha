import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');

    if (!deviceId && !studentId) {
      return NextResponse.json(
        { success: false, message: 'deviceId or studentId is required' },
        { status: 400 }
      );
    }

    const whereClause: Record<string, string> = {};
    if (studentId) {
      whereClause.studentId = studentId;
    } else if (deviceId) {
      const student = await db.student.findUnique({ where: { deviceId } });
      if (!student) {
        return NextResponse.json(
          { success: false, message: 'Student not found' },
          { status: 404 }
        );
      }
      whereClause.studentId = student.id;
    }

    const payments = await db.payment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
