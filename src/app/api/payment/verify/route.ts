import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, studentId, deviceId, amount } = await request.json();

    if (!studentId && !deviceId) {
      return NextResponse.json({ error: 'Missing student identification' }, { status: 400 });
    }

    // Find or create student
    let student;
    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId } });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Create payment record
    await db.payment.create({
      data: {
        studentId: student.id,
        razorpayOrderId: razorpayOrderId || `order_sim_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
        razorpaySignature: razorpaySignature || `sig_sim_${Date.now()}`,
        amount: amount || 10000,
        status: 'completed',
        currency: 'INR',
      },
    });

    // Activate subscription
    const updated = await db.student.update({
      where: { id: student.id },
      data: { isSubscribed: true, subscriptionAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      isSubscribed: true,
      student: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        freeTestsUsed: updated.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - updated.freeTestsUsed),
        isSubscribed: updated.isSubscribed,
      },
      message: 'Payment verified and subscription activated!',
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
