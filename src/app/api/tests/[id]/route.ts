import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question, Category } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const test = await Test.findOne({ id }).lean();

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Fetch category separately
    const category = test.categoryId
      ? await Category.findOne({ id: test.categoryId }).lean()
      : null;

    // Fetch questions separately
    const questions = await Question.find({ testId: id })
      .sort({ order: 1 })
      .lean();

    const result = {
      ...test,
      category,
      questions,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch test' },
      { status: 500 }
    );
  }
}
