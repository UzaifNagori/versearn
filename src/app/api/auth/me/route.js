import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await queryOne(
      'SELECT id, username, email, verse_balance, total_earned, referral_code, wallet_address, is_premium, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json({ error: 'User nahi mila' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
