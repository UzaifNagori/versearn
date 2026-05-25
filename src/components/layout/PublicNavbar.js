'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2D2D4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black">
              <span className="text-[#7C3AED]">⚡</span>
              <span className="text-white">Verse</span>
              <span className="text-[#F59E0B]">Earn</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-[#E5E7EB] border border-[#2D2D4E] hover:border-[#7C3AED] rounded-lg transition-colors"
            >
              Login Karo
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors"
            >
              Register Karo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A2E] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2D2D4E] bg-[#0F0F0F] px-4 py-4 flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full py-2.5 text-center text-sm font-medium text-[#E5E7EB] border border-[#2D2D4E] rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Login Karo
          </Link>
          <Link
            href="/register"
            className="w-full py-2.5 text-center text-sm font-medium bg-[#7C3AED] text-white rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Register Karo
          </Link>
        </div>
      )}
    </nav>
  );
}
