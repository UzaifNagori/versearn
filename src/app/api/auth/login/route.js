import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email aur password zaruri hain' }, { status: 400 });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return NextResponse.json({ error: 'Email ya password galat hai' }, { status: 401 });
    }

    if (user.is_banned) {
      return NextResponse.json({ error: 'Aapka account ban ho gaya hai' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Email ya password galat hai' }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username, email: user.email });

    // Remove sensitive fields
    const { password_hash, ...safeUser } = user;

    return NextResponse.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
