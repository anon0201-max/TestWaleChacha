import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tests = await db.test.findMany({
      include: { category: true, _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tests);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, categoryId, difficulty, timeLimit, examName } = await request.json();
    if (!title || !categoryId) return NextResponse.json({ error: 'Title and categoryId required' }, { status: 400 });
    const test = await db.test.create({
      data: { title, description: description || '', categoryId, difficulty: difficulty || 'medium', timeLimit: timeLimit || 600, totalQuestions: 0, examName: examName || 'Practice Test' },
    });
    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.test.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
