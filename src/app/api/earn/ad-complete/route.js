import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

// Safe rates — aapko milta hai > user ko deta hai
// Monetag se per ad view: ~$0.001-0.005
// User ko dena: 0.5 VERSE = $0.0005 — safe profit
const VERSE_PER_AD = 0.5;
const AD_LIMIT = 100;             // 100 ads/day max
const MIN_SECONDS_BETWEEN_ADS = 25;

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
          error: `${Math.ceil(MIN_SECONDS_BETWEEN_ADS - secondsSinceLast)} seconds baad try karo`
        }, { status: 429 });
      }
    }

    // Check daily limit
    const existing = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    const adsEarned = Number(existing?.ads_earned || 0);

    if (adsEarned >= AD_LIMIT) {
      return NextResponse.json({ error: `Aaj ki ad limit poori ho gayi (${AD_LIMIT} VERSE)` }, { status: 400 });
    }

    await query('UPDATE users SET last_ad_watched_at = NOW() WHERE id = ?', [userId]);

    if (existing) {
      await query(
        'UPDATE daily_limits SET ads_earned = ads_earned + ? WHERE user_id = ? AND date = ?',
        [VERSE_PER_AD, userId, today]
      );
    } else {
      await query(
        'INSERT INTO daily_limits (user_id, date, ads_earned) VALUES (?, ?, ?)',
        [userId, today, VERSE_PER_AD]
      );
    }

    await query(
      'UPDATE users SET verse_balance = verse_balance + ?, total_earned = total_earned + ? WHERE id = ?',
      [VERSE_PER_AD, VERSE_PER_AD, userId]
    );

    await query(
      `INSERT INTO transactions (user_id, type, amount, description, status)
       VALUES (?, 'earn_ad', ?, 'Ad watch reward', 'completed')`,
      [userId, VERSE_PER_AD]
    );

    const updatedUser = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      verse_earned: VERSE_PER_AD,
      new_balance: updatedUser.verse_balance,
      daily_remaining: AD_LIMIT - (adsEarned + VERSE_PER_AD),
    });
  } catch (err) {
    console.error('Ad complete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
