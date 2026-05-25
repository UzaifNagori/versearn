'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import NFTCard from '@/components/ui/NFTCard';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MyNFTsPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listModal, setListModal] = useState(null);
  const [listPrice, setListPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/nft', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setNfts(data.nfts || []))
      .catch(() => toast.error('NFTs load nahi ho sake'))
      .finally(() => setLoading(false));
  }, []);

  const handleList = (nft) => {
    if (nft.is_listed) {
      // Cancel listing
      setSaving(true);
      fetch(`/api/nft/${nft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ is_listed: false, list_price: null }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { toast.error(data.error); return; }
          setNfts((prev) => prev.map((n) => n.id === nft.id ? { ...n, is_listed: false, list_price: null } : n));
          toast.success('Listing cancel ho gayi');
        })
        .catch(() => toast.error('Error aya'))
        .finally(() => setSaving(false));
    } else {
      setListModal(nft);
      setListPrice('');
    }
  };

  const confirmList = () => {
    if (!listPrice || isNaN(listPrice) || Number(listPrice) <= 0) {
      toast.error('Valid price daalo'); return;
    }
    setSaving(true);
    fetch(`/api/nft/${listModal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ is_listed: true, list_price: Number(listPrice) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setNfts((prev) => prev.map((n) => n.id === listModal.id ? { ...n, is_listed: true, list_price: Number(listPrice) } : n));
        toast.success(`NFT ${Number(listPrice)} VERSE pe list ho gayi!`);
        setListModal(null);
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Meri NFT Collection</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">{nfts.length} NFTs</p>
        </div>
        <Link href="/nft/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Nayi NFT Banao
        </Link>
      </div>

      {nfts.length === 0 ? (
        <EmptyState icon={Plus} title="Koi NFT nahi" description="Apni pehli NFT banao!" actionLabel="NFT Banao" actionHref="/nft/create" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} showActions isOwner onList={handleList} />
          ))}
        </div>
      )}

      <Modal isOpen={!!listModal} onClose={() => setListModal(null)} title="NFT Sale pe Lagao">
        {listModal && (
          <div className="space-y-4">
            <p className="text-[#9CA3AF] text-sm">NFT: <span className="text-white font-medium">{listModal.title}</span></p>
            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Price (VERSE)</label>
              <input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} placeholder="500"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setListModal(null)} className="flex-1 py-2.5 border border-[#2D2D4E] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
              <button onClick={confirmList} disabled={saving}
                className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-lg text-sm disabled:opacity-60">
                {saving ? 'List ho raha hai...' : 'List Karo'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
