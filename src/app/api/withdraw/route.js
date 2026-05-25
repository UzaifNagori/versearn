import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { method, account_number, wallet_address, verse_amount } = await request.json();
    const userId = decoded.id;

    if (!method || !verse_amount) {
      return NextResponse.json({ error: 'Method aur amount zaruri hain' }, { status: 400 });
    }

    // Minimum check
    const minAmount = method === 'usdt' ? 5000 : 1000;
    if (verse_amount < minAmount) {
      return NextResponse.json({
        error: `Minimum withdrawal: ${minAmount} VERSE`,
      }, { status: 400 });
    }

    // Balance check
    const user = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [userId]);
    if (!user || user.verse_balance < verse_amount) {
      return NextResponse.json({ error: 'Balance kam hai' }, { status: 400 });
    }

    // Pending withdrawal check
    const pending = await queryOne(
      "SELECT id FROM withdrawals WHERE user_id = ? AND status = 'pending'",
      [userId]
    );
    if (pending) {
      return NextResponse.json({ error: 'Pehle se ek pending withdrawal hai' }, { status: 400 });
    }

    const usd_value = verse_amount / 1000;

    // Deduct balance
    await query(
      'UPDATE users SET verse_balance = verse_balance - ? WHERE id = ?',
      [verse_amount, userId]
    );

    // Insert withdrawal
    await query(
      `INSERT INTO withdrawals (user_id, method, account_number, wallet_address, verse_amount, usd_value, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, method, account_number || null, wallet_address || null, verse_amount, usd_value]
    );

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submit ho gayi. 1-3 din mein process hogi.',
    });
  } catch (err) {
    console.error('Withdraw error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const withdrawals = await query(
      'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC',
      [decoded.id]
    );

    return NextResponse.json({ withdrawals });
  } catch (err) {
    console.error('Withdraw GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
