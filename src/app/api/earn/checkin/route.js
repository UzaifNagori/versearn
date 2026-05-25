import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = decoded.id;
    const today = new Date().toISOString().split('T')[0];

    // Check already done
    const existing = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (existing?.checkin_done) {
      return NextResponse.json({ error: 'Aaj ka check-in pehle ho chuka hai' }, { status: 400 });
    }

    // Insert or update daily_limits
    if (existing) {
      await query(
        'UPDATE daily_limits SET checkin_done = true WHERE user_id = ? AND date = ?',
        [userId, today]
      );
    } else {
      await query(
        'INSERT INTO daily_limits (user_id, date, checkin_done) VALUES (?, ?, true)',
        [userId, today]
      );
    }

    // Credit 5 VERSE
    await query(
      'UPDATE users SET verse_balance = verse_balance + 5, total_earned = total_earned + 5 WHERE id = ?',
      [userId]
    );

    await query(
      `INSERT INTO transactions (user_id, type, amount, description, status)
       VALUES (?, 'earn_checkin', 5, 'Daily check-in bonus', 'completed')`,
      [userId]
    );

    const user = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      verse_earned: 5,
      new_balance: user.verse_balance,
    });
  } catch (err) {
    console.error('Checkin error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
