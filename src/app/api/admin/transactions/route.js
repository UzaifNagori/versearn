import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await queryOne('SELECT is_admin FROM users WHERE id = ?', [decoded.id]);
    if (!adminUser?.is_admin && decoded.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const offset = (page - 1) * limit;

    let sql = `SELECT t.*, u.username FROM transactions t JOIN users u ON t.user_id = u.id`;
    const params = [];

    if (type !== 'all') {
      sql += ' WHERE t.type LIKE ?';
      params.push(`${type}%`);
    }

    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const transactions = await query(sql, params);
    return NextResponse.json({ transactions });
  } catch (err) {
    console.error('Admin transactions error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
