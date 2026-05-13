import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  CircleDot,
  Clock,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const metrics = [
  { value: '42', label: 'Bookings captured', icon: CalendarCheck },
  { value: '0s', label: 'Average hold time', icon: Clock },
  { value: 'RM14.2k', label: 'Revenue recovered', icon: TrendingUp },
]

const activity = [
  {
    label: 'Incoming',
    text: 'Implant consultation booked with Dr. Sarah',
    meta: 'Just now',
    icon: PhoneCall,
  },
  {
    label: 'Booked',
    text: 'Follow-up moved from Friday to Monday',
    meta: '14 mins ago',
    icon: CalendarCheck,
  },
  {
    label: 'Secure',
    text: 'Transcript retained under 14-day purge policy',
    meta: 'PDPA-ready',
    icon: ShieldCheck,
  },
]

function OperationsPanel() {
  return (
    <div className="rounded-lg border border-[#40E0FF]/20 bg-[#0E1517] shadow-2xl shadow-[#40E0FF]/10">
      <div className="flex items-center justify-between gap-4 border-b border-white/12 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9DECF7]">
            Live Operations
          </p>
          <p className="mt-1 text-sm font-semibold text-white">KL-PJ Clinic Network</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#40E0FF]/12 px-3 py-1 text-xs font-semibold text-[#40E0FF]">
          <CircleDot className="size-3 fill-[#40E0FF]" />
          Active
        </span>
      </div>

      <div className="grid border-b border-white/12 md:grid-cols-3">
        {metrics.map(({ value, label, icon: Icon }) => (
          <div key={label} className="border-white/12 px-5 py-6 md:border-r md:last:border-r-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <Icon className="size-4 text-[#40E0FF]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B7C7CA]">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 p-4">
        {activity.map(({ label, text, meta, icon: Icon }) => (
          <div key={text} className="flex items-center gap-4 rounded-md px-3 py-3 transition hover:bg-white/[0.03]">
            <Icon className="size-4 shrink-0 text-[#40E0FF]" />
            <p className="w-20 shrink-0 text-xs font-black uppercase tracking-[0.18em] text-[#9DECF7]">
              {label}
            </p>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/82">{text}</p>
              <p className="mt-0.5 text-xs text-[#B7C7CA]/70">{meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#40E0FF]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(64,224,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#40E0FF]">
            AI Voice Ops for Clinics
          </p>
          <h1
            className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Your clinic&apos;s call desk, <span className="text-[#40E0FF]">always online.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#D9E4E6]/78">
            Aya answers every patient call, books the right appointment, and sends your team the summary before the phone would have stopped ringing.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="https://calendly.com/dwautomate7/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[#40E0FF] px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#061010] transition hover:bg-[#79EBFF]"
            >
              Book demo
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/18 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/78 transition hover:border-[#40E0FF]/50 hover:text-white"
            >
              Request AI call
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center rounded-full border border-transparent px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#B7C7CA] transition hover:text-[#40E0FF]"
            >
              See live call
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-black uppercase tracking-[0.18em] text-[#B7C7CA]">
            <span>PDPA-aware</span>
            <span>PJ/KL support</span>
            <Link href="/#pricing" className="transition hover:text-[#40E0FF]">
              From RM1,999/month
            </Link>
          </div>
        </div>

        <OperationsPanel />
      </div>
    </section>
  )
}
