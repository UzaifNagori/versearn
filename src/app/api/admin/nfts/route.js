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

    const nfts = await query(
      `SELECT n.*, u.username as owner_username
       FROM nfts n JOIN users u ON n.owner_id = u.id
       ORDER BY n.created_at DESC`
    );

    return NextResponse.json({ nfts });
  } catch (err) {
    console.error('Admin NFTs error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
