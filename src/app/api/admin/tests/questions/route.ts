import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testId, questions } = body;

    if (!testId || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'testId and questions array required' }, { status: 400 });
    }

    const created = await Promise.all(
      questions.map((q: Record<string, string>, i: number) =>
        db.question.create({
          data: {
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
          },
        })
      )
    );

    // Update test totalQuestions count
    const count = await db.question.count({ where: { testId } });
    await db.test.update({ where: { id: testId }, data: { totalQuestions: count } });

    return NextResponse.json({ created: created.length, totalQuestions: count });
  } catch {
    return NextResponse.json({ error: 'Failed to add questions' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { questionId } = await request.json();
    const q = await db.question.findUnique({ where: { id: questionId } });
    if (q) {
      await db.question.delete({ where: { id: questionId } });
      const count = await db.question.count({ where: { testId: q.testId } });
      await db.test.update({ where: { id: q.testId }, data: { totalQuestions: count } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
