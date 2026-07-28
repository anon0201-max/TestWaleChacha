import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const tests = await Test.find()
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
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { title, description, categoryId, difficulty, timeLimit, examName } = await request.json();
    if (!title || !categoryId) return NextResponse.json({ error: 'Title and categoryId required' }, { status: 400 });

    const test = await Test.create({
      title,
      description: description || '',
      categoryId,
      difficulty: difficulty || 'medium',
      timeLimit: timeLimit || 600,
      totalQuestions: 0,
      examName: examName || 'Practice Test',
    });

    return NextResponse.json(test.toObject());
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { id } = await request.json();
    await Test.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
