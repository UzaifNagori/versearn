'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Coins, Image, Store, ArrowDownToLine, Receipt, User, X } from 'lucide-react';
import VerseBalance from '@/components/ui/VerseBalance';
import { mockUser } from '@/lib/mockData';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Click & Earn', icon: Coins, href: '/earn' },
  { label: 'My NFTs', icon: Image, href: '/nft' },
  { label: 'Marketplace', icon: Store, href: '/marketplace' },
  { label: 'Withdraw', icon: ArrowDownToLine, href: '/withdraw' },
  { label: 'Transactions', icon: Receipt, href: '/transactions' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0A0A1A] border-r border-[#2D2D4E] z-40 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-[#2D2D4E]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black">
              <span className="text-[#7C3AED]">⚡</span>
              <span className="text-white">Verse</span>
              <span className="text-[#F59E0B]">Earn</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-[#9CA3AF] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-900/30'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1A2E]'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Balance at bottom */}
        <div className="p-4 border-t border-[#2D2D4E]">
          <div className="bg-[#1A1A2E] rounded-xl p-3 border border-[#2D2D4E]">
            <p className="text-[#9CA3AF] text-xs mb-1">Aapka Balance</p>
            <VerseBalance balance={mockUser.verse_balance} size="sm" />
          </div>
        </div>
      </aside>
    </>
  );
}
