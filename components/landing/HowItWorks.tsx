'use client'

import { Phone, Cpu, BellRing, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'Instant Acquisition',
    description:
      'A high-ticket lead calls your clinic. Our AI Blizzard engine picks up in <1 second - no hold times, no missed revenue.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Clinical Intelligence',
    description:
      'The AI identifies the patient intent, handles trilingual inquiries, and syncs directly with your clinic software in real-time.',
  },
  {
    number: '03',
    icon: BellRing,
    title: 'Priority Execution',
    description:
      'Your staff receives a "Red Tag" WhatsApp notification for high-value leads. Full transcripts are logged instantly.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="size-3 text-[#40E0FF]" />
            <span className="text-[10px] font-bold text-[#40E0FF] uppercase tracking-widest">The Architecture</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Three steps. <span className="text-[#40E0FF]">Immediate lift.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
            Keep your number, keep your tools. We plug in the intelligence layer and start booking within days.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Animated connector line - now using Cyan gradient */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-[#40E0FF]/0 via-[#40E0FF]/40 to-[#40E0FF]/0" />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative group flex flex-col items-center text-center">
              {/* Icon Container with Glassmorphism */}
              <div
                className="relative z-10 size-24 rounded-3xl flex items-center justify-center mb-8 glass-panel border border-white/10 transition-all duration-500 group-hover:border-[#40E0FF]/50 group-hover:cyan-glow"
              >
                <Icon className="size-10 text-[#40E0FF]" />
                
                {/* Step Number Badge */}
                <span
                  className="absolute -top-3 -right-3 size-8 rounded-xl flex items-center justify-center text-[11px] font-black border border-white/10 bg-[#0B0D10] text-[#40E0FF] shadow-xl"
                >
                  {number}
                </span>
              </div>

              <h3
                className="text-xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-[260px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
