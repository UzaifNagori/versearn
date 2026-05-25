import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];

    const daily = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [decoded.id, today]
    );

    const user = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [decoded.id]);

    return NextResponse.json({
      daily: daily || { ads_earned: 0, survey_earned: 0, walk_earned: 0, checkin_done: false },
      verse_balance: user?.verse_balance || 0,
    });
  } catch (err) {
    console.error('Daily stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
