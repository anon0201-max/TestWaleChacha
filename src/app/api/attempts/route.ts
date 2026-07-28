import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, deviceId, testId, answers, timeTaken } = body;

    if (!testId || !answers || !timeTaken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find student
    let student;
    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId } });
    }

    if (!student) {
      // Create guest student if deviceId provided
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

    // Fetch test with questions
    const test = await db.test.findUnique({
      where: { id: testId },
      include: {
        questions: { orderBy: { order: 'asc' } },
        category: true,
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Calculate score
    const answersParsed = typeof answers === 'string' ? JSON.parse(answers) : answers;
    let correctCount = 0;
    let totalNegative = 0;

    const answerDetails = test.questions.map((q) => {
      const userAnswer = answersParsed[q.id] || null;
      const isCorrect = userAnswer === q.correctOption;
      if (isCorrect) correctCount++;
      else if (userAnswer) totalNegative += q.negativeMark;
      return {
        questionId: q.id,
        userAnswer,
        correctOption: q.correctOption,
        isCorrect,
      };
    });

    const score = Math.max(0, Math.round(((correctCount - totalNegative) / test.questions.length) * 100));

    // Save attempt
    const attempt = await db.testAttempt.create({
      data: {
        studentId: student.id,
        testId,
        score,
        totalQuestions: test.questions.length,
        correctAnswers: correctCount,
        timeTaken,
        answers: typeof answers === 'string' ? answers : JSON.stringify(answerDetails),
        completed: true,
      },
    });

    // Increment freeTestsUsed (only for non-subscribed students)
    let updatedStudent = student;
    if (!student.isSubscribed) {
      updatedStudent = await db.student.update({
        where: { id: student.id },
        data: { freeTestsUsed: { increment: 1 } },
      });
    }

    const attemptResult = {
      ...attempt,
      test,
    };

    return NextResponse.json({
      attempt: attemptResult,
      answerDetails,
      score,
      correctAnswers: correctCount,
      totalQuestions: test.questions.length,
      updatedStudent: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        freeTestsUsed: updatedStudent.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - updatedStudent.freeTestsUsed),
        isSubscribed: updatedStudent.isSubscribed,
      },
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');
    const testId = searchParams.get('testId');
    const rankings = searchParams.get('rankings');

    // Rankings endpoint: /api/attempts?rankings=true&testId=xxx
    if (rankings === 'true' && testId) {
      const attempts = await db.testAttempt.findMany({
        where: { testId, completed: true },
        include: { student: true, test: true },
        orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
      });

      // Deduplicate: keep only best attempt per student
      const bestByStudent = new Map<string, typeof attempts[0]>();
      for (const attempt of attempts) {
        const existing = bestByStudent.get(attempt.studentId);
        if (!existing || attempt.score > existing.score || (attempt.score === existing.score && attempt.timeTaken < existing.timeTaken)) {
          bestByStudent.set(attempt.studentId, attempt);
        }
      }

      const sorted = Array.from(bestByStudent.values()).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      const rankingsData = sorted.map((attempt, index) => ({
        studentId: attempt.student.id,
        studentName: attempt.student.name || 'Unknown',
        score: attempt.score,
        timeTaken: attempt.timeTaken,
        rank: index + 1,
        createdAt: new Date(attempt.createdAt).toISOString(),
      }));

      return NextResponse.json({ rankings: rankingsData, total: rankingsData.length });
    }

    if (!studentId && !deviceId) {
      return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
    }

    // Find student
    let student;
    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId } });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 400 });
    }

    const whereClause: Record<string, unknown> = { studentId: student.id, completed: true };

    const attempts = await db.testAttempt.findMany({
      where: whereClause,
      include: {
        test: {
          include: { category: true },
        },
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
