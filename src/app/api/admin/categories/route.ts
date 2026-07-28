import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find()
      .sort({ name: 1 })
      .lean();

    // Get test counts per category
    const testCounts = await Test.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(testCounts.map((tc) => [tc._id, tc.count]));

    const result = categories.map((cat: any) => ({
      ...cat,
      _count: { tests: countMap.get(cat.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, slug, icon, color, examType } = await request.json();
    if (!name || !slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    const cat = await Category.create({
      name,
      slug,
      icon: icon || 'BookOpen',
      color: color || '#1e40af',
      examType: examType || 'General',
    });
    return NextResponse.json(cat.toObject());
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { id } = await request.json();
    await Category.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
