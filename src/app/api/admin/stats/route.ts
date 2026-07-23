import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalStudents, totalTests, totalQuestions, totalAttempts, totalPayments] = await Promise.all([
      db.student.count(),
      db.test.count(),
      db.question.count(),
      db.testAttempt.count({ where: { completed: true } }),
      db.payment.count({ where: { status: 'completed' } }),
    ]);
    return NextResponse.json({ totalStudents, totalTests, totalQuestions, totalAttempts, totalPayments });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
