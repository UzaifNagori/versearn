'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import VerseBalance from '@/components/ui/VerseBalance';
import { getUser, logout, authHeader } from '@/lib/auth';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/earn': 'Click & Earn',
  '/adsterra': 'Adsterra Earn',
  '/nft': 'My NFTs',
  '/nft/create': 'Create NFT',
  '/marketplace': 'Marketplace',
  '/withdraw': 'Withdraw',
  '/transactions': 'Transactions',
  '/profile': 'Profile',
};

export default function DashboardTopbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const router = useRouter();
  const pathname = usePathname();

  // Fresh balance from API
  useEffect(() => {
    fetch('/api/auth/me', { headers: authHeader() })
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, [pathname]); // refresh on page change

  const title = pageTitles[pathname] || 'Dashboard';
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-[#0A0A1A] border-b border-[#2D2D4E] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A2E] transition-colors"
          aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Balance */}
        <div className="hidden sm:flex items-center bg-[#1A1A2E] border border-[#2D2D4E] rounded-lg px-3 py-1.5">
          <VerseBalance balance={user?.verse_balance || 0} size="sm" />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A2E] transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1A1A2E] transition-colors"
            aria-label="User menu">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <ChevronDown className="w-4 h-4 text-[#9CA3AF] hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#2D2D4E]">
                  <p className="text-white text-sm font-medium">{user?.username || '...'}</p>
                  <p className="text-[#9CA3AF] text-xs truncate">{user?.email || '...'}</p>
                </div>
                <Link href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#9CA3AF] hover:text-white hover:bg-[#2D2D4E] transition-colors"
                  onClick={() => setDropdownOpen(false)}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#2D2D4E] transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
