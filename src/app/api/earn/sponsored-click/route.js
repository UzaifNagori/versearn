import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

const VERSE_PER_CLICK = 0.5;    // 0.5 VERSE per click (profit margin rakho)
const DAILY_CLICK_LIMIT = 200;  // 200 clicks/day = 100 VERSE max
const MIN_SECONDS_BETWEEN = 3;  // 3 second gap anti-fraud

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = decoded.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Anti-fraud: check last click time
    const user = await queryOne(
      'SELECT verse_balance, last_ad_watched_at FROM users WHERE id = ?',
      [userId]
    );

    if (user?.last_ad_watched_at) {
      const lastTime = new Date(user.last_ad_watched_at);
      const secondsSince = (now - lastTime) / 1000;
      if (secondsSince < MIN_SECONDS_BETWEEN) {
        return NextResponse.json({
          error: `${Math.ceil(MIN_SECONDS_BETWEEN - secondsSince)} seconds wait karo`
        }, { status: 429 });
      }
    }

    // Check daily limit
    const existing = await queryOne(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    const adsEarned = existing?.ads_earned || 0;

    if (adsEarned >= DAILY_CLICK_LIMIT) {
      return NextResponse.json({
        error: `Aaj ki limit poori ho gayi (${DAILY_CLICK_LIMIT} VERSE)`
      }, { status: 400 });
    }

    // Update last click time
    await query('UPDATE users SET last_ad_watched_at = NOW() WHERE id = ?', [userId]);

    // Update daily limits
    if (existing) {
      await query(
        'UPDATE daily_limits SET ads_earned = ads_earned + ? WHERE user_id = ? AND date = ?',
        [VERSE_PER_CLICK, userId, today]
      );
    } else {
      await query(
        'INSERT INTO daily_limits (user_id, date, ads_earned) VALUES (?, ?, ?)',
        [userId, today, VERSE_PER_CLICK]
      );
    }

    // Credit VERSE
    await query(
      'UPDATE users SET verse_balance = verse_balance + ?, total_earned = total_earned + ? WHERE id = ?',
      [VERSE_PER_CLICK, VERSE_PER_CLICK, userId]
    );

    await query(
      `INSERT INTO transactions (user_id, type, amount, description, status)
       VALUES (?, 'earn_ad', ?, 'Sponsored ad click reward', 'completed')`,
      [userId, VERSE_PER_CLICK]
    );

    const updated = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      verse_earned: VERSE_PER_CLICK,
      new_balance: updated.verse_balance,
      daily_earned: adsEarned + VERSE_PER_CLICK,
      daily_limit: DAILY_CLICK_LIMIT,
      daily_remaining: DAILY_CLICK_LIMIT - (adsEarned + VERSE_PER_CLICK),
    });
  } catch (err) {
    console.error('Sponsored click error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
