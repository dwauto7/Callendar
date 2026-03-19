import { redirect } from 'next/navigation'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { CreditsChartsClient } from '@/components/dashboard/credits/CreditsChartsClient'
import { CreditsLogsClient } from '@/components/dashboard/credits/CreditsLogsClient'
import { cn } from '@/lib/utils'
import { timeAsync } from '@/lib/perf'

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

  const { data: clinicUser } = await timeAsync('credits:clinic_user', async () =>
    supabase.from('clinic_users').select('clinic_config_id').eq('user_id', user.id).single()
  )
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const id = clinicUser.clinic_config_id

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
  const accentColor = isLow ? '#F59E0B' : '#40E0FF'

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#40E0FF]/10 rounded-lg">
             <Zap className="size-5 text-[#40E0FF]" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            Credits
          </h1>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#40E0FF] transition-all">
            Refill
        </button>
      </div>

      <div className={cn('rounded-3xl border bg-[#0D0F12] p-8 border-white/5 relative overflow-hidden')}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#40E0FF]/5 blur-[100px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative shrink-0">
            <CircularProgress pct={remainPct} color={accentColor} size={150} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold tabular-nums text-white">{remainPct}%</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5 font-black">Capacity</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Badge className={cn("border-0 text-[10px] font-black uppercase tracking-tighter", isActive ? "bg-[#40E0FF]/10 text-[#40E0FF]" : "bg-white/5 text-white/30")}>
                {isActive ? 'System Active' : 'System Offline'}
              </Badge>
              {isLow && <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px] font-black uppercase">Low Bandwidth</Badge>}
            </div>
            
            <div>
              <p className="text-5xl font-bold text-white tabular-nums tracking-tighter">
                {balance.toLocaleString()}
                <span className="text-sm font-medium text-white/20 ml-3 uppercase tracking-widest">Minutes Available</span>
              </p>
            </div>

            <div className="max-w-md">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn('h-full', isLow ? 'bg-amber-500' : 'bg-[#40E0FF]')}
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
