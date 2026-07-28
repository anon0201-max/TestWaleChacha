import { dbConnect } from '@/lib/mongodb';
import { Payment, Student } from '@/models';
import { NextResponse } from 'next/server';

// GET /api/admin/payments — list all payments with student info
export async function GET() {
  try {
    await dbConnect();

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    // Get all unique student IDs
    const studentIds = [...new Set(payments.map(p => p.studentId))];

    // Batch fetch students
    const students = await Student.find({ id: { $in: studentIds } }).lean();
    const studentMap = new Map(students.map(s => [s.id, s]));

    return NextResponse.json(
      payments.map(p => ({
        id: p.id,
        studentId: p.studentId,
        studentName: studentMap.get(p.studentId)?.name || 'Unknown',
        studentEmail: studentMap.get(p.studentId)?.email || null,
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
