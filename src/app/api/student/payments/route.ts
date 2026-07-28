import { dbConnect } from '@/lib/mongodb';
import { Payment } from '@/models';
import { NextResponse } from 'next/server';

// GET /api/student/payments?studentId=xxx — current user's payment history/bill
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const payments = await Payment.find({ studentId, status: 'completed' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Fetch student payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
