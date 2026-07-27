import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/admin/payments — list all payments with student info
export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: {
        student: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json(
      payments.map(p => ({
        id: p.id,
        studentId: p.studentId,
        studentName: p.student.name,
        studentEmail: p.student.email,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        createdAt: p.createdAt,
      }))
    );
  } catch (error) {
    console.error('Fetch payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
