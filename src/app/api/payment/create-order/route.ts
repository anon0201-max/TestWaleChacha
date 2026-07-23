import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Simulated Razorpay order creation (works without actual API keys)
export async function POST(request: Request) {
  try {
    const { amount, deviceId } = await request.json();
    if (!deviceId) return NextResponse.json({ error: 'deviceId required' }, { status: 400 });

    const orderAmount = amount * 100; // Convert to paise
    const orderId = 'order_' + crypto.randomBytes(16).toString('hex');

    // Simulate Razorpay order
    return NextResponse.json({
      id: orderId,
      amount: orderAmount,
      currency: 'INR',
      status: 'created',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_DEMO_KEY',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
