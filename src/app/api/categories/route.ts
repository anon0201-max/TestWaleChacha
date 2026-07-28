import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find().sort({ name: 1 }).lean();

    // Get test counts per category
    const testCounts = await Test.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(testCounts.map((tc) => [tc._id, tc.count]));

    const result = categories.map(({ _id, ...rest }) => ({
      ...rest,
      _count: { tests: countMap.get(rest.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
