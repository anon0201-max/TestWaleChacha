import { dbConnect } from '@/lib/mongodb';
import { Student } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, deviceId } = body;

    if (!studentId && !deviceId) {
      return NextResponse.json({ error: 'studentId or deviceId is required' }, { status: 400 });
    }

    // Find student
    const student = studentId
      ? await Student.findOne({ id: studentId })
      : deviceId
        ? await Student.findOne({ deviceId })
        : null;

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Activate subscription
    const updated = await Student.findOneAndUpdate(
      { id: student.id },
      {
        isSubscribed: true,
        subscriptionAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      isSubscribed: true,
      student: {
        id: updated!.id,
        name: updated!.name,
        email: updated!.email,
        freeTestsUsed: updated!.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - updated!.freeTestsUsed),
        isSubscribed: updated!.isSubscribed,
        subscriptionAt: updated!.subscriptionAt,
      },
      message: 'Subscription activated successfully! Unlimited tests unlocked.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
