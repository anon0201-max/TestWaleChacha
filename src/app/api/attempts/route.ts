import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, testId, answers, timeTaken } = body;

    if (!deviceId || !testId || !answers || !timeTaken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create student
    let student = await db.student.findUnique({
      where: { deviceId },
    });

    if (!student) {
      student = await db.student.create({
        data: {
          name: 'Guest Student',
          deviceId,
          freeTestsUsed: 0,
        },
      });
    }

    // Check if can take test (free tests limit or subscribed)
    if (student.freeTestsUsed >= 5 && !student.isSubscribed) {
      return NextResponse.json(
        { error: 'FREE_LIMIT_REACHED', freeTestsUsed: student.freeTestsUsed, isSubscribed: false },
        { status: 403 }
      );
    }

    // Get the test with correct answers
    const test = await db.test.findUnique({
      where: { id: testId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    const answerDetails = test.questions.map((q) => {
      const userAnswer = answers[q.id] || null;
      const isCorrect = userAnswer === q.correctOption;
      if (isCorrect) correctAnswers++;
      return {
        questionId: q.id,
        userAnswer,
        correctOption: q.correctOption,
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / test.questions.length) * 100);

    // Save attempt
    const attempt = await db.testAttempt.create({
      data: {
        studentId: student.id,
        testId,
        score,
        totalQuestions: test.questions.length,
        correctAnswers,
        timeTaken,
        answers: JSON.stringify(answerDetails),
        completed: true,
      },
      include: { test: { include: { category: true } } },
    });

    // Increment free tests used if not subscribed
    if (!student.isSubscribed) {
      await db.student.update({
        where: { id: student.id },
        data: { freeTestsUsed: { increment: 1 } },
      });
    }

    return NextResponse.json({
      attempt,
      answerDetails,
      score,
      correctAnswers,
      totalQuestions: test.questions.length,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    const attempts = await db.testAttempt.findMany({
      where: {
        student: { deviceId },
        completed: true,
      },
      include: {
        test: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(attempts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
