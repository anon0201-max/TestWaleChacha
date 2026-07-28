import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({}).sort({ name: 1 }).lean();

    // Count tests per category
    const testCounts = await Test.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(testCounts.map((tc) => [tc._id, tc.count]));

    const result = categories.map((cat) => ({
      ...cat,
      _count: { tests: countMap.get(cat.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
