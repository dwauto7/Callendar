import {
  CalendarCheck, Moon, ShieldCheck, BarChart3, MessageSquare, Search, Zap
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Every Call Answered',
    description:
      'No busy signals or missed calls. Aya handles every inbound patient instantly.',
  },
  {
    icon: CalendarCheck,
    title: 'More Appointments, Less Admin',
    description:
      'Aya books directly into your calendar, removing back-and-forth and freeing staff from constant phone duty.',
  },
  {
    icon: CalendarCheck,
    title: 'Fewer No-Shows',
    description:
      'Self-service confirmations and reschedules keep your schedule full without extra staff work.',
  },
  {
    icon: Moon,
    title: 'Never Miss a Call',
    description:
      'Always-on coverage captures bookings during lunch, after hours, and peak surges.',
  },
  {
    icon: ShieldCheck,
    title: 'PDPA-Safe by Design',
    description:
      'Built for Malaysian compliance with secure handling, retention controls, and privacy-first workflows.',
  },
  {
    icon: BarChart3,
    title: 'Clear ROI Visibility',
    description:
      'See bookings, conversion rates, and revenue impact without manual reporting.',
  },
  {
    icon: MessageSquare,
    title: '24-Hour Patient Reminders',
    description:
      'Automatic reminders go out 24 hours before appointments to reduce no-shows.',
  },
  {
    icon: Zap,
    title: 'Handles Concurrent Calls',
    description:
      'Multiple patients can call at the same time? Aya answers all of them without queues or busy signals.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="size-3 text-[#40E0FF]" />
            <span className="text-[10px] font-bold text-[#40E0FF] uppercase tracking-widest">Outcomes</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Secure more patients.{' '}
            <span className="text-[#40E0FF]">Stress less.</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            Aya turns every inbound call into a booked appointment or a clear next step, without extra headcount.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-2 group glass-panel overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute -bottom-10 -right-10 size-32 bg-[#40E0FF]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div
                  className="size-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:cyan-glow bg-white/5 border border-white/10"
                >
                  <Icon className="size-6 text-[#40E0FF]" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-3 tracking-tight"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
