'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    const params = filter !== 'all' ? `?status=${filter}` : '';
    fetch(`/api/admin/withdrawals${params}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setWithdrawals(data.withdrawals || []))
      .catch(() => toast.error('Data load nahi ho saka'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [filter]);

  const handleAction = async (id, status, note = '') => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ id, status, admin_note: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Withdrawal ${status}!`);
      setRejectModal(null);
      setRejectNote('');
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Withdrawals</h2>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#7C3AED] text-white' : 'bg-[#1A1A2E] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#2D2D4E]">
              <tr className="text-[#9CA3AF]">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Method</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">USD</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#9CA3AF] py-8">Koi withdrawal nahi</td></tr>
              ) : withdrawals.map((w) => (
                <tr key={w.id} className="border-b border-[#2D2D4E] last:border-0">
                  <td className="p-4 text-white">{w.username}</td>
                  <td className="p-4 text-[#9CA3AF] capitalize">{w.method}</td>
                  <td className="p-4 text-[#F59E0B] font-medium">{Number(w.verse_amount).toLocaleString()} VERSE</td>
                  <td className="p-4 text-[#9CA3AF]">${Number(w.usd_value).toFixed(2)}</td>
                  <td className="p-4 text-[#9CA3AF]">{new Date(w.created_at).toLocaleDateString('en-PK')}</td>
                  <td className="p-4"><Badge status={w.status} /></td>
                  <td className="p-4 text-right">
                    {w.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAction(w.id, 'approved')} disabled={saving}
                          className="p-1.5 bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] rounded-lg hover:bg-[#10B981]/30 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setRejectModal(w); setRejectNote(''); }} disabled={saving}
                          className="p-1.5 bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/30 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Withdrawal Reject Karo">
        {rejectModal && (
          <div className="space-y-4">
            <p className="text-[#9CA3AF] text-sm">User: <span className="text-white">{rejectModal.username}</span> — {Number(rejectModal.verse_amount).toLocaleString()} VERSE</p>
            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Reason (optional)</label>
              <input type="text" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Rejection reason..."
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 border border-[#2D2D4E] text-[#9CA3AF] rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleAction(rejectModal.id, 'rejected', rejectNote)} disabled={saving}
                className="flex-1 py-2.5 bg-[#EF4444] text-white font-bold rounded-lg text-sm disabled:opacity-60">
                {saving ? 'Reject ho raha hai...' : 'Reject Karo'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
