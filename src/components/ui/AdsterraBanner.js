'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const ref = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;
    loaded.current = true;

    try {
      // Banner 300x250
      window.atOptions = {
        key: 'd9ae3222809e2c23a17ab463e86c869e',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {},
      };
      const bannerScript = document.createElement('script');
      bannerScript.src = 'https://www.highperformanceformat.com/d9ae3222809e2c23a17ab463e86c869e/invoke.js';
      bannerScript.async = true;
      ref.current.appendChild(bannerScript);
    } catch (e) {
      console.error('Adsterra banner error:', e);
    }
  }, []);

  return (
    <div ref={ref} style={{ width: 300, minHeight: 250 }} />
  );
}
