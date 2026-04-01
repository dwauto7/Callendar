import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

const tiers = [
  {
    name: 'Launch',
    price: 'RM 1,999',
    period: '/ month',
    setupFee: '+ RM 2,500 setup fee',
    description: 'Best for steady inbound volume.',
    credits: '~200 appointments / month',
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
  },
  {
    name: 'Growth',
    price: 'RM 3,399',
    period: '/ month',
    setupFee: '+ RM 3,000 setup fee',
    description: 'Built for high-volume clinics.',
    credits: '~ Est. 400 appointments / month',
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
  },
  {
    name: 'Network',
    price: 'RM 5,000',
    period: '/ month',
    setupFee: '+ RM 4,000 setup fee',
    description: 'Ideal for multi-branch operations.',
    credits: '~ Est. 800 appointments / month',
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
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Flat monthly rates with no surprises. All plans include dashboard access, full call handling, transcripts, and 24/7 support.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch perspective">
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl transition-all duration-300 ${
                tier.highlight
                  ? 'ring-2 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20 md:scale-105'
                  : 'hover:shadow-lg hover:shadow-slate-800/50'
              }`}
              style={{
                background: tier.highlight
                  ? 'linear-gradient(135deg, rgba(6, 28, 43, 0.8) 0%, rgba(8, 51, 68, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(20, 28, 50, 0.5) 100%)',
                backdropFilter: 'blur(12px)',
                border: tier.highlight ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(71, 85, 105, 0.3)',
              }}
            >
              {/* Badge for highlighted tier */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: 'rgb(34, 211, 238)' }}
                  >
                    {tier.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    {tier.name}
                  </p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400 font-normal ml-2">{tier.period}</span>
                  </div>
                  <p className="text-sm text-slate-400">{tier.setupFee}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">{tier.description}</p>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full h-12 rounded-xl font-semibold text-sm mb-8 transition-all duration-200 ${
                    tier.highlight
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-950'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                  }`}
                >
                  <a href="https://calendly.com/dwautomate7/30min" target="_blank" rel="noopener noreferrer">
                    {tier.cta}
                  </a>
                </Button>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-400">{tier.credits}</span>
                    </p>
                    <p className="text-xs text-slate-500">{tier.overageRate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">
            Need something custom? <a href="tel:+601114399466" className="text-cyan-400 hover:text-cyan-300 font-semibold">Contact us</a>
          </p>
          <p className="text-xs text-slate-500 mt-4">
            All plans include on-site staff training for PJ/KL clinics
          </p>
        </div>
      </div>
    </section>
  )
}