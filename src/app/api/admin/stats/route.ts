import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Student, Test, Question, TestAttempt, Payment } from '@/models';

export async function GET() {
  try {
    await dbConnect();

    const [totalStudents, totalTests, totalQuestions, totalAttempts, totalPayments, totalPaidStudents] = await Promise.all([
      Student.countDocuments(),
      Test.countDocuments(),
      Question.countDocuments(),
      TestAttempt.countDocuments({ completed: true }),
      Payment.countDocuments({ status: 'completed' }),
      Student.countDocuments({ isSubscribed: true }),
    ]);

    return NextResponse.json({
      totalStudents,
      totalTests,
      totalQuestions,
      totalAttempts,
      totalPayments,
      totalPaidStudents,
      totalFreeStudents: totalStudents - totalPaidStudents,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
