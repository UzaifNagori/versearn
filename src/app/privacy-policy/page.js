export const metadata = {
  title: 'Privacy Policy — VerseEarn',
  description: 'VerseEarn Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-[#7C3AED] hover:text-[#A78BFA] text-sm">← VerseEarn Home</a>
          <h1 className="text-4xl font-black text-white mt-4 mb-2">Privacy Policy</h1>
          <p className="text-[#9CA3AF] text-sm">Last updated: May 26, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-[#E5E7EB]">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              Welcome to VerseEarn ("we", "our", or "us"). We are committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we collect, use, and share information
              about you when you use our website at versearn.vercel.app and related services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="text-[#9CA3AF] leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li><strong className="text-white">Account Information:</strong> Username, email address, and password when you register.</li>
              <li><strong className="text-white">Usage Data:</strong> Information about how you use our platform, including earning activities, clicks, and transactions.</li>
              <li><strong className="text-white">Device Information:</strong> Browser type, IP address, and device identifiers.</li>
              <li><strong className="text-white">Wallet Address:</strong> Cryptocurrency wallet address if provided for withdrawals.</li>
              <li><strong className="text-white">Referral Data:</strong> Referral codes used during registration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>To provide and maintain our earning platform services</li>
              <li>To process VERSE token rewards and withdrawals</li>
              <li>To send notifications about your account activity</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Advertising</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We use third-party advertising services including Google AdSense, Monetag, and Adsterra to display
              advertisements on our platform. These services may use cookies and similar technologies to serve
              ads based on your prior visits to our website and other websites. You may opt out of personalized
              advertising by visiting <a href="https://www.google.com/settings/ads" className="text-[#7C3AED] hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
            <p className="text-[#9CA3AF] leading-relaxed mt-3">
              Google AdSense uses the DoubleClick cookie to serve more relevant ads. You can opt out at
              <a href="https://www.aboutads.info" className="text-[#7C3AED] hover:underline ml-1" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain
              information. Cookies are files with a small amount of data. You can instruct your browser to refuse
              all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Sharing</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2 mt-3">
              <li>Service providers who assist in operating our platform</li>
              <li>Advertising partners (Google AdSense, Monetag, Adsterra) for ad serving</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Data Security</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We implement appropriate security measures to protect your personal information. Passwords are
              encrypted using industry-standard bcrypt hashing. However, no method of transmission over the
              Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Children's Privacy</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information
              from children under 13. If you are a parent and believe your child has provided us with personal
              information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Your Rights</h2>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:uzaifngaori56@gmail.com" className="text-[#7C3AED] hover:underline">uzaifngaori56@gmail.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
