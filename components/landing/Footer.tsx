'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-white/5 py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 size-64 bg-[#40E0FF]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Identity */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 bg-[#40E0FF] rounded flex items-center justify-center">
                <Zap className="size-4 text-[#0B0D10] fill-current" />
              </div>
              <span 
                className="text-lg font-black text-white tracking-tighter uppercase"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                AI Blizzard
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
              High-performance AI architecture for elite dental and chiropractic clinics in Malaysia. 
            </p>
          </div>

          {/* Product Architecture */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Solutions
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Voice Systems', href: '#how-it-works' },
                { label: 'Clinical Intelligence', href: '#features' },
                { label: 'Revenue Engine', href: '#pricing' },
                { label: 'Client Portal', href: '/dashboard' }
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/40 hover:text-[#40E0FF] transition-colors duration-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultancy & Partnership */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Consultancy
            </p>
            <p className="text-sm text-white/40 mb-5">
              AI automation audit and custom workflow design. Tell us what you want to automate.
            </p>
            <Link
              href="/consultancy"
              className="w-full inline-block rounded-md bg-[#40E0FF] text-[#0B0D10] text-xs font-black uppercase tracking-[0.2em] py-3 text-center transition hover:brightness-110"
            >
              Book Consultancy
            </Link>
          </div>

          {/* Legal Intelligence */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Compliance
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Privacy & PDPA', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Data Security', href: '/cookie-policy' }
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              © {year} AI Blizzard
            </p>
            <span className="text-white/10 text-xs">|</span>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              aiblizzard.work
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <span className="size-1.5 rounded-full bg-[#40E0FF] animate-pulse" />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
              Operating in PJ & KL, Malaysia 🇲🇾
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}