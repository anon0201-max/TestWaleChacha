import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { testId, questions } = body;

    if (!testId || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'testId and questions array required' }, { status: 400 });
    }

    const created = await Promise.all(
      questions.map((q: Record<string, string>, i: number) =>
        Question.create({
          testId,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
          explanation: q.explanation || null,
          order: q.order ?? i,
          section: q.section || 'General',
          negativeMark: q.negativeMark ? parseFloat(q.negativeMark) : 0,
        })
      )
    );

    // Update test totalQuestions count
    const count = await Question.countDocuments({ testId });
    await Test.findOneAndUpdate({ id: testId }, { totalQuestions: count });

    return NextResponse.json({ created: created.length, totalQuestions: count });
  } catch {
    return NextResponse.json({ error: 'Failed to add questions' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { questionId } = await request.json();
    const q = await Question.findOne({ id: questionId }).lean();
    if (q) {
      await Question.findOneAndDelete({ id: questionId });
      const count = await Question.countDocuments({ testId: q.testId });
      await Test.findOneAndUpdate({ id: q.testId }, { totalQuestions: count });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
