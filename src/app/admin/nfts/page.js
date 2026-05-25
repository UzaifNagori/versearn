'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { authHeader } from '@/lib/auth';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/nfts', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setNfts(data.nfts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">All NFTs <span className="text-[#9CA3AF] text-lg font-normal">({nfts.length})</span></h2>

      {nfts.length === 0 ? (
        <p className="text-center text-[#9CA3AF] py-20">Koi NFT nahi mili</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden">
              <div className="relative aspect-square bg-[#0F0F1A]">
                <Image src={nft.image_url || 'https://picsum.photos/400/400?random=1'} alt={nft.title} fill unoptimized className="object-cover" />
                {nft.is_listed && (
                  <div className="absolute top-2 right-2 bg-[#F59E0B] text-black text-xs font-bold px-2 py-0.5 rounded-full">Listed</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white font-medium text-sm truncate">{nft.title}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">Owner: {nft.owner_username}</p>
                {nft.is_listed && nft.list_price && (
                  <p className="text-[#F59E0B] text-xs font-bold mt-1">⚡ {Number(nft.list_price).toLocaleString()} VERSE</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
