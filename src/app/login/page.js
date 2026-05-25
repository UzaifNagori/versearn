'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email aur password daalna zaroori hai');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login ho gaya! 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login fail ho gaya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <span className="text-3xl font-black">
          <span className="text-[#7C3AED]">⚡</span>
          <span className="text-white">Verse</span>
          <span className="text-[#F59E0B]">Earn</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-[#1A1A2E] border border-[#2D2D4E] rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
        <h1 className="text-2xl font-bold text-white mb-2">Wapas Aao! 👋</h1>
        <p className="text-[#9CA3AF] text-sm mb-8">Apne account mein login karo</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@example.com"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#E5E7EB]">Password</label>
              <Link href="#" className="text-xs text-[#7C3AED] hover:text-[#A78BFA]">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? 'Login ho raha hai...' : 'Login Karo'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#2D2D4E]" />
          <span className="text-[#9CA3AF] text-xs">ya</span>
          <div className="flex-1 h-px bg-[#2D2D4E]" />
        </div>

        {/* Google (UI only) */}
        <button
          type="button"
          className="w-full py-3 border border-[#2D2D4E] hover:border-[#7C3AED] text-[#E5E7EB] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          onClick={() => toast('Google login baad mein aayega', { icon: '🔜' })}
        >
          <span className="text-lg font-bold text-blue-400">G</span>
          Google se Login Karo
        </button>

        <p className="text-center text-sm text-[#9CA3AF] mt-6">
          Account nahi hai?{' '}
          <Link href="/register" className="text-[#7C3AED] hover:text-[#A78BFA] font-medium">
            Register Karo
          </Link>
        </p>
      </div>
    </div>
  );
}
