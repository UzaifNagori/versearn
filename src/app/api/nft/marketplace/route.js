import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';

    let sql = `
      SELECT ml.id as listing_id, ml.price, ml.created_at,
             n.id as nft_id, n.title, n.description, n.image_url,
             u.id as seller_id, u.username as seller_username
      FROM marketplace_listings ml
      JOIN nfts n ON ml.nft_id = n.id
      JOIN users u ON ml.seller_id = u.id
      WHERE ml.status = 'active'
    `;
    const params = [];

    if (search) {
      sql += ' AND n.title LIKE ?';
      params.push(`%${search}%`);
    }

    if (sort === 'price_asc') sql += ' ORDER BY ml.price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY ml.price DESC';
    else sql += ' ORDER BY ml.created_at DESC';

    const rows = await query(sql, params);

    const listings = rows.map((r) => ({
      id: r.listing_id,
      price: r.price,
      created_at: r.created_at,
      nft: { id: r.nft_id, title: r.title, description: r.description, image_url: r.image_url },
      seller: { id: r.seller_id, username: r.seller_username },
    }));

    return NextResponse.json({ listings });
  } catch (err) {
    console.error('Marketplace error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
