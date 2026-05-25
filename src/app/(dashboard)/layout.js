'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
