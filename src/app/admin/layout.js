'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_auth') === 'true';
    setAuthed(isAdmin);
    setChecked(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Galat password');
    }
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#1A1A2E] border border-[#2D2D4E] rounded-2xl p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🛡️</span>
            <h1 className="text-xl font-bold text-white mt-2">Admin Access</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Password daalo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#EF4444] focus:outline-none rounded-lg px-4 py-2.5 text-white placeholder-[#4B5563] text-sm"
            />
            {error && <p className="text-[#EF4444] text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-[#9CA3AF] text-xs text-center mt-4">Hint: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
