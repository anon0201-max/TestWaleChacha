import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';
import { stripMongoFields, LONG_CACHE_HEADERS, getFromCache, setCache } from '@/lib/api-utils';

const CACHE_KEY = 'categories:all';
const CACHE_TTL = 120; // 2 minutes — categories rarely change

export async function GET() {
  try {
    // Serve from in-memory cache if fresh
    const cached = getFromCache(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, { headers: LONG_CACHE_HEADERS });
    }

    await dbConnect();

    // Parallel: fetch categories + aggregate test counts concurrently
    const [categories, testCounts] = await Promise.all([
      Category.find({}).sort({ name: 1 }).select('-__v -description -createdAt -updatedAt').lean(),
      Test.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      ]),
    ]);

    const countMap = new Map(testCounts.map((tc) => [tc._id, tc.count]));

    const result = categories.map((cat) => ({
      ...cat,
      _count: { tests: countMap.get(cat.id) || 0 },
    }));

    const cleaned = stripMongoFields(result);

    // Store in memory cache
    setCache(CACHE_KEY, cleaned, CACHE_TTL);

    return NextResponse.json(cleaned, {
      headers: LONG_CACHE_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
