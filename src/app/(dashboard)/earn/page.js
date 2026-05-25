'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, ClipboardList, Footprints, CheckCircle, Smartphone, MousePointerClick, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MOCK_SURVEYS = [
  { id: 's1', title: 'Tech Products Usage Survey', reward: 25, estimated_minutes: 5, category: 'Technology' },
  { id: 's2', title: 'Online Shopping Habits', reward: 50, estimated_minutes: 10, category: 'E-Commerce' },
  { id: 's3', title: 'Mobile App Preferences', reward: 10, estimated_minutes: 3, category: 'Mobile' },
];

// 50 ad buttons — each opens Monetag Direct Link
const AD_BUTTONS = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11057179';

const CLICK_LIMIT = 500;

export default function EarnPage() {
  const [loading, setLoading] = useState(true);
  const [adsEarned, setAdsEarned] = useState(0);
  const [surveyEarned, setSurveyEarned] = useState(0);
  const [checkinDone, setCheckinDone] = useState(false);
  const [surveyModal, setSurveyModal] = useState(null);
  const [clickedAds, setClickedAds] = useState({});
  const [adLoading, setAdLoading] = useState(null);

  useEffect(() => {
    fetch('/api/earn/daily-stats', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.daily) {
          setAdsEarned(Number(data.daily.ads_earned) || 0);
          setSurveyEarned(Number(data.daily.survey_earned) || 0);
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

  const handleSurveyComplete = () => {
    if (!surveyModal) return;
    toast.success(`+${surveyModal.reward} VERSE mila! 🎉`);
    setSurveyModal(null);
  };

  // Ad button click — opens real Monetag ad + credits VERSE
  const handleAdClick = useCallback((btn) => {
    if (clickedAds[btn.id]) return;
    if (adsEarned >= CLICK_LIMIT) { toast.error('Aaj ki limit poori ho gayi!'); return; }

    setAdLoading(btn.id);
    fetch('/api/earn/ad-complete', { method: 'POST', headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setAdsEarned(Number(data.daily_earned || adsEarned + 0.5));
        setClickedAds((prev) => ({ ...prev, [btn.id]: true }));
        toast.success('+0.5 VERSE mila! 🎉');
      })
      .catch(() => toast.error('Error aya'))
      .finally(() => setAdLoading(null));
  }, [clickedAds, adsEarned]);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Ad Grid — Click to Earn */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Ads Dekho — VERSE Kamao</h2>
            <p className="text-[#9CA3AF] text-sm">Har ad click = 0.5 VERSE · Max 500/day</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#7C3AED] font-bold">{adsEarned}/{CLICK_LIMIT}</p>
            <p className="text-[#9CA3AF] text-xs">VERSE aaj</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="h-1.5 bg-[#0F0F1A] rounded-full overflow-hidden">
            <div className="h-full bg-[#7C3AED] rounded-full transition-all"
              style={{ width: `${Math.min(100, (adsEarned / CLICK_LIMIT) * 100)}%` }} />
          </div>
          <p className="text-[#9CA3AF] text-xs mt-1">{Math.max(0, CLICK_LIMIT - adsEarned)} clicks baaki aaj</p>
        </div>

        {adsEarned >= CLICK_LIMIT ? (
          <div className="text-center py-6 bg-[#0F0F1A] rounded-xl border border-[#2D2D4E]">
            <CheckCircle className="w-10 h-10 text-[#10B981] mx-auto mb-2" />
            <p className="text-[#10B981] font-bold text-lg">Aaj ki limit poori! ✅</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Kal wapas aao</p>
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
                  className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${
                    isClicked
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED]/40 text-[#7C3AED] cursor-default'
                      : 'bg-[#0F0F1A] border-[#2D2D4E] text-[#9CA3AF] hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 cursor-pointer'
                  }`}
                >
                  {isLoading ? '...' : isClicked ? '✓' : btn.id}
                </a>
              );
            })}
          </div>
        )}
        <p className="text-[#9CA3AF] text-xs mt-3 text-center">
          💡 Har button click pe sponsored ad khulega + 0.5 VERSE milega
        </p>
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
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${checkinDone ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
              {checkinDone ? '+5 Done ✓' : '+5 VERSE'}
            </span>
          </div>
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
              <p className="text-[#9CA3AF] text-sm mt-1">~{surveyModal.estimated_minutes} minutes</p>
            </div>
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
