import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Test, Question, Category } from '@/models';
import { stripMongoFields, CACHE_HEADERS, getFromCache, setCache, buildCacheKey } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    // Build cache key from query params
    const params: Record<string, string> = {};
    if (categoryId) params.categoryId = categoryId;
    if (difficulty) params.difficulty = difficulty;
    if (search) params.search = search;
    const cacheKey = buildCacheKey('tests:list', params);

    // Serve from in-memory cache if fresh
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: CACHE_HEADERS });
    }

    await dbConnect();

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

    // Phase 1: Fetch tests with projection (exclude large fields)
    const tests = await Test.find(where)
      .sort({ createdAt: -1 })
      .select('-__v -explanation -questionImages')
      .lean();

    if (tests.length === 0) {
      setCache(cacheKey, [], 60);
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
      Category.find({ id: { $in: categoryIds } }).select('id name slug icon color').lean(),
    ]);

    const qCountMap = new Map(questionCounts.map((qc) => [qc._id, qc.count]));
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const result = tests.map((test) => ({
      ...test,
      category: catMap.get(test.categoryId) || null,
      _count: { questions: qCountMap.get(test.id) || 0 },
    }));

    const cleaned = stripMongoFields(result);

    // Cache for 60 seconds
    setCache(cacheKey, cleaned, 60);

    return NextResponse.json(cleaned, {
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
