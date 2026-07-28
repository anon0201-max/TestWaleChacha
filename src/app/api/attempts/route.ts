import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { TestAttempt, Student, Test, Question, Category } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, deviceId, testId, answers, timeTaken } = body;

    if (!testId || !answers || !timeTaken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find student
    let student;
    if (studentId) {
      student = await Student.findOne({ id: studentId }).lean();
    } else if (deviceId) {
      student = await Student.findOne({ deviceId }).lean();
    }

    if (!student) {
      // Create guest student if deviceId provided
      if (deviceId) {
        const created = await Student.create({ name: 'Guest Student', deviceId, freeTestsUsed: 0 });
        student = created.toObject();
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
    const test = await Test.findOne({ id: testId }).lean();

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Fetch questions separately
    const questions = await Question.find({ testId })
      .sort({ order: 1 })
      .lean();

    // Calculate score
    const answersParsed = typeof answers === 'string' ? JSON.parse(answers) : answers;
    let correctCount = 0;
    let totalNegative = 0;

    const answerDetails = questions.map((q) => {
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

    const score = Math.max(0, Math.round(((correctCount - totalNegative) / questions.length) * 100));

    // Save attempt
    const attempt = await TestAttempt.create({
      studentId: student.id,
      testId,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timeTaken,
      answers: typeof answers === 'string' ? answers : JSON.stringify(answerDetails),
      completed: true,
    });

    // Increment freeTestsUsed (only for non-subscribed students)
    let updatedStudent = student;
    if (!student.isSubscribed) {
      updatedStudent = await Student.findOneAndUpdate(
        { id: student.id },
        { $inc: { freeTestsUsed: 1 } },
        { new: true }
      ).lean();
    }

    const attemptResult = {
      ...attempt.toObject(),
      test: { ...test, questions },
    };

    return NextResponse.json({
      attempt: attemptResult,
      answerDetails,
      score,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
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
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const studentId = searchParams.get('studentId');
    const testId = searchParams.get('testId');
    const rankings = searchParams.get('rankings');

    // Rankings endpoint: /api/attempts?rankings=true&testId=xxx
    if (rankings === 'true' && testId) {
      const attempts = await TestAttempt.find({ testId, completed: true })
        .sort({ score: -1, timeTaken: 1 })
        .lean();

      // Fetch students in batch
      const studentIds = [...new Set(attempts.map(a => a.studentId))];
      const students = await Student.find({ id: { $in: studentIds } }).lean();
      const studentMap = new Map(students.map(s => [s.id, s]));

      // Deduplicate: keep only best attempt per student
      const bestByStudent = new Map();
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

      const studentData = sorted.map((attempt, index) => {
        const s = studentMap.get(attempt.studentId);
        return {
          studentId: s?.id || attempt.studentId,
          studentName: s?.name || 'Unknown',
          score: attempt.score,
          timeTaken: attempt.timeTaken,
          rank: index + 1,
          createdAt: new Date(attempt.createdAt).toISOString(),
        };
      });

      return NextResponse.json({ rankings: studentData, total: studentData.length });
    }

    if (!studentId && !deviceId) {
      return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
    }

    // Find student
    let student;
    if (studentId) {
      student = await Student.findOne({ id: studentId }).lean();
    } else if (deviceId) {
      student = await Student.findOne({ deviceId }).lean();
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 400 });
    }

    const attempts = await TestAttempt.find({ studentId: student.id, completed: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Fetch tests and categories in batch
    const testIds = [...new Set(attempts.map(a => a.testId))];
    const tests = await Test.find({ id: { $in: testIds } }).lean();
    const catIds = [...new Set(tests.map(t => t.categoryId).filter(Boolean))];
    const categories = catIds.length > 0 ? await Category.find({ id: { $in: catIds } }).lean() : [];
    const testMap = new Map(tests.map(t => [t.id, t]));
    const catMap = new Map(categories.map(c => [c.id, c]));

    // Attach test and category to each attempt
    const result = attempts.map(attempt => {
      const test = testMap.get(attempt.testId);
      const category = test?.categoryId ? catMap.get(test.categoryId) : null;
      return {
        ...attempt,
        test: test ? { ...test, category } : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Fetch attempts error:', error);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
