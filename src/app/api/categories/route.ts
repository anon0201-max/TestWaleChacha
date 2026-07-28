import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';
import { stripMongoFields, CACHE_HEADERS } from '@/lib/api-utils';

export async function GET() {
  try {
    await dbConnect();

    // Parallel: fetch categories + aggregate test counts concurrently
    const [categories, testCounts] = await Promise.all([
      Category.find({}).sort({ name: 1 }).select('-__v').lean(),
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

    return NextResponse.json(stripMongoFields(result), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
