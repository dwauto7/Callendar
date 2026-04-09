import { redirect } from 'next/navigation'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { CreditsChartsClient } from '@/components/dashboard/credits/CreditsChartsClient'
import { CreditsLogsClient } from '@/components/dashboard/credits/CreditsLogsClient'
import { cn } from '@/lib/utils'
import { timeAsync } from '@/lib/perf'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

export const metadata = { title: 'Credits — Callendar' }

// Keep your CircularProgress exactly as is, but update the default colors
function CircularProgress({ pct, color, size = 160 }: { pct: number, color: string, size?: number }) {
  const r = (size / 2) * 0.72
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const cx = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={10} />
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 6px ${color}40)` }}
      />
    </svg>
  )
}

export default async function CreditsPage() {
  const supabase = await createClient()
  const { data: { user } } = await timeAsync('credits:get_user', async () => supabase.auth.getUser())
  if (!user) redirect('/')

  const clinicContext = await timeAsync('credits:clinic_user', async () =>
    getClinicContext(supabase, user.id)
  )
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const id = clinicContext.clinicConfigId

  const [creditsRes, callsRes] = await Promise.all([
    supabase.from('credits').select('*').eq('clinic_config_id', id).single(),
    supabase.from('call_logs')
      .select('id, client_name, patient_phone, duration_min, minutes_saved, is_after_hours, appointment_id, aya_usage_cost_rm, created_at, clinic_config_id, summary, recording_url')
      .eq('clinic_config_id', id)
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  const credits = creditsRes?.data
  const calls = callsRes?.data ?? []

  const balance = credits?.balance ?? 0
  const used = credits?.minutes_used ?? 0
  const total = credits?.total_credits_mins ?? 0
  const usedPct = total > 0 ? Math.round((used / total) * 100) : 0
  const remainPct = 100 - usedPct
  const isLow = remainPct < 20
  const isActive = credits?.status?.toLowerCase() === 'active'

  // Using the Electric Cyan for healthy status
  const accentColor = isLow ? '#F59E0B' : '#2DD4BF'

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto space-y-6">
      <div className="relative rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
            <Zap className="size-5 text-[#2DD4BF]" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight leading-none text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Credits
          </h1>
        </div>
        <button className="bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-[#2DD4BF]/70 transition-colors">
          Refill
        </button>
      </div>

      <div className={cn('rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 relative overflow-hidden')}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/10 blur-3xl -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative shrink-0">
            <CircularProgress pct={remainPct} color={accentColor} size={150} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-semibold tabular-nums text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                {remainPct}%
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-0.5 font-black">
                Capacity
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Badge
                className={cn(
                  'text-[10px] font-black uppercase tracking-widest rounded-full border',
                  isActive
                    ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20'
                    : 'bg-black/20 text-white/30 border-[#212129]',
                )}
              >
                {isActive ? 'System Active' : 'System Offline'}
              </Badge>
              {isLow && (
                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Low Bandwidth
                </Badge>
              )}
            </div>
            
            <div>
              <p className="text-2xl md:text-3xl font-semibold text-white tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                {balance.toLocaleString()}
                <span className="text-[10px] font-black text-white/20 ml-3 uppercase tracking-widest">Minutes Available</span>
              </p>
            </div>

            <div className="max-w-md">
              <div className="h-2 bg-black/40 border border-[#212129] rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    isLow
                      ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.45)]',
                  )}
                  style={{ width: `${remainPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                <span>{used.toLocaleString()} Used</span>
                <span>{total.toLocaleString()} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreditsLogsClient calls={calls} />

      <CreditsChartsClient calls={calls} />
    </div>
  )
}

