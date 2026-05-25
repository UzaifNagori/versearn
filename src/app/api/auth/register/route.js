import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';
import { signToken } from '@/lib/jwt';

function generateReferralCode(username) {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return (username.substring(0, 4) + rand).toUpperCase();
}

export async function POST(request) {
  try {
    const { username, email, password, referral_code } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Sab fields zaruri hain' }, { status: 400 });
    }

    // Check duplicate
    const existing = await queryOne(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing) {
      return NextResponse.json({ error: 'Email ya username pehle se exist karta hai' }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const myReferralCode = generateReferralCode(username);

    // Check referrer
    let referredBy = null;
    if (referral_code) {
      const referrer = await queryOne('SELECT id FROM users WHERE referral_code = ?', [referral_code]);
      if (referrer) referredBy = referrer.id;
    }

    // Insert user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, referral_code, referred_by)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashed, myReferralCode, referredBy]
    );
    const userId = result.insertId;

    // Credit referrer 50 VERSE
    if (referredBy) {
      await query('UPDATE users SET verse_balance = verse_balance + 50, total_earned = total_earned + 50 WHERE id = ?', [referredBy]);
      await query(
        `INSERT INTO transactions (user_id, type, amount, description, status)
         VALUES (?, 'earn_referral', 50, ?, 'completed')`,
        [referredBy, `Referral bonus: ${username} joined`]
      );
    }

    const user = await queryOne('SELECT id, username, email, verse_balance, referral_code FROM users WHERE id = ?', [userId]);
    const token = signToken({ id: userId, username, email });

    return NextResponse.json({ token, user }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
