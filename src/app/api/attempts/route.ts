import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, studentId, testId, answers, timeTaken } = body;

    if (!testId || !answers || !timeTaken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create student
    let student;
    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId } });
    }

    if (!student) {
      // Create guest student
      if (deviceId) {
        student = await db.student.create({
          data: { name: 'Guest Student', deviceId, freeTestsUsed: 0 },
        });
      } else {
        return NextResponse.json({ error: 'Student identification required' }, { status: 400 });
      }
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

    const score = test.questions.length > 0 ? Math.round((correctAnswers / test.questions.length) * 100) : 0;

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
      // Get updated student data
      const updatedStudent = await db.student.findUnique({ where: { id: student.id } });
      student = updatedStudent || student;
    }

    return NextResponse.json({
      attempt,
      answerDetails,
      score,
      correctAnswers,
      totalQuestions: test.questions.length,
      updatedStudent: {
        id: student.id,
        name: student.name,
        email: student.email,
        freeTestsUsed: student.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
        isSubscribed: student.isSubscribed,
      },
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');
    const rankings = searchParams.get('rankings');
    const testId = searchParams.get('testId');

    // Ranking endpoint: /api/attempts?rankings=true&testId=xxx
    if (rankings === 'true' && testId) {
      const attempts = await db.testAttempt.findMany({
        where: { testId, completed: true },
        include: {
          student: { select: { id: true, name: true } },
        },
        orderBy: [
          { score: 'desc' },
          { timeTaken: 'asc' },
        ],
      });

      // Deduplicate: keep only best attempt per student (no conflicts)
      const bestByStudent = new Map<string, (typeof attempts)[0]>();
      for (const attempt of attempts) {
        const existing = bestByStudent.get(attempt.studentId);
        if (!existing || attempt.score > existing.score || (attempt.score === existing.score && attempt.timeTaken < existing.timeTaken)) {
          bestByStudent.set(attempt.studentId, attempt);
        }
      }

      // Sort deduplicated results
      const sorted = Array.from(bestByStudent.values()).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      const rankingsData = sorted.map((attempt, index) => ({
        studentId: attempt.studentId,
        studentName: attempt.student.name,
        score: attempt.score,
        timeTaken: attempt.timeTaken,
        rank: index + 1,
        createdAt: attempt.createdAt.toISOString(),
      }));

      return NextResponse.json({ rankings: rankingsData, total: rankingsData.length });
    }

    const whereClause: Record<string, unknown> = { completed: true };

    if (studentId) {
      whereClause.studentId = studentId;
    } else if (deviceId) {
      whereClause.student = { deviceId };
    } else {
      return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
    }

    const attempts = await db.testAttempt.findMany({
      where: whereClause,
      include: {
        test: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Fetch attempts error:', error);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
