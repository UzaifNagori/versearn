import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const nfts = await query(
      'SELECT * FROM nfts WHERE owner_id = ? ORDER BY created_at DESC',
      [decoded.id]
    );

    return NextResponse.json({ nfts });
  } catch (err) {
    console.error('NFT GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, image_url } = await request.json();
    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title aur image zaruri hain' }, { status: 400 });
    }

    // Deduct 10 VERSE for minting
    const user = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [decoded.id]);
    if (!user || user.verse_balance < 10) {
      return NextResponse.json({ error: 'Insufficient balance (10 VERSE chahiye)' }, { status: 400 });
    }

    await query('UPDATE users SET verse_balance = verse_balance - 10 WHERE id = ?', [decoded.id]);

    const result = await query(
      `INSERT INTO nfts (owner_id, title, description, image_url, is_minted, is_listed)
       VALUES (?, ?, ?, ?, true, false)`,
      [decoded.id, title, description || '', image_url]
    );

    await query(
      `INSERT INTO transactions (user_id, type, amount, description, status)
       VALUES (?, 'nft_mint', -10, ?, 'completed')`,
      [decoded.id, `NFT minted: ${title}`]
    );

    const nft = await queryOne('SELECT * FROM nfts WHERE id = ?', [result.insertId]);
    return NextResponse.json({ nft }, { status: 201 });
  } catch (err) {
    console.error('NFT POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
