'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';

    // Config script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key': 'd9ae3222809e2c23a17ab463e86c869e',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `;
    ref.current.appendChild(configScript);

    // Invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highperformanceformat.com/d9ae3222809e2c23a17ab463e86c869e/invoke.js';
    invokeScript.async = true;
    ref.current.appendChild(invokeScript);
  }, []);

  return (
    <div
      ref={ref}
      style={{ minWidth: 300, minHeight: 250 }}
      className="flex items-center justify-center"
    />
  );
}
