import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const nft = await queryOne(
      `SELECT n.*, u.username as owner_username
       FROM nfts n JOIN users u ON n.owner_id = u.id
       WHERE n.id = ?`,
      [id]
    );

    if (!nft) return NextResponse.json({ error: 'NFT nahi mili' }, { status: 404 });

    // Active listing info
    const listing = await queryOne(
      "SELECT * FROM marketplace_listings WHERE nft_id = ? AND status = 'active'",
      [id]
    );

    return NextResponse.json({ nft, listing: listing || null, isOwner: nft.owner_id === decoded.id });
  } catch (err) {
    console.error('NFT GET[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const nft = await queryOne('SELECT * FROM nfts WHERE id = ? AND owner_id = ?', [id, decoded.id]);
    if (!nft) return NextResponse.json({ error: 'NFT nahi mili ya aap owner nahi' }, { status: 404 });

    const { is_listed, list_price } = await request.json();

    await query('UPDATE nfts SET is_listed = ?, list_price = ? WHERE id = ?', [is_listed ? 1 : 0, list_price || null, id]);

    if (is_listed && list_price) {
      // Cancel old listing first
      await query("UPDATE marketplace_listings SET status = 'cancelled' WHERE nft_id = ? AND status = 'active'", [id]);
      // New listing
      await query(
        "INSERT INTO marketplace_listings (nft_id, seller_id, price, status) VALUES (?, ?, ?, 'active')",
        [id, decoded.id, list_price]
      );
    } else {
      await query("UPDATE marketplace_listings SET status = 'cancelled' WHERE nft_id = ? AND status = 'active'", [id]);
    }

    const updated = await queryOne('SELECT * FROM nfts WHERE id = ?', [id]);
    return NextResponse.json({ nft: updated });
  } catch (err) {
    console.error('NFT PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
