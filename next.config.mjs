/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.highperformanceformat.com https://*.adsterra.com https://*.monetag.com https://*.al5sm.com https://*.nap5k.com https://*.n6wxm.com https://*.omg10.com https://*.5gvci.com https://*.3nbf4.com",
              "frame-src 'self' https://*.highperformanceformat.com https://*.adsterra.com",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https:",
              "font-src 'self' https:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
