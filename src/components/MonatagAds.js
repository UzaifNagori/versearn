'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Yeh pages pe ads nahi dikhenge
const NO_ADS_PAGES = ['/login', '/register', '/'];

export default function MonatagAds() {
  const pathname = usePathname();

  // Public pages pe ads nahi
  if (NO_ADS_PAGES.includes(pathname)) return null;

  return (
    <>
      {/* Monetag OnClick Ad Tag */}
      <Script id="monetag-onclick" strategy="afterInteractive">{`
        (function(s){s.dataset.zone='11056557',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
      `}</Script>
      {/* Monetag In-Page Push Banner Tag */}
      <Script id="monetag-inpage" strategy="afterInteractive">{`
        (function(s){s.dataset.zone='11056594',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
      `}</Script>
    </>
  );
}
