import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');

    if (studentId) {
      const student = await Student.findOne({ id: studentId }).lean();
      if (student) {
        return NextResponse.json({
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          freeTestsUsed: student.freeTestsUsed,
          freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
          isSubscribed: student.isSubscribed,
          subscriptionAt: student.subscriptionAt,
        });
      }
    }

    if (email) {
      const student = await Student.findOne({ email }).lean();
      if (student) {
        return NextResponse.json({
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          freeTestsUsed: student.freeTestsUsed,
          freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
          isSubscribed: student.isSubscribed,
          subscriptionAt: student.subscriptionAt,
        });
      }
    }

    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}
