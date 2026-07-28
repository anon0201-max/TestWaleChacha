import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category, Test } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Count tests per category using aggregation
    const testCounts = await Test.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(testCounts.map((tc: any) => [tc._id, tc.count]));

    const result = categories.map((cat: any) => ({
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
    await dbConnect();
    const body = await request.json();
    const { name, slug, icon, color, examType } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const existing = await Category.findOne({ slug }).lean();

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      icon: icon || 'BookOpen',
      color: color || '#1e40af',
      examType: examType || 'General',
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

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, slug, icon, color, examType } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const update: Record<string, any> = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slug;
    if (icon !== undefined) update.icon = icon;
    if (color !== undefined) update.color = color;
    if (examType !== undefined) update.examType = examType;

    const category = await Category.findOneAndUpdate(
      { id },
      update,
      { new: true }
    ).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
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
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await Category.findOne({ id }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const testCount = await Test.countDocuments({ categoryId: id });
    if (testCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with existing tests' },
        { status: 400 }
      );
    }

    await Category.findOneAndDelete({ id });

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
