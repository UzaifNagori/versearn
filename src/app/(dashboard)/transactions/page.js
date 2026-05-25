'use client';

import { useState, useEffect } from 'react';
import { authHeader } from '@/lib/auth';
import TransactionRow from '@/components/ui/TransactionRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Receipt } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'earn', label: 'Earn' },
  { id: 'withdrawal', label: 'Withdrawal' },
  { id: 'nft', label: 'NFT' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, type: activeTab });
    fetch(`/api/user/transactions?${params}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setTotalPages(data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  const handleTabChange = (tab) => { setActiveTab(tab); setPage(1); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Transaction History</h2>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#7C3AED] text-white' : 'bg-[#1A1A2E] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
        {loading ? (
          <div className="flex items-center justify-center h-32"><LoadingSpinner size="md" /></div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={Receipt} title="Koi transaction nahi" description="Earn karna shuru karo!" />
        ) : (
          <div>
            {transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-[#7C3AED] text-white' : 'bg-[#1A1A2E] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
