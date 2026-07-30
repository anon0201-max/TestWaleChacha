import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category, Test, Question, TestAttempt } from '@/models';
import { stripMongoFields, clearCacheByPrefix } from '@/lib/api-utils';

export async function GET() {
  try {
    await dbConnect();
    const tests = await Test.find()
      .sort({ createdAt: -1 })
      .lean();

    // Get question counts per test
    const questionCounts = await Question.aggregate([
      { $group: { _id: '$testId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(questionCounts.map((qc: any) => [qc._id, qc.count]));

    // Fetch categories in batch
    const categoryIds = [...new Set(tests.map((t: any) => t.categoryId).filter(Boolean))];
    const categories = categoryIds.length > 0 ? await Category.find({ id: { $in: categoryIds } }).lean() : [];
    const catMap = new Map(categories.map((c: any) => [c.id, stripMongoFields(c)]));

    const result = tests.map((test: any) => ({
      ...stripMongoFields(test),
      category: catMap.get(test.categoryId) || null,
      _count: { questions: countMap.get(test.id) || 0 },
    }));

    return NextResponse.json(result);
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
    await dbConnect();
    const body = await request.json();
    const { title, description, categoryId, difficulty, timeLimit, examName, isActive, icon } = body;

    if (!title || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Title and categoryId are required' },
        { status: 400 }
      );
    }

    const category = await Category.findOne({ id: categoryId }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const test = await Test.create({
      title,
      description: description || '',
      categoryId,
      difficulty: difficulty || 'medium',
      timeLimit: timeLimit || 600,
      totalQuestions: 0,
      examName: examName || 'Practice Test',
      icon: icon || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    // Invalidate caches
    clearCacheByPrefix('categories:');
    clearCacheByPrefix('tests:');

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

// PATCH — toggle lock/unlock or bulk update
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, isLocked, bulkLock, bulkUnlock } = body;

    // Bulk lock/unlock all tests
    if (bulkLock) {
      await Test.updateMany({}, { $set: { isLocked: true } });
      clearCacheByPrefix('tests:');
      return NextResponse.json({ success: true, message: 'All tests locked' });
    }
    if (bulkUnlock) {
      await Test.updateMany({}, { $set: { isLocked: false } });
      clearCacheByPrefix('tests:');
      return NextResponse.json({ success: true, message: 'All tests unlocked' });
    }

    // Single test lock/unlock
    if (!id || typeof isLocked !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Test ID and isLocked boolean are required' },
        { status: 400 }
      );
    }

    await Test.updateOne({ id }, { $set: { isLocked } });
    clearCacheByPrefix('tests:');

    return NextResponse.json({
      success: true,
      message: isLocked ? 'Test locked' : 'Test unlocked',
    });
  } catch (error) {
    console.error('Patch test error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Test ID is required' },
        { status: 400 }
      );
    }

    await Question.deleteMany({ testId: id });
    await TestAttempt.deleteMany({ testId: id });
    await Test.findOneAndDelete({ id });

    // Invalidate caches
    clearCacheByPrefix('categories:');
    clearCacheByPrefix('tests:');

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
