export const metadata = {
  title: 'Terms of Service — VerseEarn',
  description: 'VerseEarn Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-[#7C3AED] hover:text-[#A78BFA] text-sm">← VerseEarn Home</a>
          <h1 className="text-4xl font-black text-white mt-4 mb-2">Terms of Service</h1>
          <p className="text-[#9CA3AF] text-sm">Last updated: May 26, 2026</p>
        </div>

        <div className="space-y-8 text-[#E5E7EB]">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              By accessing and using VerseEarn ("the Platform"), you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              VerseEarn is a loyalty points platform where users earn VERSE tokens (loyalty points) by
              engaging with sponsored content, completing daily check-ins, and participating in referral
              programs. VERSE tokens are loyalty points and not cryptocurrency or legal tender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. VERSE Tokens</h2>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>VERSE tokens are loyalty points with no monetary value on their own</li>
              <li>1000 VERSE tokens can be redeemed for $1 USD equivalent at our discretion</li>
              <li>We reserve the right to modify the redemption rate at any time</li>
              <li>VERSE tokens cannot be transferred between accounts</li>
              <li>Unused VERSE tokens expire after 12 months of account inactivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Eligibility</h2>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>You must be at least 18 years old to use this platform</li>
              <li>You must provide accurate registration information</li>
              <li>One account per person — multiple accounts are not allowed</li>
              <li>You must not use VPNs or proxies to manipulate earnings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Prohibited Activities</h2>
            <p className="text-[#9CA3AF] leading-relaxed mb-3">The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>Using bots, scripts, or automated tools to earn VERSE tokens</li>
              <li>Creating multiple accounts to abuse referral bonuses</li>
              <li>Manipulating ad clicks or impressions fraudulently</li>
              <li>Sharing account credentials with others</li>
              <li>Any activity that violates applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Withdrawals</h2>
            <ul className="list-disc list-inside text-[#9CA3AF] space-y-2">
              <li>Minimum withdrawal: 1,000 VERSE for EasyPaisa/JazzCash</li>
              <li>Minimum withdrawal: 5,000 VERSE for USDT crypto</li>
              <li>Withdrawals are processed within 1-3 business days</li>
              <li>We reserve the right to verify identity before processing withdrawals</li>
              <li>Fraudulent withdrawal requests will result in account termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Account Termination</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We reserve the right to suspend or terminate your account at any time if you violate these
              Terms of Service. Upon termination, any accumulated VERSE tokens may be forfeited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Advertising</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              Our platform displays third-party advertisements. By using VerseEarn, you agree to view
              sponsored content as part of the earning mechanism. We are not responsible for the content
              of third-party advertisements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              VerseEarn is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
              service or specific earning amounts. Earning rates may change based on advertiser demand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              VerseEarn shall not be liable for any indirect, incidental, or consequential damages arising
              from your use of the platform. Our total liability shall not exceed the amount of VERSE tokens
              in your account at the time of the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Changes to Terms</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the platform after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact</h2>
            <p className="text-[#9CA3AF] leading-relaxed">
              For questions about these Terms, contact us at:
              <br />
              <a href="mailto:uzaifngaori56@gmail.com" className="text-[#7C3AED] hover:underline">uzaifngaori56@gmail.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
