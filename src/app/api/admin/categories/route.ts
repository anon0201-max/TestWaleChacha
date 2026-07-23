import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { tests: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, icon, color, examType } = await request.json();
    if (!name || !slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    const cat = await db.category.create({ data: { name, slug, icon: icon || 'BookOpen', color: color || '#1e40af', examType: examType || 'General' } });
    return NextResponse.json(cat);
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
