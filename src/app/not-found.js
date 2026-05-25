import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="text-8xl font-black text-[#7C3AED] opacity-30">404</span>
      </div>
      <h1 className="text-3xl font-black text-white mb-3">Yeh Page Nahi Mila! 😕</h1>
      <p className="text-[#9CA3AF] text-lg mb-8 max-w-md">
        Aap jo page dhundh rahe hain woh exist nahi karta ya move ho gaya hai.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl transition-colors"
        >
          Home pe Jao
        </Link>
        <Link
          href="/dashboard"
          className="px-8 py-3 border border-[#2D2D4E] hover:border-[#7C3AED] text-white font-semibold rounded-xl transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
