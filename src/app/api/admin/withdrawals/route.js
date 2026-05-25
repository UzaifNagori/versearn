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
    const status = searchParams.get('status') || 'all';

    let sql = `
      SELECT w.*, u.username, u.email
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
    `;
    const params = [];

    if (status !== 'all') {
      sql += ' WHERE w.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY w.created_at DESC';

    const withdrawals = await query(sql, params);
    return NextResponse.json({ withdrawals });
  } catch (err) {
    console.error('Admin withdrawals error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded || !isAdmin(decoded)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { id, status, admin_note } = await request.json();

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const withdrawal = await queryOne('SELECT * FROM withdrawals WHERE id = ?', [id]);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal nahi mili' }, { status: 404 });
    }

    await query(
      'UPDATE withdrawals SET status = ?, admin_note = ? WHERE id = ?',
      [status, admin_note || '', id]
    );

    // Agar reject hua to VERSE wapas karo
    if (status === 'rejected') {
      await query(
        'UPDATE users SET verse_balance = verse_balance + ? WHERE id = ?',
        [withdrawal.verse_amount, withdrawal.user_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin withdrawal update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
