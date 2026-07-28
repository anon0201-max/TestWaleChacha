import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount, deviceId, studentId } = await request.json();

    if (!deviceId && !studentId) {
      return NextResponse.json({ error: 'deviceId or studentId is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const orderAmount = amount * 100; // Convert ₹100 to paise (₹100 = 10000 paise)

    const order = await razorpay.orders.create({
      amount: orderAmount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        deviceId: deviceId || '',
        studentId: studentId || '',
      },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      key: keyId,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
