import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await queryOne(
      'SELECT id, username, email, verse_balance, total_earned, referral_code, wallet_address, is_premium, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    const refCount = await queryOne(
      'SELECT COUNT(*) as count FROM users WHERE referred_by = ?',
      [decoded.id]
    );

    const referrals = await query(
      'SELECT id, username, created_at FROM users WHERE referred_by = ? ORDER BY created_at DESC',
      [decoded.id]
    );

    return NextResponse.json({
      user,
      referral_count: refCount?.count || 0,
      referrals,
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { username, wallet_address } = await request.json();

    if (username) {
      const existing = await queryOne(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, decoded.id]
      );
      if (existing) {
        return NextResponse.json({ error: 'Yeh username pehle se le liya gaya hai' }, { status: 409 });
      }
      await query('UPDATE users SET username = ? WHERE id = ?', [username, decoded.id]);
    }

    if (wallet_address !== undefined) {
      await query('UPDATE users SET wallet_address = ? WHERE id = ?', [wallet_address, decoded.id]);
    }

    const user = await queryOne(
      'SELECT id, username, email, verse_balance, total_earned, referral_code, wallet_address FROM users WHERE id = ?',
      [decoded.id]
    );

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Profile PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
