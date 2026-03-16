'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

const tiers = [
  {
    name: 'Launch',
    price: 'RM 1,800',
    period: '/ month',
    setupFee: 'RM 3,000 Setup',
    description: 'For clinics starting 24/7 call capture.',
    credits: '500 Monthly Minutes',
    highlight: false,
    cta: 'Book Demo',
    features: [
      'Dashboard + Insights',
      'WhatsApp Reminders + Booking Confirmation',
      'Full Call Transcripts & Summaries',
      '24/7 Availability',
      'English Language (Bahasa soon)',
      'Overage RM 2.0/min',
    ],
  },
  {
    name: 'Growth',
    price: 'RM 3,200',
    period: '/ month',
    setupFee: 'RM 4,500 Setup',
    description: 'Most popular for high-volume clinics.',
    credits: '1,500 Monthly Minutes',
    highlight: true,
    cta: 'Book Demo',
    features: [
      'Dashboard + Insights',
      'WhatsApp Reminders + Booking Confirmation',
      'Full Call Transcripts & Summaries',
      '24/7 Availability',
      'English Language (Bahasa soon)',
      'Overage RM 1.8/min',
    ],
  },
  {
    name: 'Network',
    price: 'RM 5,500',
    period: '/ month',
    setupFee: 'RM 6,000 Setup',
    description: 'Best for multi-branch clinics.',
    credits: '3,000 Monthly Minutes',
    highlight: false,
    cta: 'Book Demo',
    features: [
      'Dashboard + Insights',
      'WhatsApp Reminders + Booking Confirmation',
      'Full Call Transcripts & Summaries',
      '24/7 Availability',
      'Multi-branch Synchronization',
      'Overage RM 1.5/min',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#40E0FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[10px] font-bold text-[#40E0FF] uppercase tracking-[0.2em]">ROI Focused</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
            Invest in predictable <span className="text-[#40E0FF]">patient flow.</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Transparent pricing for clinics that want more bookings, less admin time, and a premium patient experience.
          </p>
          <p className="mt-4 text-white/40 text-xs uppercase tracking-widest">
            Annual Prepay: 15-20% off first-year monthly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 glass-panel border border-white/10 ${
                tier.highlight ? 'ring-2 ring-[#40E0FF] scale-105 z-10 shadow-2xl shadow-[#40E0FF]/20' : 'hover:border-white/20'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#40E0FF] text-[#0B0D10] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Recommended for Clinics
                  </span>
                </div>
              )}

              <div className="mb-8">
                <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                    {tier.price}
                  </span>
                  <span className="text-sm text-white/40 font-medium">{tier.period}</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-[#40E0FF] mb-4">
                  {tier.setupFee}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{tier.description}</p>
              </div>

              <Button
                onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
                className={`w-full h-12 rounded-xl font-bold text-sm mb-8 transition-all ${
                  tier.highlight
                    ? 'bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] cyan-glow'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {tier.cta}
              </Button>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-[#40E0FF] shrink-0 mt-0.5" />
                    <span className="text-sm text-white/70 font-medium leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 opacity-50">
                  <ShieldCheck className="size-3 text-[#40E0FF]" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-tighter">{tier.credits}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#40E0FF]">
            Launch Promo
          </div>
          <p className="mt-3 text-white/60 text-sm">
            First 10 clinics: 50% off setup fee for sign-ups in the next 30 days.
          </p>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-white/40 text-xs">
            All deployments include on-site staff training for PJ/KL clinics. 
            <br />
            Need a custom setup? WhatsApp: <span className="text-white font-bold">(+60) 111-4399 466</span>
          </p>
        </div>
      </div>
    </section>
  )
}
