'use client';

import { useState, useEffect } from 'react';
import { authHeader } from '@/lib/auth';
import TransactionRow from '@/components/ui/TransactionRow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'earn', label: 'Earn' },
  { id: 'withdrawal', label: 'Withdrawal' },
  { id: 'nft', label: 'NFT' },
];

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ type: activeTab });
    fetch(`/api/admin/transactions?${params}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setTransactions(data.transactions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">All Transactions</h2>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#7C3AED] text-white' : 'bg-[#1A1A2E] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5">
        {loading ? (
          <div className="flex items-center justify-center h-32"><LoadingSpinner size="md" /></div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-[#9CA3AF] py-8">Koi transaction nahi</p>
        ) : (
          transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
        )}
      </div>
    </div>
  );
}
