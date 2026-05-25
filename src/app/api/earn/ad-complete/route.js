import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

const AD_LIMIT = 50;
const MIN_SECONDS_BETWEEN_ADS = 25; // anti-fraud: minimum 25 seconds

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = decoded.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Anti-fraud: check last ad time
    const user = await queryOne(
      'SELECT verse_balance, last_ad_watched_at FROM users WHERE id = ?',
      [userId]
    );

    if (user?.last_ad_watched_at) {
      const lastAdTime = new Date(user.last_ad_watched_at);
      const secondsSinceLast = (now - lastAdTime) / 1000;
      if (secondsSinceLast < MIN_SECONDS_BETWEEN_ADS) {
        return NextResponse.json({
          error: `Thoda wait karo! ${Math.ceil(MIN_SECONDS_BETWEEN_ADS - secondsSinceLast)} seconds baad try karo.`
        }, { status: 429 });
      }
    }

    // Check daily limit
    const existing = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    const adsEarned = existing?.ads_earned || 0;

    if (adsEarned >= AD_LIMIT) {
      return NextResponse.json({ error: 'Aaj ki ad limit poori ho gayi (50 VERSE)' }, { status: 400 });
    }

    // Update last_ad_watched_at
    await query('UPDATE users SET last_ad_watched_at = NOW() WHERE id = ?', [userId]);

    // Update daily limits
    if (existing) {
      await query(
        'UPDATE daily_limits SET ads_earned = ads_earned + 1 WHERE user_id = ? AND date = ?',
        [userId, today]
      );
    } else {
      await query(
        'INSERT INTO daily_limits (user_id, date, ads_earned) VALUES (?, ?, 1)',
        [userId, today]
      );
    }

    // Credit 1 VERSE
    await query(
      'UPDATE users SET verse_balance = verse_balance + 1, total_earned = total_earned + 1 WHERE id = ?',
      [userId]
    );

    await query(
      `INSERT INTO transactions (user_id, type, amount, description, status)
       VALUES (?, 'earn_ad', 1, 'Ad watch reward', 'completed')`,
      [userId]
    );

    const updatedUser = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      verse_earned: 1,
      new_balance: updatedUser.verse_balance,
      daily_remaining: AD_LIMIT - (adsEarned + 1),
    });
  } catch (err) {
    console.error('Ad complete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
