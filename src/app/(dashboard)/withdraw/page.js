'use client';

import { useState, useEffect } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const METHODS = [
  { id: 'easypaisa', label: 'EasyPaisa', emoji: '🟢', min: 1000 },
  { id: 'jazzcash', label: 'JazzCash', emoji: '🔴', min: 1000 },
  { id: 'usdt', label: 'USDT Crypto', emoji: '🔵', min: 5000 },
];

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('easypaisa');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me', { headers: authHeader() }).then((r) => r.json()),
      fetch('/api/withdraw', { headers: authHeader() }).then((r) => r.json()),
    ])
      .then(([meData, wData]) => {
        setBalance(meData.user?.verse_balance || 0);
        setWithdrawals(wData.withdrawals || []);
      })
      .catch(() => toast.error('Data load nahi ho saka'))
      .finally(() => setLoading(false));
  }, []);

  const selectedMethod = METHODS.find((m) => m.id === method);
  const amountNum = Number(amount);
  const usdValue = (amountNum / 1000).toFixed(2);
  const pkrValue = Math.floor(amountNum * 0.28).toLocaleString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amountNum <= 0) { toast.error('Amount daalo'); return; }
    if (amountNum < selectedMethod.min) { toast.error(`Minimum ${selectedMethod.min} VERSE chahiye`); return; }
    if (amountNum > balance) { toast.error('Insufficient balance'); return; }
    if (!account) { toast.error('Account number / wallet address daalo'); return; }

    setSubmitting(true);
    try {
      const body = { method, verse_amount: amountNum };
      if (method === 'usdt') body.wallet_address = account;
      else body.account_number = account;

      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Withdrawal request submit ho gayi! ✅');
      setBalance((prev) => prev - amountNum);
      setAmount('');
      setAccount('');
      // Refresh history
      fetch('/api/withdraw', { headers: authHeader() })
        .then((r) => r.json())
        .then((d) => setWithdrawals(d.withdrawals || []));
    } catch (err) {
      toast.error(err.message || 'Error aya');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Balance */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 shadow-lg shadow-purple-900/20">
        <p className="text-[#9CA3AF] text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-black text-[#F59E0B]">
          {Number(balance).toLocaleString()}
          <span className="text-xl ml-2 text-[#9CA3AF]">VERSE</span>
        </p>
        <p className="text-[#9CA3AF] text-sm mt-1">
          ≈ ${(balance * 0.001).toFixed(2)} USD · Rs. {Math.floor(balance * 0.28).toLocaleString()} PKR
        </p>
      </div>

      {/* Withdraw Form */}
      <form onSubmit={handleSubmit} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-6 space-y-5 shadow-lg shadow-purple-900/20">
        <h3 className="text-white font-semibold text-lg">Withdrawal Request</h3>

        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-2">Method</label>
          <div className="grid grid-cols-3 gap-3">
            {METHODS.map((m) => (
              <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={`p-3 rounded-xl border text-center transition-all ${method === m.id ? 'border-[#7C3AED] bg-[#7C3AED]/10' : 'border-[#2D2D4E] hover:border-[#7C3AED]/50'}`}>
                <div className="text-2xl mb-1">{m.emoji}</div>
                <p className="text-white text-xs font-medium">{m.label}</p>
                <p className="text-[#9CA3AF] text-xs">Min {m.min.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Amount (VERSE)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min ${selectedMethod.min}`}
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white placeholder-[#4B5563] text-sm" />
          {amountNum > 0 && (
            <p className="text-[#9CA3AF] text-xs mt-1">= ${usdValue} USD · Rs. {pkrValue} PKR</p>
          )}
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">
            {method === 'usdt' ? 'Wallet Address (TRC20/ERC20)' : 'Account Number'}
          </label>
          <input type="text" value={account} onChange={(e) => setAccount(e.target.value)}
            placeholder={method === 'usdt' ? '0x...' : '03XXXXXXXXX'}
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white placeholder-[#4B5563] text-sm" />
        </div>

        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
          <ArrowDownToLine className="w-4 h-4" />
          {submitting ? 'Submit ho raha hai...' : 'Withdrawal Request Bhejo'}
        </button>
      </form>

      {/* History */}
      {withdrawals.length > 0 && (
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 shadow-lg shadow-purple-900/20">
          <h3 className="text-white font-semibold mb-4">Withdrawal History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#9CA3AF] border-b border-[#2D2D4E]">
                  <th className="text-left pb-2 font-medium">Method</th>
                  <th className="text-left pb-2 font-medium">Amount</th>
                  <th className="text-left pb-2 font-medium">Date</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-[#2D2D4E] last:border-0">
                    <td className="py-3 text-white capitalize">{w.method}</td>
                    <td className="py-3 text-[#F59E0B] font-medium">{Number(w.verse_amount).toLocaleString()} VERSE</td>
                    <td className="py-3 text-[#9CA3AF]">{new Date(w.created_at).toLocaleDateString('en-PK')}</td>
                    <td className="py-3 text-right"><Badge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
