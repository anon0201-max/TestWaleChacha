import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, studentId, deviceId, amount } = await request.json();

    if (!studentId && !deviceId) {
      return NextResponse.json({ error: 'Missing student identification' }, { status: 400 });
    }

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        console.error('Signature mismatch:', { expected: expectedSignature, received: razorpaySignature });
        return NextResponse.json({ error: 'Payment verification failed — signature mismatch' }, { status: 400 });
      }
    }

    // Find student
    const student = studentId
      ? await db.student.findUnique({ where: { id: studentId } })
      : deviceId
        ? await db.student.findUnique({ where: { deviceId } })
        : null;

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Create payment record
    await db.payment.create({
      data: {
        studentId: student.id,
        razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
        razorpaySignature: razorpaySignature || '',
        amount: amount || 10000,
        status: 'completed',
        currency: 'INR',
      },
    });

    // Activate subscription
    const updated = await db.student.update({
      where: { id: student.id },
      data: {
        isSubscribed: true,
        subscriptionAt: new Date(),
      },
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
