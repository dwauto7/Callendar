import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0D0F12] border-t border-[#1E2128] py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p
              className="text-xl font-bold text-[#F1F5F9] mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Callendar
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-[200px]">
              AI receptionist for Malaysian clinics. Always on, never misses a call.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest mb-4">
              Product
            </p>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Dashboard', href: '#dashboard' }
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers'].map((l) => (
                <li key={l}>
                  <span className="text-sm text-[#64748B]">{l}</span>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest mb-4">
              Legal
            </p>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                <li key={l}>
                  <span className="text-sm text-[#64748B]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E2128] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748B]">
            © {year} Callendar. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            Built for Malaysian clinics 🇲🇾
          </p>
        </div>
      </div>
    </footer>
  )
}
