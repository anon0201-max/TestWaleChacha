import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { AdminPassword } from '@/models';

async function ensureAdminExists() {
  const count = await AdminPassword.countDocuments();
  if (count === 0) {
    await AdminPassword.create({
      username: 'admin',
      password: 'admin123',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await ensureAdminExists();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await AdminPassword.findOne({ username }).lean();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}