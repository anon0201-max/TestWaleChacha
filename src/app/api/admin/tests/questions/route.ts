import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, questions } = body;

    if (!testId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'testId and questions array are required' },
        { status: 400 }
      );
    }

    const test = await db.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return NextResponse.json(
        { success: false, message: 'Test not found' },
        { status: 404 }
      );
    }

    const createdQuestions = await db.question.createMany({
      data: questions.map((q: Record<string, unknown>, index: number) => ({
        testId,
        question: q.question,
        questionImage: q.questionImage || null,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        explanation: q.explanation || null,
        order: q.order !== undefined ? q.order : index,
        negativeMark: q.negativeMark !== undefined ? q.negativeMark : 0,
        section: q.section || 'General',
      })),
    });

    const updatedCount = await db.question.count({ where: { testId } });
    await db.test.update({
      where: { id: testId },
      data: { totalQuestions: updatedCount },
    });

    return NextResponse.json({
      success: true,
      message: `Created ${createdQuestions.count} questions`,
      count: createdQuestions.count,
    });
  } catch (error) {
    console.error('Create questions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const testId = searchParams.get('testId');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Question ID is required' },
        { status: 400 }
      );
    }

    await db.question.delete({ where: { id } });

    if (testId) {
      const updatedCount = await db.question.count({ where: { testId } });
      await db.test.update({
        where: { id: testId },
        data: { totalQuestions: updatedCount },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
