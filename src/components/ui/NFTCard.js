'use client';

import Image from 'next/image';
import { ShoppingCart, Tag } from 'lucide-react';

export default function NFTCard({ nft, showActions = true, onList, onBuy, isOwner = false }) {
  return (
    <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden shadow-lg shadow-purple-900/20 hover:border-[#7C3AED]/50 transition-all group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0F0F1A]">
        <Image
          src={nft.image_url}
          alt={nft.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {nft.is_listed && (
          <div className="absolute top-2 right-2 bg-[#F59E0B] text-black text-xs font-bold px-2 py-0.5 rounded-full">
            Listed
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm truncate mb-1">{nft.title}</h3>
        {nft.is_listed && nft.list_price ? (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[#F59E0B] font-bold text-sm">⚡ {nft.list_price}</span>
            <span className="text-[#9CA3AF] text-xs">VERSE</span>
          </div>
        ) : (
          <p className="text-[#9CA3AF] text-xs mb-3">Not listed</p>
        )}

        {showActions && (
          <div className="flex gap-2">
            {isOwner ? (
              nft.is_listed ? (
                <button
                  onClick={() => onList && onList(nft)}
                  className="flex-1 py-1.5 text-xs font-medium border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                >
                  Cancel Listing
                </button>
              ) : (
                <button
                  onClick={() => onList && onList(nft)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  List for Sale
                </button>
              )
            ) : (
              <button
                onClick={() => onBuy && onBuy(nft)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-lg transition-colors font-semibold"
              >
                <ShoppingCart className="w-3 h-3" />
                Kharido
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
