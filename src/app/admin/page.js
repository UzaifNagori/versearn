'use client';

import { useState, useEffect } from 'react';
import { Users, Coins, Activity, ArrowDownToLine } from 'lucide-react';
import { authHeader } from '@/lib/auth';
import StatCard from '@/components/ui/StatCard';
import TransactionRow from '@/components/ui/TransactionRow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  const maxCount = Math.max(...(stats?.daily_new_users?.map((d) => d.count) || [1]));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={Number(stats?.total_users || 0).toLocaleString()} icon={Users} color="#7C3AED" />
        <StatCard title="VERSE Circulation" value={`${((stats?.total_verse_circulation || 0) / 1000).toFixed(1)}K`} icon={Coins} color="#F59E0B" />
        <StatCard title="Daily Active" value={stats?.daily_active || 0} icon={Activity} color="#10B981" />
        <StatCard title="Pending Withdrawals" value={stats?.pending_withdrawals || 0} icon={ArrowDownToLine} color="#EF4444" />
      </div>

      {/* Chart */}
      {stats?.daily_new_users?.length > 0 && (
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Last 7 Days — New Users</h3>
          <div className="flex items-end gap-3 h-32">
            {stats.daily_new_users.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[#9CA3AF] text-xs">{d.count}</span>
                <div className="w-full bg-[#7C3AED] rounded-t-md transition-all"
                  style={{ height: `${Math.max(4, (d.count / maxCount) * 100)}px` }} />
                <span className="text-[#9CA3AF] text-xs">{new Date(d.day).toLocaleDateString('en-PK', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        {(stats?.recent_transactions || []).map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} />
        ))}
        {(!stats?.recent_transactions?.length) && (
          <p className="text-[#9CA3AF] text-sm text-center py-4">Koi activity nahi</p>
        )}
      </div>
    </div>
  );
}
