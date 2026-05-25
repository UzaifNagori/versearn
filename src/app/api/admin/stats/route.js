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

    const today = new Date().toISOString().split('T')[0];

    const [totalUsers, verseCirculation, dailyActive, pendingWithdrawals] = await Promise.all([
      queryOne('SELECT COUNT(*) as count FROM users'),
      queryOne('SELECT SUM(verse_balance) as total FROM users'),
      queryOne('SELECT COUNT(DISTINCT user_id) as count FROM transactions WHERE DATE(created_at) = ?', [today]),
      queryOne("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'"),
    ]);

    // Last 7 days new users
    const dailyNewUsers = await query(
      `SELECT DATE(created_at) as day, COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY day ASC`
    );

    // Recent 10 transactions
    const recentTransactions = await query(
      `SELECT t.*, u.username FROM transactions t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC LIMIT 10`
    );

    return NextResponse.json({
      total_users: totalUsers?.count || 0,
      total_verse_circulation: verseCirculation?.total || 0,
      daily_active: dailyActive?.count || 0,
      pending_withdrawals: pendingWithdrawals?.count || 0,
      daily_new_users: dailyNewUsers,
      recent_transactions: recentTransactions,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
