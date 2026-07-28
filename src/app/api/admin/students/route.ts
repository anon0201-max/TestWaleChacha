import { dbConnect } from '@/lib/mongodb';
import { Student, TestAttempt, Payment } from '@/models';
import { NextResponse } from 'next/server';

// GET /api/admin/students?filter=all|free|paid&search=xxx
export async function GET(request: Request) {
  try {
    await dbConnect();

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
      where.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch students
    const students = await Student.find(where)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    // Get attempt counts per student
    const attemptCounts = await TestAttempt.aggregate([
      { $group: { _id: '$studentId', count: { $sum: 1 } } },
    ]);
    const attemptCountMap = new Map(attemptCounts.map((ac) => [ac._id, ac.count]));

    // Get payment counts and last payment per student
    const payments = await Payment.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .lean();

    const paymentCountsMap = new Map<string, number>();
    const lastPaymentMap = new Map<string, any>();

    for (const payment of payments) {
      const sid = payment.studentId;
      paymentCountsMap.set(sid, (paymentCountsMap.get(sid) || 0) + 1);
      if (!lastPaymentMap.has(sid)) {
        lastPaymentMap.set(sid, payment);
      }
    }

    // Get summary counts
    const [totalStudents, totalPaid, totalFree] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ isSubscribed: true }),
      Student.countDocuments({ isSubscribed: false }),
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
        totalAttempts: attemptCountMap.get(s.id) || 0,
        totalPayments: paymentCountsMap.get(s.id) || 0,
        lastPayment: lastPaymentMap.get(s.id) || null,
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
    await dbConnect();

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    // Delete related records first, then student
    await TestAttempt.deleteMany({ studentId: id });
    await Payment.deleteMany({ studentId: id });
    await Student.findOneAndDelete({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
