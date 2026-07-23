import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json({ error: 'testId is required' }, { status: 400 });
    }

    const test = await db.test.findUnique({
      where: { id: testId },
      include: {
        category: true,
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
