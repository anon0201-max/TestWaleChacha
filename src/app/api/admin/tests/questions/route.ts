import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { clearCacheByPrefix } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { testId, questions } = body;

    if (!testId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'testId and questions array are required' },
        { status: 400 }
      );
    }

    const test = await Test.findOne({ id: testId }).lean();

    if (!test) {
      return NextResponse.json(
        { success: false, message: 'Test not found' },
        { status: 404 }
      );
    }

    const questionsData = questions.map((q: Record<string, unknown>, index: number) => ({
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
    }));

    await Question.insertMany(questionsData);

    const updatedCount = await Question.countDocuments({ testId });
    await Test.findOneAndUpdate(
      { id: testId },
      { totalQuestions: updatedCount }
    );

    clearCacheByPrefix('tests:');
    return NextResponse.json({
      success: true,
      message: `Created ${questionsData.length} questions`,
      count: questionsData.length,
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
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const testId = searchParams.get('testId');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Question ID is required' },
        { status: 400 }
      );
    }

    await Question.findOneAndDelete({ id });

    if (testId) {
      const updatedCount = await Question.countDocuments({ testId });
      await Test.findOneAndUpdate(
        { id: testId },
        { totalQuestions: updatedCount }
      );
    }

    clearCacheByPrefix('tests:');
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
