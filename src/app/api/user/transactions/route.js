import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type') || 'all';
    const limit = 20;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [decoded.id];

    if (type !== 'all') {
      sql += ' AND type LIKE ?';
      params.push(`${type}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const transactions = await query(sql, params);

    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
      [decoded.id]
    );

    return NextResponse.json({
      transactions,
      total: countResult?.total || 0,
      page,
      pages: Math.ceil((countResult?.total || 0) / limit),
    });
  } catch (err) {
    console.error('Transactions error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
