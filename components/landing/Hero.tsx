'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, PhoneCall, CalendarCheck, Clock, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'

// Mini dashboard mockup for the hero
function DashboardMockup() {
  const stats = [
    { label: 'Total Calls', value: '1,247', icon: PhoneCall, color: '#3B82F6' },
    { label: 'Appointments', value: '893', icon: CalendarCheck, color: '#10B981' },
    { label: 'Mins Saved', value: '2,840', icon: Clock, color: '#8B5CF6' },
    { label: 'Revenue', value: 'RM 134k', icon: TrendingUp, color: '#10B981' },
  ]

  const calls = [
    { name: 'Ahmad Faris', time: '2:34 PM', dur: '3.2m', booked: true },
    { name: 'Nurul Aina', time: '1:18 PM', dur: '2.1m', booked: true },
    { name: 'Lim Wei Jie', time: '11:52 AM', dur: '1.8m', booked: false },
    { name: 'Priya Nair', time: '10:07 AM', dur: '4.5m', booked: true },
  ]

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto"
      style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)'}}
    >
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-2xl bg-[#10B981]/10 blur-3xl scale-95 opacity-60 pointer-events-none" />

      {/* Main window */}
      <div className="relative rounded-2xl border border-[#1E2128] bg-[#0D0F12] overflow-hidden shadow-2xl shadow-black/60">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1E2128] bg-[#0D0F12]">
          <div className="size-2.5 rounded-full bg-[#EF4444]/70" />
          <div className="size-2.5 rounded-full bg-[#F59E0B]/70" />
          <div className="size-2.5 rounded-full bg-[#10B981]/70" />
          <div className="flex-1 mx-4 h-5 rounded-md bg-[#1E2128] flex items-center px-2">
            <span className="text-[9px] text-[#64748B]">callendar.app/dashboard</span>
          </div>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="w-28 shrink-0 bg-[#0D0F12] border-r border-[#1E2128] p-3 space-y-1.5">
            <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-wider mb-3 px-1">Callendar</p>
            {['Overview', 'Call Logs', 'Appointments', 'Credits', 'Reports'].map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[9px] font-medium transition-colors ${i === 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'text-[#64748B]'}`}
              >
                {i === 0 && <span className="absolute left-3 w-0.5 h-3 bg-[#10B981] rounded-r" />}
                {item}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-3 bg-[#0A0A0A]">
            <p className="text-[10px] font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
              Overview
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#1E2128] bg-[#111318] p-2.5"
                  style={{ background: `linear-gradient(135deg, #111318 60%, ${color}08 100%)` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[7px] text-[#64748B] uppercase tracking-wider">{label}</p>
                    <div className="rounded p-0.5" style={{ background: `${color}18` }}>
                      <Icon className="size-2" style={{ color }} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#F1F5F9] tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Credits bar */}
            <div className="rounded-lg border border-[#1E2128] bg-[#111318] p-2.5">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1">
                  <Zap className="size-2.5 text-[#10B981]" />
                  <p className="text-[8px] font-semibold text-[#F1F5F9]">Credits — 180 min left</p>
                </div>
                <span className="text-[7px] font-bold text-[#10B981]">36%</span>
              </div>
              <div className="h-1 rounded-full bg-[#1E2128]">
                <div className="h-full w-[64%] rounded-full bg-[#10B981]" />
              </div>
            </div>

            {/* Recent calls */}
            <div className="rounded-lg border border-[#1E2128] bg-[#111318] overflow-hidden">
              <p className="text-[8px] font-semibold text-[#64748B] uppercase tracking-wider px-3 py-2 border-b border-[#1E2128]">
                Recent Calls
              </p>
              {calls.map((c) => (
                <div key={c.name} className="flex items-center justify-between px-3 py-1.5 border-b border-[#1E2128]/50 last:border-0">
                  <div>
                    <p className="text-[9px] font-medium text-[#F1F5F9]">{c.name}</p>
                    <p className="text-[7px] text-[#64748B]">{c.time} · {c.dur}</p>
                  </div>
                  {c.booked && (
                    <span className="text-[7px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                      Booked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-[#10B981] text-[#0A0A0A] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-[#10B981]/30">
        Live
      </div>
    </div>
  )
}

export function Hero() {
  const router = useRouter()

  async function handleAuth() {
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
    <section className="relative min-h-screen flex items-center overflow-hidden grain">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#10B981 1px, transparent 1px),
            linear-gradient(90deg, #10B981 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Aurora background */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute -top-1/2 left-1/4 w-[900px] h-[900px] bg-[#10B981]/20 rounded-full blur-[160px] animate-pulse" />
      <div
         className="absolute top-1/3 -right-1/4 w-[800px] h-[800px] bg-[#3B82F6]/15 rounded-full blur-[160px] animate-pulse delay-1000" />
      <div 
        className="absolute bottom-[-30%] left-1/3 w-[700px] h-[700px] bg-[#8B5CF6]/10 rounded-full blur-[160px] animate-pulse delay-2000" />
      </div>
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — headline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-6">
              <CheckCircle2 className="size-3.5 text-[#10B981]" />
              <span className="text-xs font-semibold text-[#10B981]">
                AI-powered clinic receptionist
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F1F5F9] leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Your Clinic&apos;s{' '}
              <span className="text-[#10B981]">AI Receptionist.</span>
              <br />
              Always On.
            </h1>

            <p className="text-lg text-[#64748B] leading-relaxed mb-8 max-w-md">
              Never miss a call. Book appointments 24/7.
              <br />
              Let <span className="text-[#F1F5F9] font-medium">Aya</span> handle it — so your staff doesn&apos;t have to.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
                className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-bold text-sm h-11 px-6 shadow-lg shadow-[#10B981]/20"
              >
                Book a Demo
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-[#1E2128] bg-transparent text-[#F1F5F9] hover:bg-[#1E2128] h-11 px-5 text-sm"
              >
                See how it works
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-5">
              {[
                'No lock-in contract',
                'Setup in 24 hours',
                'Cancel anytime',
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <CheckCircle2 className="size-3.5 text-[#10B981] shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="hidden lg:flex justify-center">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
