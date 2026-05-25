'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const ref = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;
    loaded.current = true;

    try {
      // Set options on window
      window.atOptions = {
        key: 'd9ae3222809e2c23a17ab463e86c869e',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {},
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/d9ae3222809e2c23a17ab463e86c869e/invoke.js';
      script.async = true;
      ref.current.appendChild(script);
    } catch (e) {
      console.error('Adsterra load error:', e);
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: 300, minHeight: 250 }}
    />
  );
}
