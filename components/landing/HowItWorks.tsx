import { Phone, Cpu, BellRing, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'Instant Acquisition',
    description:
      'Patients call in? Aya answers instantly and handles concurrent calls.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Clinical Intelligence',
    description:
      'Aya qualifies intent, confirms eligibility, and books directly into your calendar.',
  },
  {
    number: '03',
    icon: BellRing,
    title: 'Instant Staff Updates',
    description:
      'Staff get instant summaries and transcripts so follow-ups are effortless.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 rounded-full px-4 py-1.5 mb-6">
            <Zap className="size-3 text-[#2DD4BF]" />
            <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.25em]">The Outcomes</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Three steps. <span className="text-[#2DD4BF]">Immediate bookings.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            Keep your number, keep your tools. We plug in and start capturing bookings in days.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-[#2DD4BF]/0 via-[#2DD4BF]/40 to-[#2DD4BF]/0" />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 size-20 rounded-2xl flex items-center justify-center mb-6 border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
                <Icon className="size-8 text-[#2DD4BF]" />
                <span
                  className="absolute -top-3 -right-3 size-8 rounded-xl flex items-center justify-center text-[11px] font-black border border-[#212129] bg-[#121216] text-[#2DD4BF]"
                >
                  {number}
                </span>
              </div>

              <h3
                className="text-xl font-semibold text-white mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed max-w-[260px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
