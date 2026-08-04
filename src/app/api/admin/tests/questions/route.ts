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

// PUT — edit a single question
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, question, optionA, optionB, optionC, optionD, correctOption, explanation, negativeMark, section, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Question ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (question !== undefined) updateData.question = question;
    if (optionA !== undefined) updateData.optionA = optionA;
    if (optionB !== undefined) updateData.optionB = optionB;
    if (optionC !== undefined) updateData.optionC = optionC;
    if (optionD !== undefined) updateData.optionD = optionD;
    if (correctOption !== undefined) updateData.correctOption = correctOption;
    if (explanation !== undefined) updateData.explanation = explanation;
    if (negativeMark !== undefined) updateData.negativeMark = negativeMark;
    if (section !== undefined) updateData.section = section;
    if (order !== undefined) updateData.order = order;

    await Question.updateOne({ id }, { $set: updateData });
    clearCacheByPrefix('tests:');

    return NextResponse.json({
      success: true,
      message: 'Question updated successfully',
    });
  } catch (error) {
    console.error('Update question error:', error);
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
    const ids = searchParams.get('ids');
    const testId = searchParams.get('testId');
    const deleteAll = searchParams.get('deleteAll');

    // Delete all questions in a test
    if (deleteAll === 'true' && testId) {
      const result = await Question.deleteMany({ testId });
      await Test.findOneAndUpdate(
        { id: testId },
        { totalQuestions: 0 }
      );
      clearCacheByPrefix('tests:');
      return NextResponse.json({
        success: true,
        message: `Deleted all ${result.deletedCount} questions`,
        count: result.deletedCount,
      });
    }

    // Bulk delete multiple questions by IDs
    if (ids) {
      const idArray = ids.split(',').filter(Boolean);
      if (idArray.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No question IDs provided' },
          { status: 400 }
        );
      }
      const result = await Question.deleteMany({ id: { $in: idArray } });
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
        message: `Deleted ${result.deletedCount} questions`,
        count: result.deletedCount,
      });
    }

    // Delete single question
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
