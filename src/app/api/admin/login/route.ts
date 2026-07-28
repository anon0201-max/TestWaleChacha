import { dbConnect } from '@/lib/mongodb';
import { AdminPassword } from '@/models';
import { NextResponse } from 'next/server';

// Auto-create default admin if none exists
async function ensureAdminExists() {
  const count = await AdminPassword.countDocuments();
  if (count === 0) {
    await AdminPassword.create({ username: 'admin', password: 'admin123' });
    console.log('✅ Default admin created: admin/admin123');
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    await ensureAdminExists();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const admin = await AdminPassword.findOne({ username }).lean();
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, username: admin.username });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
