import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json({ error: 'testId is required' }, { status: 400 });
    }

    const test = await Test.findOne({ id: testId })
      .populate('categoryId')
      .lean();

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const questions = await Question.find({ testId })
      .sort({ order: 1 })
      .lean();

    const result = {
      ...test,
      category: test.categoryId,
      categoryId: test.categoryId?.id || test.categoryId,
      questions,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
