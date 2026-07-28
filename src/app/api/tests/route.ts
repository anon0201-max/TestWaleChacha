import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (categoryId) where.categoryId = categoryId;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tests = await Test.find(where)
      .populate({ path: 'categoryId', foreignField: 'id' })
      .sort({ createdAt: -1 })
      .lean();

    // Get question counts per test
    const questionCounts = await Question.aggregate([
      { $group: { _id: '$testId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(questionCounts.map((qc) => [qc._id, qc.count]));

    const result = tests.map((test: any) => ({
      ...test,
      category: test.categoryId,
      categoryId: test.categoryId?.id || test.categoryId,
      _count: { questions: countMap.get(test.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}
