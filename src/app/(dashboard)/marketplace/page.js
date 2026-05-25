'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Store, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState(null);
  const [buying, setBuying] = useState(false);
  const perPage = 6;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ search, sort });
    fetch(`/api/nft/marketplace?${params}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => { setListings(data.listings || []); setPage(1); })
      .catch(() => toast.error('Marketplace load nahi ho saka'))
      .finally(() => setLoading(false));
  }, [search, sort]);

  const totalPages = Math.ceil(listings.length / perPage);
  const paginated = listings.slice((page - 1) * perPage, page * perPage);

  const handleBuyClick = useCallback((listing) => {
    if (!listing) return;
    setSelectedListing(listing);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedListing(null), []);

  const confirmBuy = useCallback(async () => {
    if (!selectedListing) return;
    setBuying(true);
    try {
      const res = await fetch('/api/nft/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ listing_id: selectedListing.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('NFT khareed li! 🎉');
      setSelectedListing(null);
      // Remove from list
      setListings((prev) => prev.filter((l) => l.id !== selectedListing.id));
    } catch (err) {
      toast.error(err.message || 'Error aya');
    } finally {
      setBuying(false);
    }
  }, [selectedListing]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">NFT Marketplace</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">{listings.length} listings available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="NFT search karo..."
            className="w-full bg-[#1A1A2E] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-[#1A1A2E] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-xl px-4 py-2.5 text-white text-sm">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><LoadingSpinner size="lg" /></div>
      ) : paginated.length === 0 ? (
        <EmptyState icon={Store} title="Koi listing nahi mili" description="Search change karo ya baad mein wapas aao" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((listing) => (
            <div key={listing.id} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden shadow-lg shadow-purple-900/20 hover:border-[#7C3AED]/50 transition-all group">
              <div className="relative aspect-square overflow-hidden bg-[#0F0F1A]">
                <Image src={listing.nft?.image_url || 'https://picsum.photos/400/400?random=1'} alt={listing.nft?.title || 'NFT'} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-[#F59E0B] text-black text-xs font-bold px-2 py-0.5 rounded-full">Listed</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm truncate mb-1">{listing.nft?.title}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[#F59E0B] font-bold text-sm">⚡ {Number(listing.price).toLocaleString()}</span>
                  <span className="text-[#9CA3AF] text-xs">VERSE</span>
                </div>
                <p className="text-[#9CA3AF] text-xs mb-3">Seller: {listing.seller?.username}</p>
                <button onClick={() => handleBuyClick(listing)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-lg transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Kharido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-[#7C3AED] text-white' : 'bg-[#1A1A2E] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      <Modal isOpen={selectedListing !== null} onClose={handleCloseModal} title="NFT Kharido">
        {selectedListing !== null && (
          <div className="space-y-4">
            <div className="bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm">NFT: <span className="text-white font-medium">{selectedListing.nft?.title}</span></p>
              <p className="text-[#9CA3AF] text-sm mt-1">Seller: <span className="text-white">{selectedListing.seller?.username}</span></p>
              <p className="text-[#9CA3AF] text-sm mt-1">Price: <span className="text-[#F59E0B] font-bold">⚡ {Number(selectedListing.price).toLocaleString()} VERSE</span></p>
            </div>
            <p className="text-[#9CA3AF] text-sm">Kya aap yeh NFT kharidna chahte hain?</p>
            <div className="flex gap-3">
              <button onClick={handleCloseModal} className="flex-1 py-2.5 border border-[#2D2D4E] text-[#9CA3AF] rounded-lg text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={confirmBuy} disabled={buying} className="flex-1 py-2.5 bg-[#F59E0B] text-black font-bold rounded-lg text-sm hover:bg-[#D97706] disabled:opacity-60 transition-colors">
                {buying ? 'Khareed raha hai...' : 'Kharido'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
