'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tv, ClipboardList, Footprints, Calendar, ArrowRight } from 'lucide-react';
import { authHeader } from '@/lib/auth';
import StatCard from '@/components/ui/StatCard';
import TransactionRow from '@/components/ui/TransactionRow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AdsterraBanner from '@/components/ui/AdsterraBanner';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/dashboard', { headers: authHeader() })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const user = data?.user || {};
  const daily = data?.daily || { ads_earned: 0, survey_earned: 0, walk_earned: 0, checkin_done: false };
  const transactions = data?.transactions || [];
  const pkrValue = Math.floor((user.verse_balance || 0) * 0.28);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome + Balance */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <h2 className="text-2xl font-bold text-white mb-1">
          Assalam o Alaikum, {user.username}! 👋
        </h2>
        <p className="text-[#9CA3AF] text-sm">Aaj bhi VERSE tokens kamao!</p>
        <div className="mt-5">
          <p className="text-[#9CA3AF] text-sm mb-1">Aapka Balance</p>
          <p className="text-5xl font-black text-[#F59E0B]">
            {Number(user.verse_balance || 0).toLocaleString()}
            <span className="text-2xl ml-2 text-[#9CA3AF]">VERSE</span>
          </p>
          <p className="text-[#9CA3AF] text-sm mt-1">≈ Rs. {pkrValue.toLocaleString()} PKR</p>
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h3 className="text-white font-semibold mb-3">Aaj ki Kamai</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Ads" value={`${daily.ads_earned || 0} VERSE`} icon={Tv} color="#7C3AED" />
          <StatCard title="Survey" value={`${daily.survey_earned || 0} VERSE`} icon={ClipboardList} color="#3B82F6" />
          <StatCard title="Walk" value={`${daily.walk_earned || 0} VERSE`} icon={Footprints} color="#10B981" />
          <StatCard
            title="Check-in"
            value={daily.checkin_done ? '5 VERSE ✓' : 'Pending'}
            icon={Calendar}
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Daily Progress */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
        <h3 className="text-white font-semibold mb-4">Daily Limits</h3>
        <div className="space-y-4">
          {[
            { label: 'Ads', earned: daily.ads_earned || 0, limit: 50, color: '#7C3AED' },
            { label: 'Survey', earned: daily.survey_earned || 0, limit: 200, color: '#3B82F6' },
            { label: 'Walk', earned: daily.walk_earned || 0, limit: 100, color: '#10B981' },
          ].map((item) => {
            const pct = Math.min(100, Math.round((item.earned / item.limit) * 100));
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#E5E7EB]">{item.label}</span>
                  <span className="text-[#9CA3AF]">{item.earned} / {item.limit} VERSE</span>
                </div>
                <div className="h-2 bg-[#0F0F1A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Watch Ad', emoji: '📺', href: '/earn' },
            { label: daily.checkin_done ? 'Check-in ✓' : 'Check-in Karo', emoji: '📅', href: '/earn' },
            { label: 'Earn Survey', emoji: '📋', href: '/earn' },
            { label: 'Create NFT', emoji: '🎨', href: '/nft/create' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-[#1A1A2E] border border-[#2D2D4E] hover:border-[#7C3AED]/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{action.emoji}</span>
              <span className="text-sm font-medium text-[#E5E7EB] text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Adsterra Banner Ad */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-4 flex flex-col items-center shadow-lg shadow-purple-900/20">
        <p className="text-[#9CA3AF] text-xs mb-3">Sponsored Advertisement</p>
        <AdsterraBanner />
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Transactions</h3>
          <Link href="/transactions" className="text-[#7C3AED] text-sm hover:text-[#A78BFA] flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {transactions.length > 0 ? (
          <div>
            {transactions.slice(0, 5).map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <p className="text-[#9CA3AF] text-sm text-center py-6">
            Abhi koi transaction nahi. Earn karna shuru karo! 🚀
          </p>
        )}
      </div>
    </div>
  );
}
