'use client';

export default function AdsterraBanner() {
  // Adsterra banner via iframe src — most reliable method in React
  const adUrl = `https://www.highperformanceformat.com/d9ae3222809e2c23a17ab463e86c869e/invoke.js`;

  return (
    <div style={{ width: 300, height: 250, overflow: 'hidden', position: 'relative' }}>
      <iframe
        src={`data:text/html,
          <html>
          <head></head>
          <body style="margin:0;padding:0;background:#0F0F1A;">
          <script type="text/javascript">
            atOptions = {
              'key': 'd9ae3222809e2c23a17ab463e86c869e',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/d9ae3222809e2c23a17ab463e86c869e/invoke.js"></script>
          </body>
          </html>`}
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        title="Adsterra Ad"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}
