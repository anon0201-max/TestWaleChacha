import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      const { dbConnect } = await import('@/lib/mongodb');
      const { ContactSubmission } = await import('@/models');
      await dbConnect();
      const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(submissions);
    } else {
      const { db } = await import('@/lib/db');
      const submissions = await db.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(submissions);
    }
  } catch (error) {
    console.error('Fetch contact submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (process.env.MONGODB_URI) {
      const { dbConnect } = await import('@/lib/mongodb');
      const { ContactSubmission } = await import('@/models');
      await dbConnect();
      await ContactSubmission.findByIdAndUpdate(id, { isRead: true });
    } else {
      const { db } = await import('@/lib/db');
      await db.contactSubmission.update({ where: { id }, data: { isRead: true } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (process.env.MONGODB_URI) {
      const { dbConnect } = await import('@/lib/mongodb');
      const { ContactSubmission } = await import('@/models');
      await dbConnect();
      await ContactSubmission.findByIdAndDelete(id);
    } else {
      const { db } = await import('@/lib/db');
      await db.contactSubmission.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
