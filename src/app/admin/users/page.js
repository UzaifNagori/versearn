'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { authHeader } from '@/lib/auth';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null);

  const loadUsers = (q = '') => {
    const params = q ? `?search=${encodeURIComponent(q)}` : '';
    fetch(`/api/admin/users${params}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => toast.error('Users load nahi ho sake'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(search);
  };

  const handleBanToggle = async (user) => {
    setSaving(user.id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ id: user.id, is_banned: !user.is_banned }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_banned: !u.is_banned } : u));
      toast.success(user.is_banned ? 'User unban ho gaya' : 'User ban ho gaya');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Users</h2>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Username ya email search karo..."
            className="w-full bg-[#1A1A2E] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-sm font-medium">Search</button>
      </form>

      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#2D2D4E]">
              <tr className="text-[#9CA3AF]">
                <th className="text-left p-4 font-medium">Username</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Balance</th>
                <th className="text-left p-4 font-medium">Total Earned</th>
                <th className="text-left p-4 font-medium">Joined</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-[#9CA3AF] py-8">Koi user nahi mila</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-[#2D2D4E] last:border-0">
                  <td className="p-4 text-white font-medium">{u.username}</td>
                  <td className="p-4 text-[#9CA3AF]">{u.email}</td>
                  <td className="p-4 text-[#F59E0B]">{Number(u.verse_balance).toLocaleString()}</td>
                  <td className="p-4 text-[#10B981]">{Number(u.total_earned).toLocaleString()}</td>
                  <td className="p-4 text-[#9CA3AF]">{new Date(u.created_at).toLocaleDateString('en-PK')}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleBanToggle(u)} disabled={saving === u.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 ${u.is_banned ? 'bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/30' : 'bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/30'}`}>
                      {saving === u.id ? '...' : u.is_banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
