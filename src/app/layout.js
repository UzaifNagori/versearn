import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import MonatagAds from "@/components/MonatagAds";
import AdsterraAds from "@/components/AdsterraAds";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VerseEarn — Ghar Baithe Kamao",
  description:
    "VerseEarn pe VERSE tokens kamao — ads dekho, surveys karo, walk karo aur NFTs banao. Pakistan ka #1 earning platform.",
  other: {
    monetag: 'f87e1b747adaf0e2716b656ccfa54a1e',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ur"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F0F0F] text-[#E5E7EB]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#E5E7EB",
              border: "1px solid #2D2D4E",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#1A1A2E" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#1A1A2E" },
            },
          }}
        />
        {children}
        {/* Monetag Service Worker — sab pages pe */}
        <Script id="monetag-sw" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' });
          }
        `}</Script>
        {/* Monetag Push Notification — sab pages pe */}
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11056591"
          data-cfasync="false"
          strategy="afterInteractive"
        />
        {/* OnClick + InPage — sirf dashboard pages pe */}
        <MonatagAds />
        {/* Adsterra Social Bar + Popunder — sirf adsterra page pe */}
        <AdsterraAds />
        {/* Google AdSense Verification */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9139516758998452"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />      </body>
    </html>
  );
}
