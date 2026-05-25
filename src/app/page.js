import Link from 'next/link';
import { Tv, ClipboardList, Footprints, Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

const earningMethods = [
  { icon: Tv, title: 'Watch Ads', verse: '1 VERSE/ad', description: 'Har ad dekho aur 1 VERSE kamao. Roz 50 ads tak.', color: '#7C3AED' },
  { icon: ClipboardList, title: 'Surveys', verse: '10-50 VERSE', description: 'Short surveys complete karo aur zyada VERSE kamao.', color: '#3B82F6' },
  { icon: Footprints, title: 'Walk to Earn', verse: '10 VERSE/1000 steps', description: 'Chalo aur kamao! Mobile app se steps track karo.', color: '#10B981' },
  { icon: Calendar, title: 'Daily Check-in', verse: '5 VERSE/day', description: 'Roz check-in karo aur streak bonus pao.', color: '#F59E0B' },
  { icon: Users, title: 'Referrals', verse: '50 VERSE/referral', description: 'Dosto ko invite karo aur har join pe 50 VERSE pao.', color: '#EC4899' },
];

const steps = [
  { num: '01', title: 'Register Karo', desc: 'Free account banao — sirf 1 minute lagta hai.' },
  { num: '02', title: 'VERSE Kamao', desc: 'Ads dekho, surveys karo, walk karo ya dosto ko invite karo.' },
  { num: '03', title: 'Cash Withdraw Karo', desc: 'EasyPaisa, JazzCash ya USDT mein withdraw karo.' },
];

const nftPlaceholders = [
  { id: 1, title: 'Cosmic Dragon', price: 500 },
  { id: 2, title: 'Neon Tiger', price: 350 },
  { id: 3, title: 'Pixel Warrior', price: 250 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#7C3AED] text-sm font-medium">🇵🇰 Pakistan ka #1 Earning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Ghar Baithe Kamao </span>
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VERSE Tokens
            </span>
          </h1>

          <p className="text-[#9CA3AF] text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Ads dekho, surveys karo, walk karo aur NFTs banao — VERSE tokens kamao aur EasyPaisa / JazzCash mein withdraw karo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/40 text-lg"
            >
              Abhi Join Karo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#2D2D4E] hover:border-[#7C3AED] text-white font-semibold rounded-xl transition-all text-lg"
            >
              Login Karo
            </Link>
          </div>

          {/* Floating stats */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { value: '1,247+', label: 'Active Users' },
              { value: '2.8M+', label: 'VERSE Earned' },
              { value: '500+', label: 'NFTs Minted' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl px-6 py-3 text-center">
                <p className="text-[#F59E0B] text-2xl font-black">{stat.value}</p>
                <p className="text-[#9CA3AF] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Earning Methods</h2>
            <p className="text-[#9CA3AF]">5 tareeqon se VERSE tokens kamao</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {earningMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 hover:border-[#7C3AED]/50 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: method.color }} />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                  <p className="text-[#F59E0B] text-sm font-bold mb-2">{method.verse}</p>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{method.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Kaise Kaam Karta Hai?</h2>
            <p className="text-[#9CA3AF]">Sirf 3 steps mein shuru karo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#7C3AED] to-transparent" />
                )}
                <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 border-2 border-[#7C3AED] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#7C3AED] text-xl font-black">{step.num}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-[#9CA3AF] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Create & Sell NFTs</h2>
            <p className="text-[#9CA3AF]">AI se NFT banao aur marketplace pe becho</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {nftPlaceholders.map((nft) => (
              <div key={nft.id} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl overflow-hidden hover:border-[#7C3AED]/50 transition-all">
                <div className="aspect-square bg-gradient-to-br from-[#7C3AED]/30 to-[#F59E0B]/20 flex items-center justify-center">
                  <span className="text-5xl">🎨</span>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold">{nft.title}</h3>
                  <p className="text-[#F59E0B] text-sm font-bold mt-1">⚡ {nft.price} VERSE</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-xl transition-all font-medium"
            >
              NFT Banao
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Withdrawal Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Withdrawal Methods</h2>
          <p className="text-[#9CA3AF] mb-10">PKR ya Crypto mein withdraw karo</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'EasyPaisa', emoji: '🟢', desc: 'PKR mein instant' },
              { name: 'JazzCash', emoji: '🔴', desc: 'PKR mein instant' },
              { name: 'USDT', emoji: '🔵', desc: 'Crypto withdrawal' },
            ].map((method) => (
              <div key={method.name} className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl px-8 py-5 flex flex-col items-center gap-2 hover:border-[#7C3AED]/50 transition-all">
                <span className="text-3xl">{method.emoji}</span>
                <p className="text-white font-semibold">{method.name}</p>
                <p className="text-[#9CA3AF] text-xs">{method.desc}</p>
                <div className="flex items-center gap-1 text-[#10B981] text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Available
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#9CA3AF] text-sm mt-6">Minimum: 1,000 VERSE = Rs. 280 PKR</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#7C3AED]/20 to-[#F59E0B]/10 border-y border-[#2D2D4E]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-[#9CA3AF] mb-8">Abhi join karo aur pehle din se VERSE tokens kamana shuru karo!</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 text-lg"
          >
            Abhi Join Karo — Free!
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
