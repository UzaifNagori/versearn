import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = decoded.id;
    const today = new Date().toISOString().split('T')[0];

    // User info
    const user = await queryOne(
      'SELECT id, username, email, verse_balance, total_earned, referral_code FROM users WHERE id = ?',
      [userId]
    );

    // Today's limits
    const dailyLimits = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    // Recent 10 transactions
    const transactions = await query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    // Referral count
    const refResult = await queryOne(
      'SELECT COUNT(*) as count FROM users WHERE referred_by = ?',
      [userId]
    );

    return NextResponse.json({
      user,
      daily: dailyLimits || {
        ads_earned: 0, survey_earned: 0, walk_earned: 0, checkin_done: false
      },
      transactions,
      referral_count: refResult?.count || 0,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
