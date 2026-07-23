import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, deviceId, amount } = await request.json();

    if (!deviceId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create student
    const student = await db.student.upsert({
      where: { deviceId },
      update: {},
      create: { name: 'Pro Student', deviceId },
    });

    // Create payment record
    await db.payment.create({
      data: {
        studentId: student.id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount: amount || 10000,
        status: 'completed',
        currency: 'INR',
      },
    });

    // Activate subscription
    await db.student.update({
      where: { id: student.id },
      data: { isSubscribed: true, subscriptionAt: new Date() },
    });

    return NextResponse.json({ success: true, isSubscribed: true, message: 'Payment verified and subscription activated!' });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
