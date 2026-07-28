import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question, Category } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { isActive: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { examName: { $regex: search, $options: 'i' } },
      ];
    }

    const tests = await Test.find(where)
      .sort({ createdAt: -1 })
      .lean();

    // Count questions per test
    const testIdStrings = tests.map((t) => t.id);
    const questionCounts = await Question.aggregate([
      { $match: { testId: { $in: testIdStrings } } },
      { $group: { _id: '$testId', count: { $sum: 1 } } },
    ]);
    const qCountMap = new Map(questionCounts.map((qc) => [qc._id, qc.count]));

    // Fetch categories separately
    const categoryIds = [...new Set(tests.map((t) => t.categoryId))];
    const categories = await Category.find({ id: { $in: categoryIds } }).lean();
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const result = tests.map((test) => ({
      ...test,
      category: catMap.get(test.categoryId) || null,
      _count: { questions: qCountMap.get(test.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
