import { Phone, Bot, Bell } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'Patient Calls',
    description:
      'A patient calls your clinic number — any time, day or night. Aya picks up instantly, no hold music, no voicemail.',
    color: '#3B82F6',
  },
  {
    number: '02',
    icon: Bot,
    title: 'Aya Answers & Books',
    description:
      'Aya converses naturally, collects patient details, and books directly into your Google Calendar — all in real time.',
    color: '#10B981',
  },
  {
    number: '03',
    icon: Bell,
    title: 'Clinic Gets Notified',
    description:
      'Your team gets an instant WhatsApp notification. The appointment, transcript, and summary are logged in your dashboard.',
    color: '#8B5CF6',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0D0F12]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16 fade-in-up">
          <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#F1F5F9]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Three steps. Zero missed calls.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Animated connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px connector-animated" />

          {steps.map(({ number, icon: Icon, title, description, color }, idx) => (
            <div key={number} className={`relative flex flex-col items-center text-center ${
              idx === 0 ? 'fade-in-up-delay-1' : idx === 1 ? 'fade-in-up-delay-2' : 'fade-in-up-delay-3'
            }`}>
              {/* Icon circle */}
              <div
                className="relative z-10 size-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300"
                style={{
                  background: `${color}12`,
                  borderColor: `${color}30`,
                }}
              >
                <Icon className="size-8" style={{ color }} />
                <span
                  className="absolute -top-2 -right-2 size-6 rounded-full flex items-center justify-center text-[9px] font-bold border glow-ring"
                  style={{
                    background: '#0A0A0A',
                    borderColor: `${color}40`,
                    color,
                  }}
                >
                  {number}
                </span>
              </div>

              <h3
                className="text-lg font-bold text-[#F1F5F9] mb-2"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {title}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
