'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Tag, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NFTDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [nft, setNft] = useState(null);
  const [listing, setListing] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listModal, setListModal] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/nft/${id}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); router.push('/nft'); return; }
        setNft(data.nft);
        setListing(data.listing);
        setIsOwner(data.isOwner);
      })
      .catch(() => toast.error('NFT load nahi ho saki'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleList = () => {
    if (!listPrice || Number(listPrice) <= 0) { toast.error('Valid price daalo'); return; }
    setSaving(true);
    fetch(`/api/nft/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ is_listed: true, list_price: Number(listPrice) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setNft(data.nft);
        setListModal(false);
        toast.success('NFT list ho gayi!');
        // Refresh listing
        return fetch(`/api/nft/${id}`, { headers: authHeader() }).then((r) => r.json()).then((d) => setListing(d.listing));
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setSaving(false));
  };

  const handleCancelListing = () => {
    setSaving(true);
    fetch(`/api/nft/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ is_listed: false, list_price: null }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setNft(data.nft);
        setListing(null);
        toast.success('Listing cancel ho gayi');
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setSaving(false));
  };

  const handleBuy = () => {
    if (!listing) return;
    setSaving(true);
    fetch('/api/nft/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ listing_id: listing.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        toast.success('NFT khareed li! 🎉');
        router.push('/nft');
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  if (!nft) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/nft" className="flex items-center gap-2 text-[#9CA3AF] hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Wapas Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1A1A2E] border border-[#2D2D4E]">
          <Image src={nft.image_url || 'https://picsum.photos/400/400?random=1'} alt={nft.title} fill unoptimized className="object-cover" />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5">
            <h2 className="text-2xl font-bold text-white mb-1">{nft.title}</h2>
            <p className="text-[#9CA3AF] text-sm mb-3">{nft.description}</p>
            <p className="text-[#9CA3AF] text-xs">Owner: <span className="text-white">{nft.owner_username}</span></p>
            {nft.is_listed && listing && (
              <div className="mt-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                <p className="text-[#F59E0B] font-black text-2xl">⚡ {listing.price} VERSE</p>
                <p className="text-[#9CA3AF] text-xs mt-1">≈ ${(listing.price * 0.001).toFixed(2)} USD</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isOwner ? (
              nft.is_listed ? (
                <button onClick={handleCancelListing} disabled={saving}
                  className="w-full py-3 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  <X className="w-4 h-4" />
                  {saving ? 'Cancel ho raha hai...' : 'Listing Cancel Karo'}
                </button>
              ) : (
                <button onClick={() => setListModal(true)}
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Tag className="w-4 h-4" />
                  Sale pe Lagao
                </button>
              )
            ) : (
              nft.is_listed && listing && (
                <button onClick={handleBuy} disabled={saving}
                  className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  <ShoppingCart className="w-4 h-4" />
                  {saving ? 'Khareed raha hai...' : `Kharido (${listing.price} VERSE)`}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* List Modal */}
      <Modal isOpen={listModal} onClose={() => setListModal(false)} title="NFT Sale pe Lagao">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Price (VERSE)</label>
            <input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} placeholder="500"
              className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setListModal(false)} className="flex-1 py-2.5 border border-[#2D2D4E] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
            <button onClick={handleList} disabled={saving}
              className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-lg text-sm disabled:opacity-60">
              {saving ? 'List ho raha hai...' : 'List Karo'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
