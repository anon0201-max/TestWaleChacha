import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Count tests per category
    const testCounts = await db.test.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const countMap = new Map(testCounts.map((tc) => [tc.categoryId, tc._count.id]));

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
