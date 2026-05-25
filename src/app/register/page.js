'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: refCode,
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Sab fields zaroori hain');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords match nahi kar rahe');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password kam az kam 6 characters ka hona chahiye');
      return;
    }
    if (!form.terms) {
      toast.error('Terms & Conditions accept karna zaroori hai');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.referralCode || null);
      toast.success('Account ban gaya! Welcome to VerseEarn 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration fail ho gaya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8">
        <span className="text-3xl font-black">
          <span className="text-[#7C3AED]">⚡</span>
          <span className="text-white">Verse</span>
          <span className="text-[#F59E0B]">Earn</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-[#1A1A2E] border border-[#2D2D4E] rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
        <h1 className="text-2xl font-bold text-white mb-2">Account Banao 🚀</h1>
        <p className="text-[#9CA3AF] text-sm mb-8">Free join karo aur VERSE tokens kamana shuru karo</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="ahmed_pk"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ahmed@example.com"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors"
                required
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">
              Referral Code <span className="text-[#9CA3AF] font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
                placeholder="AHMED50"
                className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#4B5563] text-sm transition-colors uppercase"
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 accent-[#7C3AED]"
            />
            <span className="text-sm text-[#9CA3AF]">
              Main{' '}
              <Link href="#" className="text-[#7C3AED] hover:underline">Terms of Service</Link>
              {' '}aur{' '}
              <Link href="#" className="text-[#7C3AED] hover:underline">Privacy Policy</Link>
              {' '}se agree karta/karti hoon
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? 'Account ban raha hai...' : 'Register Karo'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#2D2D4E]" />
          <span className="text-[#9CA3AF] text-xs">ya</span>
          <div className="flex-1 h-px bg-[#2D2D4E]" />
        </div>

        <button
          type="button"
          className="w-full py-3 border border-[#2D2D4E] hover:border-[#7C3AED] text-[#E5E7EB] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          onClick={() => toast('Google login baad mein aayega', { icon: '🔜' })}
        >
          <span className="text-lg font-bold text-blue-400">G</span>
          Google se Register Karo
        </button>

        <p className="text-center text-sm text-[#9CA3AF] mt-6">
          Pehle se account hai?{' '}
          <Link href="/login" className="text-[#7C3AED] hover:text-[#A78BFA] font-medium">
            Login Karo
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
