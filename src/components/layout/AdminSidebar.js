'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowDownToLine, Users, Receipt, Image, ArrowLeft } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Withdrawals', icon: ArrowDownToLine, href: '/admin/withdrawals' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Transactions', icon: Receipt, href: '/admin/transactions' },
  { label: 'NFTs', icon: Image, href: '/admin/nfts' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A0A1A] border-r border-[#2D2D4E] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-[#2D2D4E]">
        <span className="text-xl font-black">
          <span className="text-[#EF4444]">🛡️</span>
          <span className="text-white"> Admin</span>
          <span className="text-[#F59E0B]">Panel</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
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

      {/* Back to site */}
      <div className="p-4 border-t border-[#2D2D4E]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-[#1A1A2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
