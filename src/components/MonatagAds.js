'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const NO_ADS_PAGES = ['/login', '/register', '/'];

export default function MonatagAds() {
  const pathname = usePathname();

  if (NO_ADS_PAGES.includes(pathname)) return null;

  return (
    <>
      {/* Monetag In-Page Push Banner */}
      <Script id="monetag-inpage" strategy="afterInteractive">{`
        (function(s){s.dataset.zone='11056594',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
      `}</Script>
      {/* Monetag Vignette Banner */}
      <Script id="monetag-vignette" strategy="afterInteractive">{`
        (function(s){s.dataset.zone='11057203',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
      `}</Script>
    </>
  );
}
