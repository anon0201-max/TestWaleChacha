import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { examName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tests = await db.test.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = tests.map(({ _count, ...test }) => ({
      ...test,
      _count: { questions: _count.questions },
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
