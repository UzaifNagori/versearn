'use client';

import { useState, useEffect } from 'react';
import { Copy, Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // API se profile load karo
  useEffect(() => {
    fetch('/api/user/profile', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setUsername(data.user.username || '');
          setWalletAddress(data.user.wallet_address || '');
          setReferrals(data.referrals || []);
          setReferralCount(data.referral_count || 0);
        }
      })
      .catch(() => toast.error('Profile load nahi ho saki'))
      .finally(() => setLoading(false));
  }, []);

  const referralLink = profile
    ? `${window.location.origin}/register?ref=${profile.referral_code}`
    : '';

  const initials = profile
    ? profile.username.slice(0, 2).toUpperCase()
    : '??';

  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })
    : '';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copy ho gaya!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `VerseEarn join karo aur VERSE tokens kamao! Mera referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ username, wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save fail ho gaya');
      setProfile(data.user);
      // localStorage bhi update karo
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      toast.success('Profile update ho gayi! ✅');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-[#9CA3AF] py-20">
        Profile load nahi ho saki. Page refresh karo.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
            <p className="text-[#9CA3AF] text-sm">{profile.email}</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Member since {memberSince}</p>
            {profile.is_premium ? (
              <span className="inline-block mt-2 px-3 py-0.5 bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs rounded-full font-medium">
                ⭐ Premium
              </span>
            ) : null}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#2D2D4E]">
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {Number(profile.total_earned || 0).toLocaleString()} VERSE
            </p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Total Earned</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{referralCount}</p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Total Referrals</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {Number(profile.verse_balance || 0).toLocaleString()}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Current Balance</p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Profile Edit Karo</h3>
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">
            Wallet Address (USDT)
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white placeholder-[#4B5563] text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {saving && <LoadingSpinner size="sm" />}
          {saving ? 'Save ho raha hai...' : 'Save Karo'}
        </button>
      </div>

      {/* Referral Section */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Referral Program</h3>

        {/* Code */}
        <div>
          <p className="text-[#9CA3AF] text-sm mb-2">Aapka Referral Code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg px-4 py-2.5">
              <span className="text-[#F59E0B] font-black text-lg tracking-widest">
                {profile.referral_code}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(profile.referral_code)}
              className="p-2.5 bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-lg text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-colors"
              aria-label="Copy code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Link */}
        <div>
          <p className="text-[#9CA3AF] text-sm mb-2">Referral Link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg px-4 py-2.5 overflow-hidden">
              <span className="text-white text-sm truncate block">{referralLink}</span>
            </div>
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="p-2.5 bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-lg text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-colors"
              aria-label="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="w-full py-2.5 bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/30 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          WhatsApp pe Share Karo
        </button>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-white">{referralCount}</p>
            <p className="text-[#9CA3AF] text-xs">Joined</p>
          </div>
          <div className="bg-[#0F0F1A] border border-[#2D2D4E] rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-[#F59E0B]">{referralCount * 50}</p>
            <p className="text-[#9CA3AF] text-xs">VERSE Earned</p>
          </div>
        </div>

        {/* Referral Table */}
        {referrals.length > 0 ? (
          <div>
            <p className="text-[#9CA3AF] text-sm mb-3">Referred Users</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#9CA3AF] border-b border-[#2D2D4E]">
                    <th className="text-left pb-2 font-medium">Username</th>
                    <th className="text-right pb-2 font-medium">Joined</th>
                    <th className="text-right pb-2 font-medium">VERSE</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-[#2D2D4E] last:border-0">
                      <td className="py-2 text-white">{r.username}</td>
                      <td className="py-2 text-right text-[#9CA3AF]">
                        {new Date(r.created_at).toLocaleDateString('en-PK')}
                      </td>
                      <td className="py-2 text-right text-[#10B981] font-medium">+50</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-[#9CA3AF] text-sm text-center py-4">
            Abhi tak koi referral nahi. Apna link share karo! 🔗
          </p>
        )}
      </div>
    </div>
  );
}
