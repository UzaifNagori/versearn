'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, Zap, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AD_BUTTONS = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11057179';
const CLICK_LIMIT = 500;
const VERSE_PER_CLICK = 0.5;

export default function EarnPage() {
  const [loading, setLoading] = useState(true);
  const [adsEarned, setAdsEarned] = useState(0);
  const [checkinDone, setCheckinDone] = useState(false);
  const [clickedAds, setClickedAds] = useState({});
  const [adLoading, setAdLoading] = useState(null);

  useEffect(() => {
    fetch('/api/earn/daily-stats', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.daily) {
          setAdsEarned(Number(data.daily.ads_earned) || 0);
          setCheckinDone(!!data.daily.checkin_done);
        }
      })
      .catch(() => toast.error('Stats load nahi ho sake'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckin = () => {
    if (checkinDone) return;
    fetch('/api/earn/checkin', { method: 'POST', headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setCheckinDone(true);
        toast.success('+5 VERSE mila! ✅');
      })
      .catch(() => toast.error('Check-in fail ho gaya'));
  };

  const handleAdClick = useCallback((btn) => {
    if (clickedAds[btn.id]) return;
    if (adsEarned >= CLICK_LIMIT) { toast.error('Aaj ki limit poori ho gayi!'); return; }

    setAdLoading(btn.id);
    fetch('/api/earn/ad-complete', { method: 'POST', headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setAdsEarned((prev) => prev + VERSE_PER_CLICK);
        setClickedAds((prev) => ({ ...prev, [btn.id]: true }));
        toast.success(`+${VERSE_PER_CLICK} VERSE mila! 🎉`);
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setAdLoading(null));
  }, [clickedAds, adsEarned]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  );

  const clicksDone = Object.keys(clickedAds).length;
  const totalVerse = (clicksDone * VERSE_PER_CLICK).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-[#7C3AED]">{clicksDone}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">Aaj ke Clicks</p>
        </div>
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-[#F59E0B]">{totalVerse}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">VERSE Kamaye</p>
        </div>
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-[#10B981]">{CLICK_LIMIT - clicksDone}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">Clicks Baaki</p>
        </div>
      </div>

      {/* Click & Earn Grid */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Click & Earn</h2>
            <p className="text-[#9CA3AF] text-sm">Har click = {VERSE_PER_CLICK} VERSE · Sponsored ads</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
            <span>{adsEarned} VERSE earned</span>
            <span>{CLICK_LIMIT} max</span>
          </div>
          <div className="h-2 bg-[#0F0F1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-full transition-all"
              style={{ width: `${Math.min(100, (adsEarned / CLICK_LIMIT) * 100)}%` }}
            />
          </div>
        </div>

        {adsEarned >= CLICK_LIMIT ? (
          <div className="text-center py-8 bg-[#0F0F1A] rounded-xl border border-[#2D2D4E]">
            <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
            <p className="text-[#10B981] font-bold text-lg">Aaj ki limit poori! ✅</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Kal wapas aao — {CLICK_LIMIT} aur clicks milenge</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {AD_BUTTONS.map((btn) => {
              const isClicked = !!clickedAds[btn.id];
              const isLoading = adLoading === btn.id;
              return (
                <a
                  key={btn.id}
                  href={isClicked ? undefined : MONETAG_DIRECT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (isClicked) { e.preventDefault(); return; }
                    if (adsEarned >= CLICK_LIMIT) { e.preventDefault(); toast.error('Limit poori!'); return; }
                    handleAdClick(btn);
                  }}
                  className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all border-2 ${
                    isClicked
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED]/50 text-[#A78BFA] cursor-default'
                      : 'bg-[#0F0F1A] border-[#2D2D4E] text-[#6B7280] hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 cursor-pointer active:scale-95'
                  } transition-transform`}
                >
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : isClicked ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    btn.id
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Check-in */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-white font-bold">Daily Check-in</h2>
              <p className="text-[#9CA3AF] text-sm">Roz aao aur bonus pao</p>
            </div>
          </div>
          <button
            onClick={handleCheckin}
            disabled={checkinDone}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              checkinDone
                ? 'bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] cursor-default'
                : 'bg-[#F59E0B] hover:bg-[#D97706] text-black active:scale-95'
            }`}
          >
            {checkinDone ? '✓ +5 VERSE Done' : '+5 VERSE Lao'}
          </button>
        </div>
      </div>

    </div>
  );
}
