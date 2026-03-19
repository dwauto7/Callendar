import {
  CalendarCheck, Moon, ShieldCheck, BarChart3, MessageSquare, Search, Zap
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'High-Value Lead Priority',
    description:
      'The "Red Tag" system identifies high-ticket inquiries (like implants or surgery) for immediate staff follow-up.',
  },
  {
    icon: CalendarCheck,
    title: 'Autopilot Scheduling',
    description:
      'Seamlessly books appointments into your existing calendar - eliminating manual entry and double-bookings.',
  },
  {
    icon: CalendarCheck,
    title: 'Self-Service Rescheduling',
    description:
      'Patients can reschedule or confirm appointments without staff intervention, reducing no-shows.',
  },
  {
    icon: Moon,
    title: '24/7 Revenue Capture',
    description:
      'Captures patient leads during peak hours, lunch breaks, and late nights. Your clinic never truly closes.',
  },
  {
    icon: ShieldCheck,
    title: 'PDPA 2010 Compliance',
    description:
      'Built with Malaysian data laws in mind. Automated data purging and secure local encryption for patient privacy.',
  },
  {
    icon: BarChart3,
    title: 'Intelligence Dashboards',
    description:
      'Track ROI, peak call times, and conversion rates with high-fidelity performance reports delivered monthly.',
  },
  {
    icon: MessageSquare,
    title: 'Instant WhatsApp Alerts',
    description:
      'Your staff receives live notifications for every booking, including a summary of the patient’s specific needs.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="size-3 text-[#40E0FF]" />
            <span className="text-[10px] font-bold text-[#40E0FF] uppercase tracking-widest">Capabilities</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Convert more calls.{' '}
            <span className="text-[#40E0FF]">Delight every patient.</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            Aya captures intent, qualifies high-value leads, and books directly into your workflow - without new software for your team to learn.
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
