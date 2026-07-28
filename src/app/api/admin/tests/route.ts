import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tests = await db.test.findMany({
      include: {
        category: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error('Get tests error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, categoryId, difficulty, timeLimit, examName, isActive } = body;

    if (!title || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Title and categoryId are required' },
        { status: 400 }
      );
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const test = await db.test.create({
      data: {
        title,
        description: description || '',
        categoryId,
        difficulty: difficulty || 'medium',
        timeLimit: timeLimit || 600,
        totalQuestions: 0,
        examName: examName || 'Practice Test',
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Test created successfully',
      test,
    });
  } catch (error) {
    console.error('Create test error:', error);
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
        { success: false, message: 'Test ID is required' },
        { status: 400 }
      );
    }

    await db.question.deleteMany({ where: { testId: id } });
    await db.testAttempt.deleteMany({ where: { testId: id } });
    await db.test.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Test deleted successfully',
    });
  } catch (error) {
    console.error('Delete test error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
