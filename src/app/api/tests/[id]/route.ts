import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question, Category } from '@/models';
import { stripMongoFields, CACHE_HEADERS } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    // Fetch test first (needed to check existence and get categoryId)
    const test = await Test.findOne({ id }).select('-__v').lean();

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Parallel: fetch category + questions concurrently
    const [category, questions] = await Promise.all([
      test.categoryId
        ? Category.findOne({ id: test.categoryId }).select('-__v').lean()
        : Promise.resolve(null),
      Question.find({ testId: id })
        .sort({ order: 1 })
        .select('-__v')
        .lean(),
    ]);

    const result = {
      ...test,
      category,
      questions,
    };

    return NextResponse.json(stripMongoFields(result), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch test' },
      { status: 500 }
    );
  }
}
