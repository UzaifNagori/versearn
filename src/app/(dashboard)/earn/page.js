'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Tv, Calendar, ClipboardList, Footprints, CheckCircle, Play, Smartphone, MousePointerClick, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MOCK_SURVEYS = [
  { id: 's1', title: 'Tech Products Usage Survey', reward: 25, estimated_minutes: 5, category: 'Technology' },
  { id: 's2', title: 'Online Shopping Habits', reward: 50, estimated_minutes: 10, category: 'E-Commerce' },
  { id: 's3', title: 'Mobile App Preferences', reward: 10, estimated_minutes: 3, category: 'Mobile' },
];

// Sponsored links — yeh click karne pe ad new tab mein khulega + VERSE milega
const SPONSORED_LINKS = [
  { id: 1, title: 'Daraz Pakistan Deals', description: 'Best online shopping deals', emoji: '🛒', url: 'https://daraz.pk' },
  { id: 2, title: 'Jazz Cash Offer', description: 'Mobile banking rewards', emoji: '💳', url: 'https://jazzcash.com.pk' },
  { id: 3, title: 'Easypaisa Cashback', description: 'Get cashback on payments', emoji: '💰', url: 'https://easypaisa.com.pk' },
  { id: 4, title: 'OLX Pakistan', description: 'Buy & sell anything', emoji: '📦', url: 'https://olx.com.pk' },
  { id: 5, title: 'Foodpanda Discount', description: 'Food delivery deals', emoji: '🍔', url: 'https://foodpanda.pk' },
];

const AD_LIMIT = 50;
const CLICK_LIMIT = 20;

export default function EarnPage() {
  const [loading, setLoading] = useState(true);
  const [adsEarned, setAdsEarned] = useState(0);
  const [surveyEarned, setSurveyEarned] = useState(0);
  const [checkinDone, setCheckinDone] = useState(false);
  const [adWatching, setAdWatching] = useState(false);
  const [adTimer, setAdTimer] = useState(30);
  const [adDone, setAdDone] = useState(false);
  const [surveyModal, setSurveyModal] = useState(null);
  const [clickEarned, setClickEarned] = useState(0);
  const [clickLoading, setClickLoading] = useState(null);
  const [clickedLinks, setClickedLinks] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/earn/daily-stats', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.daily) {
          setAdsEarned(data.daily.ads_earned || 0);
          setSurveyEarned(data.daily.survey_earned || 0);
          setCheckinDone(!!data.daily.checkin_done);
        }
      })
      .catch(() => toast.error('Stats load nahi ho sake'))
      .finally(() => setLoading(false));
  }, []);

  const startAd = () => {
    if (adsEarned >= AD_LIMIT) { toast.error('Aaj ki ad limit poori ho gayi!'); return; }
    setAdWatching(true);
    setAdTimer(30);
    setAdDone(false);
  };

  useEffect(() => {
    if (adWatching && adTimer > 0) {
      timerRef.current = setTimeout(() => setAdTimer((t) => t - 1), 1000);
    } else if (adWatching && adTimer === 0) {
      setAdWatching(false);
      fetch('/api/earn/ad-complete', { method: 'POST', headers: authHeader() })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { toast.error(data.error); return; }
          setAdDone(true);
          setAdsEarned((prev) => prev + 1);
          toast.success('+1 VERSE mila! 🎉');
        })
        .catch(() => toast.error('Ad complete nahi ho saka'));
    }
    return () => clearTimeout(timerRef.current);
  }, [adWatching, adTimer]);

  const handleCheckin = () => {
    if (checkinDone) return;
    fetch('/api/earn/checkin', { method: 'POST', headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setCheckinDone(true);
        toast.success('+5 VERSE mila! Aaj ka check-in ho gaya ✅');
      })
      .catch(() => toast.error('Check-in fail ho gaya'));
  };

  const handleSurveyComplete = () => {
    if (!surveyModal) return;
    toast.success(`+${surveyModal.reward} VERSE mila! Survey complete! 🎉`);
    setSurveyModal(null);
  };

  // Sponsored link click handler
  const handleSponsoredClick = useCallback((link) => {
    if (clickEarned >= CLICK_LIMIT) {
      toast.error('Aaj ki click limit poori ho gayi!');
      return;
    }
    if (clickedLinks[link.id]) {
      toast.error('Yeh link aaj pehle click kar chuke ho');
      return;
    }

    // PEHLE window open karo — user gesture pe hona chahiye
    // Popup blocker bypass hoga
    window.open(link.url, '_blank');

    // PHIR backend call karo VERSE credit ke liye
    setClickLoading(link.id);
    fetch('/api/earn/sponsored-click', {
      method: 'POST',
      headers: authHeader(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          toast.error(data.error || 'Error aya');
          return;
        }
        setClickEarned(data.daily_earned);
        setClickedLinks((prev) => ({ ...prev, [link.id]: true }));
        toast.success(`+1 VERSE mila! 🎉 (${data.daily_remaining} clicks baaki)`);
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setClickLoading(null));
  }, [clickEarned, clickedLinks]);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Sponsored Links — Click to Earn */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Sponsored Links</h2>
            <p className="text-[#9CA3AF] text-sm">Har link click = 1 VERSE</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#F59E0B] font-bold">{clickEarned}/{CLICK_LIMIT}</p>
            <p className="text-[#9CA3AF] text-xs">VERSE aaj</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-[#0F0F1A] rounded-full overflow-hidden">
            <div className="h-full bg-[#F59E0B] rounded-full transition-all"
              style={{ width: `${Math.min(100, (clickEarned / CLICK_LIMIT) * 100)}%` }} />
          </div>
        </div>

        {clickEarned >= CLICK_LIMIT ? (
          <div className="text-center py-4 bg-[#0F0F1A] rounded-xl border border-[#2D2D4E]">
            <p className="text-[#10B981] font-bold">Aaj ki limit poori ho gayi! ✅</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Kal wapas aao aur aur VERSE kamao</p>
          </div>
        ) : (
          <div className="space-y-2">
            {SPONSORED_LINKS.map((link) => {
              const isClicked = !!clickedLinks[link.id];
              const isLoading = clickLoading === link.id;
              return (
                <div key={link.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isClicked
                      ? 'bg-[#10B981]/5 border-[#10B981]/20 opacity-60'
                      : 'bg-[#0F0F1A] border-[#2D2D4E] hover:border-[#F59E0B]/40'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{link.emoji}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{link.title}</p>
                      <p className="text-[#9CA3AF] text-xs">{link.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F59E0B] font-bold text-sm">+1 VERSE</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (isClicked || isLoading || clickEarned >= CLICK_LIMIT) {
                          e.preventDefault();
                          if (clickEarned >= CLICK_LIMIT) toast.error('Aaj ki limit poori ho gayi!');
                          return;
                        }
                        // Real anchor click — Monetag OnClick trigger hoga
                        setClickLoading(link.id);
                        fetch('/api/earn/sponsored-click', {
                          method: 'POST',
                          headers: authHeader(),
                        })
                          .then((r) => r.json())
                          .then((data) => {
                            if (!data.success) { toast.error(data.error || 'Error'); return; }
                            setClickEarned(data.daily_earned);
                            setClickedLinks((prev) => ({ ...prev, [link.id]: true }));
                            toast.success(`+1 VERSE mila! 🎉`);
                          })
                          .catch(() => toast.error('Error aya'))
                          .finally(() => setClickLoading(null));
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isClicked
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 pointer-events-none'
                          : 'bg-[#F59E0B] hover:bg-[#D97706] text-black'
                      }`}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : isClicked ? (
                        <><CheckCircle className="w-3 h-3" />Done</>
                      ) : (
                        <><ExternalLink className="w-3 h-3" />Visit</>
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Watch Ads */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
            <Tv className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Watch Ads</h2>
            <p className="text-[#9CA3AF] text-sm">Har ad = 1 VERSE</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#F59E0B] font-bold">{adsEarned}/{AD_LIMIT}</p>
            <p className="text-[#9CA3AF] text-xs">VERSE aaj</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-[#2D2D4E] rounded-xl h-48 flex items-center justify-center mb-4 bg-[#0F0F1A]">
          {adWatching ? (
            <div className="text-center">
              <div className="text-4xl mb-2">📺</div>
              <p className="text-white font-medium">Ad chal raha hai...</p>
              <p className="text-[#F59E0B] text-2xl font-black mt-2">{adTimer}s</p>
            </div>
          ) : adDone ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-2" />
              <p className="text-[#10B981] font-bold">+1 VERSE mila!</p>
            </div>
          ) : (
            <div className="text-center text-[#9CA3AF]">
              <Tv className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Ad yahan dikhega</p>
            </div>
          )}
        </div>
        {adWatching && (
          <div className="mb-4">
            <div className="h-2 bg-[#0F0F1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#7C3AED] rounded-full transition-all duration-1000"
                style={{ width: `${((30 - adTimer) / 30) * 100}%` }} />
            </div>
          </div>
        )}
        <button onClick={startAd} disabled={adWatching || adsEarned >= AD_LIMIT}
          className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
          <Play className="w-4 h-4" />
          {adWatching ? `${adTimer}s baad VERSE milega...` : adsEarned >= AD_LIMIT ? 'Limit poori ho gayi' : 'Ad Dekho (+1 VERSE)'}
        </button>
      </div>

      {/* Daily Check-in */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Daily Check-in</h2>
            <p className="text-[#9CA3AF] text-sm">Roz check-in karo aur bonus pao</p>
          </div>
        </div>
        <div className="text-center py-4">
          <Calendar className="w-16 h-16 mx-auto mb-3 text-[#F59E0B]" />
          {checkinDone ? (
            <div>
              <p className="text-[#10B981] font-bold text-lg">Aaj ka check-in ho gaya! ✅</p>
              <p className="text-[#9CA3AF] text-sm mt-1">+5 VERSE mila</p>
            </div>
          ) : (
            <p className="text-white font-medium">Aaj ka check-in karo aur 5 VERSE pao!</p>
          )}
        </div>
        <button onClick={handleCheckin} disabled={checkinDone}
          className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors">
          {checkinDone ? 'Check-in Ho Gaya ✓' : 'Check-in Karo (+5 VERSE)'}
        </button>
      </div>

      {/* Surveys */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Surveys</h2>
            <p className="text-[#9CA3AF] text-sm">Survey karo aur zyada VERSE kamao</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#3B82F6] font-bold">{surveyEarned}/200</p>
            <p className="text-[#9CA3AF] text-xs">VERSE aaj</p>
          </div>
        </div>
        <div className="space-y-3">
          {MOCK_SURVEYS.map((survey) => (
            <div key={survey.id} className="flex items-center justify-between bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl p-4">
              <div>
                <p className="text-white font-medium text-sm">{survey.title}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{survey.category} · ~{survey.estimated_minutes} min</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#F59E0B] font-bold text-sm">+{survey.reward} VERSE</span>
                <button onClick={() => setSurveyModal(survey)}
                  className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg transition-colors">
                  Shuru Karo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walk to Earn */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
            <Footprints className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Walk to Earn</h2>
            <p className="text-[#9CA3AF] text-sm">Chalo aur VERSE kamao</p>
          </div>
        </div>
        <div className="bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl p-5 text-center">
          <Smartphone className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
          <p className="text-white font-semibold mb-2">Mobile App mein Available</p>
          <p className="text-[#9CA3AF] text-sm mb-4">1,000 steps = 10 VERSE · Max 100 VERSE/day</p>
          <button disabled className="w-full py-3 bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] font-medium rounded-lg cursor-not-allowed opacity-60">
            App Download Karo (Coming Soon)
          </button>
        </div>
      </div>

      {/* Survey Modal */}
      <Modal isOpen={!!surveyModal} onClose={() => setSurveyModal(null)} title={surveyModal?.title || ''}>
        {surveyModal && (
          <div className="space-y-4">
            <div className="bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-sm">Reward: <span className="text-[#F59E0B] font-bold">+{surveyModal.reward} VERSE</span></p>
              <p className="text-[#9CA3AF] text-sm mt-1">Estimated time: ~{surveyModal.estimated_minutes} minutes</p>
            </div>
            <p className="text-[#9CA3AF] text-sm">Yeh ek mock survey hai. Real surveys CPX Research se aayenge.</p>
            <button onClick={handleSurveyComplete}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition-colors">
              Survey Submit Karo (+{surveyModal?.reward} VERSE)
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
