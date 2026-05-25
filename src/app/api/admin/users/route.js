import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

function isAdmin(decoded) {
  return decoded?.email === process.env.ADMIN_EMAIL;
}

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded || !isAdmin(decoded)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = 'SELECT id, username, email, verse_balance, total_earned, is_banned, created_at FROM users';
    const params = [];

    if (search) {
      sql += ' WHERE username LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT 100';

    const users = await query(sql, params);
    return NextResponse.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded || !isAdmin(decoded)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { id, is_banned } = await request.json();

    await query('UPDATE users SET is_banned = ? WHERE id = ?', [is_banned ? 1 : 0, id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin ban error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
