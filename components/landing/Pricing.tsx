'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Zap } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    price: 'RM 1,999',
    period: '/ month',
    setupFee: 'RM 1,500 setup',
    description: 'Full Aya experience for active clinics.',
    credits: '1,000 minutes/mo',
    highlight: true,
    cta: 'Get Started',
    features: [
      '1,000 mins of Aya calls',
      'WhatsApp appointment reminders',
      'Full call logs, transcripts & summaries',
      'Google Calendar booking',
      'After-hours handling',
      'Monthly dashboard & analytics',
      'Overage at RM 1.50/min',
    ],
  },
  {
    name: 'Scale',
    price: 'RM 3,499',
    period: '/ month',
    setupFee: 'RM 3,000 setup',
    description: 'For growing clinics requiring extended coverage..',
    credits: '2,000 minutes/mo',
    highlight: false,
    cta: 'Get Started',
    features: [
      '2,000 mins of Aya calls',
      'Everything in Starter',
      'Dual language availability (English, Bahasa Melayu )',
      'Priority support',
      'Overage at RM 1.50/min',
    ],
  },
  {
    name: 'Pro',
    price: 'RM 6,399',
    period: '/ month',
    setupFee: 'RM 5,000 setup',
    description: 'Enterprise-grade coverage for large clinics.',
    credits: '4,000 minutes/mo',
    highlight: false,
    cta: 'Get Started',
    features: [
      '4,000 mins of Aya calls',
      'Everything in Growth',
      'Multilingual availability (English, Bahasa Melayu, Mandarin)',
      'Dedicated account manager',
      'SLA response guarantee',
      'Overage at RM 1.50/min',
    ],
  },
]

export function Pricing() {
  const router = useRouter()

  async function handleCTA() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard/overview')
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <section id="pricing" className="py-24 bg-[#0D0F12]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16 fade-in-up">
          <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Simple, credits-based pricing.
          </h2>
          <p className="text-[#64748B] max-w-md mx-auto">
            Pay for what you use. Every subscription includes the full Aya experience — no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-7 transition-all duration-300 ${
                tier.highlight
                  ? 'border-[#10B981]/40 bg-[#111318] shadow-2xl shadow-[#10B981]/25 border-pulse-animate'
                  : 'border-[#1E2128] bg-[#111318] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40'
              }`}
              style={
                tier.highlight
                  ? { background: 'linear-gradient(160deg, #111318 60%, rgba(16,185,129,0.06) 100%)' }
                  : undefined
              }
            >
              {/* Animated gradient border for Starter */}
              {tier.highlight && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                  padding: '1px',
                  background: 'linear-gradient(90deg, #10B981 0%, #14B8A6 50%, #10B981 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 3s ease-in-out infinite',
                  opacity: 0.3,
                  borderRadius: '16px'
                }} />
              )}

              <div className="relative z-10">
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="flex items-center gap-1.5 bg-[#10B981] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-[#10B981]/30">
                      <Zap className="size-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p
                    className="text-sm font-bold text-[#64748B] uppercase tracking-widest mb-2"
                  >
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className="text-4xl font-bold text-[#F1F5F9]"
                      style={{ fontFamily: 'var(--font-syne)' }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-sm text-[#64748B]">{tier.period}</span>
                  </div>
                  <p className="text-xs text-[#10B981] font-semibold mb-2">
                    {tier.credits}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded bg-[#1E2128] text-xs font-medium mb-3 ${
                      tier.name === 'Pilot'
                        ? 'text-[#10B981]'
                        : 'text-[#F1F5F9]'
                    }`}
                  >
                    {tier.setupFee}
                  </span>
                  <p className="text-sm text-[#64748B]">{tier.description}</p>
                </div>

                <Button
                  onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
                  className={`w-full font-semibold mb-7 ${
                    tier.highlight
                      ? 'bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] shadow-lg shadow-[#10B981]/20'
                      : 'bg-[#1E2128] hover:bg-[#2A3040] text-[#F1F5F9] border border-[#2A3040]'
                  }`}
                >
                  {tier.cta}
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#64748B]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#64748B] mt-8">
          All plans include overage billing at RM 1.50/min.
          <br />
          Questions? WhatsApp us at (+60) 111 - 4399 466.
        </p>
      </div>
    </section>
  )
}
