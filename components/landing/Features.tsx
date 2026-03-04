import {
  FileText, CalendarCheck, Moon, Zap, BarChart3, MessageSquare,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Call Logs & Transcripts',
    description:
      'Every call is recorded and transcribed. AI summaries let you catch up in seconds, not minutes.',
    color: '#3B82F6',
  },
  {
    icon: CalendarCheck,
    title: 'Direct Calendar Booking',
    description:
      'Aya books appointments straight into Google Calendar — no double-entry, no errors, no delays.',
    color: '#10B981',
  },
  {
    icon: Moon,
    title: 'After-Hours Handling',
    description:
      'Aya works 24/7. Patients calling at midnight get the same seamless experience as peak hours.',
    color: '#8B5CF6',
  },
  {
    icon: Zap,
    title: 'Credits & Usage Tracking',
    description:
      'Know exactly how many minutes you\'ve used. Low-balance alerts keep you from running dry.',
    color: '#F59E0B',
  },
  {
    icon: BarChart3,
    title: 'Monthly Performance Reports',
    description:
      'Calls, bookings, revenue generated, ROI — all in one clean monthly report card.',
    color: '#10B981',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Notifications',
    description:
      'Your team gets instant WhatsApp alerts for every new booking — no app to check, no refresh needed.',
    color: '#10B981',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16 fade-in-up">
          <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-3">
            Features
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Everything your front desk does.{' '}
            <span className="text-[#10B981]">Automated.</span>
          </h2>
          <p className="text-[#64748B] max-w-lg mx-auto">
            Aya handles inbound calls, books appointments, and gives your clinic a full audit trail — all without lifting a finger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description, color }, idx) => (
            <div
              key={title}
              className="relative rounded-xl border border-[#1E2128] bg-[#111318] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#10B981]/40 group"
              style={{ background: `linear-gradient(135deg, #111318 70%, ${color}06 100%)` }}
            >
              {/* Animated top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="relative z-10">
                <div
                  className="size-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:shadow-lg"
                  style={{
                    background: `${color}15`,
                  }}
                >
                  <Icon className="size-5" style={{ color }} />
                </div>
                <h3
                  className="text-base font-bold text-[#F1F5F9] mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
