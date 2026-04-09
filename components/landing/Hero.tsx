import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarCheck, Clock, TrendingUp, Zap, CheckCircle2, ShieldCheck, Search } from 'lucide-react'

// Updated Mockup with Live Call Activity and Glassmorphism
function DashboardMockup() {
  const stats = [
    { label: 'Revenue Recovered', value: 'RM 14,250', icon: TrendingUp, color: '#2DD4BF' },
    { label: 'Appointments booked', value: '42', icon: CalendarCheck, color: '#2DD4BF' },
    { label: 'Front Desk Hours Saved', value: '18.5h', icon: Clock, color: '#2DD4BF' },
    { label: 'Live Call Alerts', value: '12', icon: Search, color: '#2DD4BF' },
  ]

  const calls = [
    { name: 'Dr. Sarah (Implant)', time: 'Just now', dur: '4.2m', status: 'Handled' },
    { name: 'Tan Sri Chen', time: '14 mins ago', dur: '2.1m', status: 'Booked' },
    { name: 'Zulhaidi Rahim', time: '1h ago', dur: '1.8m', status: 'Booked' },
  ]

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto [--mockup-transform:none] lg:[--mockup-transform:perspective(1200px)_rotateY(-8deg)_rotateX(4deg)] [transform:var(--mockup-transform)]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl bg-[#2DD4BF]/10 blur-3xl scale-95 opacity-40 pointer-events-none" />

      {/* Main Glass Window */}
      <div className="relative rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden shadow-2xl">
        {/* Window Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#212129] bg-black/20">
          <div className="size-2.5 rounded-full bg-white/20" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-[#2DD4BF]/60" />
          <div className="flex-1 mx-4 h-5 rounded-md bg-black/20 flex items-center px-2">
            <span className="text-[9px] text-white/40 tracking-tight">beaconhorizons.io/portal</span>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden sm:flex w-[150px] flex-col border-r border-[#212129] bg-black/20 p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-7 rounded-lg border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 flex items-center justify-center">
                <Zap className="size-4 text-[#2DD4BF]" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Beacon Horizons</span>
            </div>
            {['Overview', 'Calls', 'Settings'].map((label, idx) => (
              <div
                key={label}
                className={`mb-2 rounded-lg px-3 py-2 text-[9px] font-black uppercase tracking-widest ${
                  idx === 1
                    ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20'
                    : 'text-white/40'
                }`}
              >
                {label}
              </div>
            ))}
            <div className="mt-auto rounded-lg border border-[#212129] bg-black/20 px-3 py-2 text-[8px] text-white/40 uppercase tracking-widest">
              Node: KL-PJ-01
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
                Intelligence Hub
              </p>
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 animate-pulse">
                System Active
              </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-xl border border-[#212129] bg-black/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] text-white/50 uppercase tracking-widest">{label}</p>
                    <Icon className="size-3" style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-white tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Call Log Preview */}
            <div className="rounded-xl border border-[#212129] bg-black/20 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-black/20 border-b border-[#212129]">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                  Voice Logs
                </p>
                <span className="text-[8px] text-white/20 uppercase tracking-widest">Live</span>
              </div>
              {calls.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-3 py-2 border-b border-[#212129] last:border-0">
                  <div>
                    <p className="text-[10px] font-semibold text-white">{c.name}</p>
                    <p className="text-[8px] text-white/40">{c.time} | {c.dur}</p>
                  </div>
                  <span className="text-[8px] font-black px-2 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating PDPA Badge */}
      <div className="absolute -bottom-4 -left-4 bg-black/20 px-4 py-2 rounded-xl flex items-center gap-2 border border-[#212129]">
        <ShieldCheck className="size-4 text-[#2DD4BF]" />
        <span className="text-[10px] font-black text-white">PDPA 2010 Compliant</span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none hidden"
        style={{ backgroundImage: 'radial-gradient(#2DD4BF 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 rounded-full px-4 py-1.5 mb-8">
              <Zap className="size-3.5 text-[#2DD4BF]" />
              <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.25em]">
                Intelligence
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold text-white leading-[1.05] tracking-tight mb-8" style={{ fontFamily: 'var(--font-syne)' }}>
              Never Miss <br />
              <span className="text-[#2DD4BF]">A Patient.</span>
            </h1>

            <p className="text-base md:text-lg text-white/50 font-normal max-w-xl leading-relaxed mb-10">
              Aya answers every call instantly and books appointments while your team stays focused.
              Handles concurrent calls with zero hold time.
              <span className="text-white font-semibold"> Fully PDPA-safe.</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors h-auto"
              >
                <a href="https://calendly.com/dwautomate7/30min" target="_blank" rel="noopener noreferrer">
                  BOOK A DEMO
                  <ArrowRight className="size-4 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border border-[#212129] text-white/60 font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:border-[#2DD4BF]/40 hover:text-white transition-colors h-auto"
              >
                <a href="/#demo">SEE A LIVE CALL</a>
              </Button>
            </div>

            <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/40">
              Always-on coverage, zero missed calls.
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 opacity-70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#2DD4BF]" />
                <span className="text-[11px] font-black text-white tracking-widest uppercase">14-Day Data Purge</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#2DD4BF]" />
                <span className="text-[11px] font-black text-white tracking-widest uppercase">Local PJ/KL Support</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center relative mt-12 lg:mt-0">
            <div className="w-full max-w-[620px] scale-[0.95] sm:scale-100">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
