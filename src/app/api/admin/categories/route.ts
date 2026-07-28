import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });

    const testCounts = await db.test.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const countMap = new Map<string, number>();
    for (const tc of testCounts) {
      countMap.set(tc.categoryId, tc._count.id);
    }

    const result = categories.map((cat) => ({
      ...cat,
      _count: { tests: countMap.get(cat.id) || 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon, color, examType } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const existing = await db.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        icon: icon || 'BookOpen',
        color: color || '#1e40af',
        examType: examType || 'General',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { tests: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.tests > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with existing tests' },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
