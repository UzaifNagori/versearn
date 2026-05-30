'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Sirf Adsterra Earn page pe load hoga
export default function AdsterraAds() {
  const pathname = usePathname();

  if (pathname !== '/adsterra') return null;

  return (
    <>
      {/* Adsterra Social Bar only — Popunder removed (was opening ads on every click) */}
      <Script
        id="adsterra-socialbar"
        src="https://pl29552941.effectivecpmnetwork.com/bb/ce/36/bbce36facad487932406e69afc808e4c.js"
        strategy="afterInteractive"
      />
    </>
  );
}
