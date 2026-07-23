import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId } = body;

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    // Simulate subscription activation
    const student = await db.student.upsert({
      where: { deviceId },
      update: {
        isSubscribed: true,
        subscriptionAt: new Date(),
      },
      create: {
        name: 'Pro Student',
        deviceId,
        isSubscribed: true,
        subscriptionAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      isSubscribed: true,
      message: 'Subscription activated successfully! Unlimited tests unlocked.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
