import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

const tiers = [
  {
    name: 'Launch',
    price: 'RM 1,999',
    period: '/ month',
    setupFee: '+ RM 2,500 setup fee',
    description: 'Best for steady inbound volume.',
    outcome: '~200 appointments captured / month',
    credits: '500 AI voice minutes included',
    highlight: false,
    cta: 'Book Demo',
    features: [
      '500 minutes / month included',
      'Concurrent calls + calendar sync',
      'WhatsApp reminders + booking confirmation',
      'Full call transcripts & summaries',
      '24/7 availability',
      'English language',
    ],
    overageRate: 'Overage: RM 2.00 / min',
    roi: 'Typically covered by 3-6 extra booked treatments.',
  },
  {
    name: 'Growth',
    price: 'RM 3,399',
    period: '/ month',
    setupFee: '+ RM 3,000 setup fee',
    description: 'Built for high-volume clinics.',
    outcome: '~400 appointments captured / month',
    credits: '1,000 AI voice minutes included',
    highlight: true,
    cta: 'Book Demo',
    badge: 'Most popular',
    features: [
      '1,000 minutes / month included',
      'Concurrent calls + calendar sync',
      'WhatsApp reminders + booking confirmation',
      'Full call transcripts & summaries',
      '24/7 availability',
      'English language',
    ],
    overageRate: 'Overage: RM 1.50 / min',
    roi: 'Designed for clinics losing revenue to missed calls.',
  },
  {
    name: 'Multi-Branch',
    price: 'RM 5,000',
    period: '/ month',
    setupFee: '+ RM 4,000 setup fee',
    description: 'Ideal for multi-branch operations.',
    outcome: '~800 appointments captured / month',
    credits: '2,000 AI voice minutes included',
    highlight: false,
    cta: 'Book Demo',
    features: [
      '2,000 minutes / month included',
      'Concurrent calls + calendar sync',
      'WhatsApp reminders + booking confirmation',
      'Full call transcripts & summaries',
      '24/7 availability',
      'Multi-branch synchronisation',
    ],
    overageRate: 'Overage: RM 1.20 / min',
    roi: 'Centralize call handling across locations.',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.25em]">Pricing</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            Simple, transparent pricing
          </h2>
          <p className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed">
            Pricing is framed around recovered appointments, not software seats. All plans include dashboard access, full call handling, transcripts, and 24/7 support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                `relative rounded-2xl border ${
                  tier.highlight
                    ? 'border-[#2DD4BF]/40 shadow-[0_0_20px_rgba(45,212,191,0.15)]'
                    : 'border-[#212129]'
                } bg-[#121216]`
              }
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
                    {tier.badge}
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                <div className="mb-6">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                    {tier.name}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>{tier.price}</span>
                    <span className="text-white/40 font-normal ml-2">{tier.period}</span>
                  </div>
                  <p className="text-sm text-white/40">{tier.setupFee}</p>
                </div>

                <p className="text-sm text-white/40 mb-6 leading-relaxed">{tier.description}</p>

                <div className="mb-6 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 p-4">
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                    {tier.outcome}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">
                    {tier.roi}
                  </p>
                </div>

                <Button
                  asChild
                  className={
                    `w-full h-auto rounded-full font-black uppercase tracking-widest text-[11px] mb-8 transition-colors ${
                      tier.highlight
                        ? 'bg-[#2DD4BF] text-[#0A0A0B] hover:bg-[#2DD4BF]/90'
                        : 'border border-[#212129] text-white/60 hover:border-[#2DD4BF]/40 hover:text-white'
                    }`
                  }
                >
                  <a href="https://calendly.com/dwautomate7/30min" target="_blank" rel="noopener noreferrer">
                    {tier.cta}
                  </a>
                </Button>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/40 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[#212129] pt-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/45">
                      <span className="font-semibold text-white/65">{tier.credits}</span>
                    </p>
                    <p className="text-xs text-white/40">{tier.overageRate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            Need something custom? <a href="tel:+601114399466" className="text-[#2DD4BF] hover:text-[#2DD4BF]/80 font-semibold">Contact us</a>
          </p>
          <p className="text-xs text-white/35 mt-4 max-w-xl mx-auto leading-relaxed">
            Most clinics recover the monthly fee with only a handful of additional booked treatments, especially during lunch rushes, after-hours calls, and peak periods.
          </p>
          <p className="text-xs text-white/30 mt-4">
            All plans include on-site staff training for PJ/KL clinics
          </p>
        </div>
      </div>
    </section>
  )
}
