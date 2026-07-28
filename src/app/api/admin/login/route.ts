import { dbConnect } from '@/lib/mongodb';
import { AdminPassword } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();
    const admin = await AdminPassword.findOne({ username }).lean();
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, username: admin.username });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
