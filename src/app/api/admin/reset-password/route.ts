import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing currentPassword or newPassword' }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: 'New password must be at least 4 characters' }, { status: 400 });
    }

    const admin = await db.adminPassword.findUnique({ where: { username: 'admin' } });

    if (!admin || admin.password !== currentPassword) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }

    await db.adminPassword.update({
      where: { username: 'admin' },
      data: { password: newPassword },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Password reset failed' }, { status: 500 });
  }
}
