'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

const solutions = [
  { label: 'Voice Systems',         href: '#how-it-works' },
  { label: 'Clinical Intelligence', href: '#features'     },
  { label: 'Revenue Engine',        href: '#pricing'      },
  { label: 'Client Portal',         href: '/dashboard'    },
]

const compliance = [
  { label: 'Privacy & PDPA',   href: '/privacy-policy'   },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Data Security',    href: '/cookie-policy'    },
]

export function Footer() {
  return (
    <footer className="transform-gpu bg-[#0A0A0B] border-t border-[#212129] py-20 relative overflow-hidden">

      <div className="absolute bottom-0 right-0 size-64 bg-[#2DD4BF]/5 blur-[80px] pointer-events-none will-change-transform" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-7 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 flex items-center justify-center">
                <Zap className="size-4 text-[#2DD4BF]" />
              </div>
              <span
                className="text-lg font-black text-white tracking-tighter uppercase"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Beacon Horizons
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
              High-performance AI architecture for elite dental and chiropractic clinics in Malaysia.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Solutions
            </p>
            <ul className="space-y-4">
              {solutions.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/40 hover:text-[#2DD4BF] transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Get Started
            </p>
            <p className="text-sm text-white/40 mb-5">
              Ready to transform your clinic? Book a demo or contact us for custom automation solutions.
            </p>
            <Link
              href="/contact"
              className="w-full inline-block rounded-full bg-[#2DD4BF] text-[#0A0A0B] text-[11px] font-black uppercase tracking-widest py-3 text-center transition-colors hover:bg-[#2DD4BF]/90"
            >
              Contact Us
            </Link>
          </div>

          {/* Compliance */}
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">
              Compliance
            </p>
            <ul className="space-y-4">
              {compliance.map((l) => (
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

        {/* Bottom bar */}
        <div className="border-t border-[#212129] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              &copy; {YEAR} Beacon Horizons
            </p>
            <span className="text-white/10 text-xs">|</span>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              beaconhorizons.io
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-[#212129] contain-layout">
            <span className={`size-1.5 rounded-full bg-[#2DD4BF] ${styles.pulse}`} />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
              Operating in PJ &amp; KL, Malaysia
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}