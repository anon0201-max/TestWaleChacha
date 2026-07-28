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
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    return NextResponse.json({ success: true, username: admin.username });
  } catch (error: any) {
    console.error('Admin login error:', error);
    const msg = error?.message || 'Unknown error';
    if (msg.includes('MONGODB_URI')) {
      return NextResponse.json({ error: 'Database not configured. Please set MONGODB_URI in Vercel environment variables.' }, { status: 500 });
    }
    if (msg.includes('connection') || msg.includes('ENOTFOUND') || msg.includes('timed out')) {
      return NextResponse.json({ error: 'Cannot connect to database. Check MONGODB_URI and MongoDB Atlas IP whitelist.' }, { status: 500 });
    }
    if (msg.includes('authentication')) {
      return NextResponse.json({ error: 'Database authentication failed. Check your MongoDB credentials.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Login failed: ' + msg }, { status: 500 });
  }
}
