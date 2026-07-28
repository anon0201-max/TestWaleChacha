import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question, Category } from '@/models';
import { stripMongoFields, CACHE_HEADERS } from '@/lib/api-utils';

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

    // Phase 1: Fetch tests
    const tests = await Test.find(where)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    if (tests.length === 0) {
      return NextResponse.json([], { headers: CACHE_HEADERS });
    }

    // Phase 2: Parallel – question counts + categories
    const testIdStrings = tests.map((t) => t.id);
    const categoryIds = [...new Set(tests.map((t) => t.categoryId))];

    const [questionCounts, categories] = await Promise.all([
      Question.aggregate([
        { $match: { testId: { $in: testIdStrings } } },
        { $group: { _id: '$testId', count: { $sum: 1 } } },
      ]),
      Category.find({ id: { $in: categoryIds } }).select('-__v').lean(),
    ]);

    const qCountMap = new Map(questionCounts.map((qc) => [qc._id, qc.count]));
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const result = tests.map((test) => ({
      ...test,
      category: catMap.get(test.categoryId) || null,
      _count: { questions: qCountMap.get(test.id) || 0 },
    }));

    return NextResponse.json(stripMongoFields(result), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
