import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2D2D4E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-black">
                <span className="text-[#7C3AED]">⚡</span>
                <span className="text-white">Verse</span>
                <span className="text-[#F59E0B]">Earn</span>
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Pakistan ka #1 earning platform. Ghar baithe VERSE tokens kamao aur real cash mein withdraw karo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '#' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: 'mailto:uzaifngaori56@gmail.com' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#9CA3AF] hover:text-[#7C3AED] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', icon: 'f', href: '#' },
                { label: 'Twitter', icon: 'X', href: '#' },
                { label: 'Instagram', icon: '📷', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[#1A1A2E] border border-[#2D2D4E] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#7C3AED] transition-colors text-sm font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-xs mt-4">
              Support: support@versearn.pk
            </p>
          </div>
        </div>

        <div className="border-t border-[#2D2D4E] pt-6 text-center">
          <p className="text-[#9CA3AF] text-sm">
            © 2025 VerseEarn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
