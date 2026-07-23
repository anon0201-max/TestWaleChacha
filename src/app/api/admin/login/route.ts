import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const admin = await db.adminPassword.findUnique({ where: { username } });
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, username: admin.username });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
