import { NextResponse } from 'next/server';
import { query, queryOne, withTransaction } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

export async function POST(request) {
  try {
    const decoded = getCurrentUser(request);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { listing_id } = await request.json();
    if (!listing_id) return NextResponse.json({ error: 'listing_id zaruri hai' }, { status: 400 });

    const listing = await queryOne(
      "SELECT ml.*, n.title FROM marketplace_listings ml JOIN nfts n ON ml.nft_id = n.id WHERE ml.id = ? AND ml.status = 'active'",
      [listing_id]
    );
    if (!listing) return NextResponse.json({ error: 'Listing nahi mili ya sold ho chuki hai' }, { status: 404 });

    if (listing.seller_id === decoded.id) {
      return NextResponse.json({ error: 'Apni khud ki NFT nahi khareed sakte' }, { status: 400 });
    }

    const buyer = await queryOne('SELECT verse_balance FROM users WHERE id = ?', [decoded.id]);
    if (!buyer || buyer.verse_balance < listing.price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const platformFee = Math.floor(listing.price * 0.075);
    const sellerAmount = listing.price - platformFee;

    await withTransaction(async (conn) => {
      // Deduct from buyer
      await conn.execute('UPDATE users SET verse_balance = verse_balance - ? WHERE id = ?', [listing.price, decoded.id]);
      // Credit seller
      await conn.execute('UPDATE users SET verse_balance = verse_balance + ?, total_earned = total_earned + ? WHERE id = ?', [sellerAmount, sellerAmount, listing.seller_id]);
      // Transfer NFT ownership
      await conn.execute('UPDATE nfts SET owner_id = ?, is_listed = false, list_price = NULL WHERE id = ?', [decoded.id, listing.nft_id]);
      // Mark listing sold
      await conn.execute("UPDATE marketplace_listings SET status = 'sold' WHERE id = ?", [listing_id]);
      // Buyer transaction
      await conn.execute(
        "INSERT INTO transactions (user_id, type, amount, description, status) VALUES (?, 'nft_purchase', ?, ?, 'completed')",
        [decoded.id, -listing.price, `NFT purchased: ${listing.title}`]
      );
      // Seller transaction
      await conn.execute(
        "INSERT INTO transactions (user_id, type, amount, description, status) VALUES (?, 'nft_sale', ?, ?, 'completed')",
        [listing.seller_id, sellerAmount, `NFT sold: ${listing.title}`]
      );
    });

    return NextResponse.json({ success: true, message: 'NFT khareed li!' });
  } catch (err) {
    console.error('NFT buy error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
