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
    <div className="rounded-lg border border-[#2DD4BF]/20 bg-[#101416] shadow-2xl shadow-[#2DD4BF]/10">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
            Live Operations
          </p>
          <p className="mt-1 text-sm text-white">KL-PJ Clinic Network</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2DD4BF]/10 px-3 py-1 text-xs text-[#2DD4BF]">
          <CircleDot className="size-3 fill-[#2DD4BF]" />
          Active
        </span>
      </div>

      <div className="grid border-b border-white/10 md:grid-cols-3">
        {metrics.map(({ value, label, icon: Icon }) => (
          <div key={label} className="border-white/10 px-5 py-6 md:border-r md:last:border-r-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <Icon className="size-4 text-[#2DD4BF]" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 p-4">
        {activity.map(({ label, text, meta, icon: Icon }) => (
          <div key={text} className="flex items-center gap-4 rounded-md px-3 py-3 transition hover:bg-white/[0.03]">
            <Icon className="size-4 shrink-0 text-[#2DD4BF]" />
            <p className="w-20 shrink-0 text-xs font-black uppercase tracking-[0.18em] text-white/35">
              {label}
            </p>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/72">{text}</p>
              <p className="mt-0.5 text-xs text-white/30">{meta}</p>
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2DD4BF]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#2DD4BF]">
            AI Voice Ops for Clinics
          </p>
          <h1
            className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Your clinic&apos;s call desk, always online.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/58">
            Aya answers every patient call, books the right appointment, and sends your team the summary before the phone would have stopped ringing.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="https://calendly.com/dwautomate7/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[#2DD4BF] px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#061010] transition hover:bg-[#2DD4BF]/90"
            >
              Book demo
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/12 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-[#2DD4BF]/45 hover:text-white"
            >
              Request AI call
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center rounded-full border border-transparent px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/45 transition hover:text-[#2DD4BF]"
            >
              See live call
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-black uppercase tracking-[0.18em] text-white/38">
            <span>PDPA-aware</span>
            <span>PJ/KL support</span>
            <Link href="/#pricing" className="transition hover:text-[#2DD4BF]">
              From RM1,999/month
            </Link>
          </div>
        </div>

        <OperationsPanel />
      </div>
    </section>
  )
}
