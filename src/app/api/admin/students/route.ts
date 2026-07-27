import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/admin/students?filter=all|free|paid&search=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';

    const where: Record<string, unknown> = {};

    if (filter === 'free') {
      where.isSubscribed = false;
    } else if (filter === 'paid') {
      where.isSubscribed = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Fetch students with their attempt count and payment info
    const students = await db.student.findMany({
      where,
      include: {
        _count: { select: { testAttempts: true, payments: true } },
        payments: {
          where: { status: 'completed' },
          select: { id: true, amount: true, currency: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    // Get summary counts
    const [totalStudents, totalPaid, totalFree] = await Promise.all([
      db.student.count(),
      db.student.count({ where: { isSubscribed: true } }),
      db.student.count({ where: { isSubscribed: false } }),
    ]);

    return NextResponse.json({
      students: students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        deviceId: s.deviceId,
        freeTestsUsed: s.freeTestsUsed,
        isSubscribed: s.isSubscribed,
        subscriptionAt: s.subscriptionAt,
        createdAt: s.createdAt,
        totalAttempts: s._count.testAttempts,
        totalPayments: s._count.payments,
        lastPayment: s.payments[0] || null,
      })),
      summary: { totalStudents, totalPaid, totalFree },
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

// DELETE /api/admin/students — delete a student
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // Delete related records first, then student
    await db.testAttempt.deleteMany({ where: { studentId: id } });
    await db.payment.deleteMany({ where: { studentId: id } });
    await db.student.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
