import { dbConnect } from '@/lib/mongodb';
import { Student, Test, Question, TestAttempt } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { deviceId, studentId, testId, answers, timeTaken } = body;

    if (!testId || !answers || !timeTaken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create student
    let student;
    if (studentId) {
      student = await Student.findOne({ id: studentId }).lean();
    } else if (deviceId) {
      student = await Student.findOne({ deviceId }).lean();
    }

    if (!student) {
      // Create guest student
      if (deviceId) {
        student = await Student.create({
          name: 'Guest Student',
          deviceId,
          freeTestsUsed: 0,
        });
        student = student.toObject();
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
    const test = await Test.findOne({ id: testId }).lean();
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const questions = await Question.find({ testId }).sort({ order: 1 }).lean();

    // Calculate score
    let correctAnswers = 0;
    const answerDetails = questions.map((q: any) => {
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

    const score = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    // Save attempt
    const attempt = await TestAttempt.create({
      studentId: student.id,
      testId,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken,
      answers: JSON.stringify(answerDetails),
      completed: true,
    });

    // Populate test with category for the attempt response
    const populatedTest = await Test.findOne({ id: testId }).populate({ path: 'categoryId', foreignField: 'id' }).lean();

    const attemptResult = {
      ...attempt.toObject(),
      test: populatedTest,
    };

    // Increment free tests used if not subscribed
    if (!student.isSubscribed) {
      await Student.findOneAndUpdate(
        { id: student.id },
        { $inc: { freeTestsUsed: 1 } }
      );
      // Get updated student data
      const updatedStudent = await Student.findOne({ id: student.id }).lean();
      student = updatedStudent || student;
    }

    return NextResponse.json({
      attempt: attemptResult,
      answerDetails,
      score,
      correctAnswers,
      totalQuestions: questions.length,
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
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');
    const rankings = searchParams.get('rankings');
    const testId = searchParams.get('testId');

    // Ranking endpoint: /api/attempts?rankings=true&testId=xxx
    if (rankings === 'true' && testId) {
      const attempts = await TestAttempt.find({ testId, completed: true })
        .populate({ path: 'studentId', foreignField: 'id' })
        .sort({ score: -1, timeTaken: 1 })
        .lean();

      // Deduplicate: keep only best attempt per student (no conflicts)
      const bestByStudent = new Map<string, any>();
      for (const attempt of attempts) {
        const studentIdVal = attempt.studentId?.id || attempt.studentId;
        const existing = bestByStudent.get(studentIdVal);
        if (!existing || attempt.score > existing.score || (attempt.score === existing.score && attempt.timeTaken < existing.timeTaken)) {
          bestByStudent.set(studentIdVal, attempt);
        }
      }

      // Sort deduplicated results
      const sorted = Array.from(bestByStudent.values()).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      const rankingsData = sorted.map((attempt, index) => ({
        studentId: attempt.studentId?.id || attempt.studentId,
        studentName: attempt.studentId?.name || 'Unknown',
        score: attempt.score,
        timeTaken: attempt.timeTaken,
        rank: index + 1,
        createdAt: new Date(attempt.createdAt).toISOString(),
      }));

      return NextResponse.json({ rankings: rankingsData, total: rankingsData.length });
    }

    const whereClause: Record<string, unknown> = { completed: true };

    if (studentId) {
      whereClause.studentId = studentId;
    } else if (deviceId) {
      // Find student by deviceId first, then use their id
      const student = await Student.findOne({ deviceId }).lean();
      if (!student) {
        return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
      }
      whereClause.studentId = student.id;
    } else {
      return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
    }

    const attempts = await TestAttempt.find(whereClause)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Populate test with category for each attempt
    const populatedAttempts = await Promise.all(
      attempts.map(async (attempt: any) => {
        const test = await Test.findOne({ id: attempt.testId }).populate({ path: 'categoryId', foreignField: 'id' }).lean();
        return {
          ...attempt,
          test,
        };
      })
    );

    return NextResponse.json(populatedAttempts);
  } catch (error) {
    console.error('Fetch attempts error:', error);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
