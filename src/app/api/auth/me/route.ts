import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');

    if (studentId) {
      const student = await db.student.findUnique({ where: { id: studentId } });
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
      const student = await db.student.findFirst({ where: { email } });
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
