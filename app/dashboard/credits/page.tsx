import { redirect } from 'next/navigation'
import { Zap, Wifi, WifiOff, Clock, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { DailyUsageChart, UsageCostChart } from '@/components/dashboard/credits/DailyUsageChart'
import { formatRM, formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Credits — Callendar' }

function CircularProgress({
  pct,
  color,
  size = 160,
}: {
  pct: number
  color: string
  size?: number
}) {
  const r = (size / 2) * 0.72
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const cx = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1E2128" strokeWidth={10} />
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

export default async function CreditsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users').select('clinic_config_id').eq('user_id', user.id).single()
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const id = clinicUser.clinic_config_id

  const [creditsRes, callsRes] = await Promise.all([
    supabase.from('credits').select('*').eq('clinic_config_id', id).single(),
    supabase
      .from('call_logs')
      .select('id, client_name, duration_min, aya_usage_cost_rm, created_at')
      .eq('clinic_config_id', id)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  const credits = creditsRes.data
  const calls = callsRes.data ?? []

  const balance = credits?.balance ?? 0
  const used = credits?.minutes_used ?? 0
  const total = credits?.total_credits_mins ?? 0
  const usedPct = total > 0 ? Math.round((used / total) * 100) : 0
  const remainPct = 100 - usedPct
  const isLow = remainPct < 20
  const isActive = credits?.status?.toLowerCase() === 'active' && credits?.system_enabled

  const accentColor = isLow ? '#F59E0B' : '#10B981'

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="size-5 text-[#10B981]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
          Credits
        </h1>
      </div>

      {/* Balance card */}
      <div
        className={cn(
          'rounded-xl border bg-[#111318] p-6',
          isLow ? 'border-[#F59E0B]/40' : 'border-[#1E2128]',
        )}
        style={{
          background: `linear-gradient(135deg, #111318 50%, ${accentColor}07 100%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular progress */}
          <div className="relative shrink-0">
            <CircularProgress pct={usedPct} color={accentColor} size={140} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ fontFamily: 'var(--font-syne)', color: accentColor }}
              >
                {remainPct}%
              </span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-widest mt-0.5">left</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <Badge
                className={cn(
                  'border-0 text-[11px] font-bold uppercase tracking-wider',
                  isActive ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#64748B]/15 text-[#64748B]',
                )}
              >
                {isActive ? <Wifi className="size-3 mr-1" /> : <WifiOff className="size-3 mr-1" />}
                {credits?.status ?? 'Unknown'}
              </Badge>
              {isLow && (
                <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border-0 text-[11px] font-bold uppercase">
                  Low balance
                </Badge>
              )}
            </div>

            <p className="text-4xl font-bold text-[#F1F5F9] tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
              {balance.toLocaleString()}
              <span className="text-lg font-medium text-[#64748B] ml-2">min remaining</span>
            </p>

            <div className="mt-4 space-y-2 max-w-sm mx-auto sm:mx-0">
              <Progress
                value={usedPct}
                className="h-2 bg-[#1E2128]"
                indicatorClassName={isLow ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}
              />
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>{used.toLocaleString()} min used</span>
                <span>{total.toLocaleString()} min total</span>
              </div>
            </div>

            {credits?.agent_id && (
              <p className="mt-3 text-[11px] text-[#64748B] font-mono">
                Agent: {credits.agent_id}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-4 text-[#10B981]" />
            <p className="text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
              Daily Usage (minutes)
            </p>
          </div>
          <DailyUsageChart calls={calls} />
        </div>

        <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="size-4 text-[#F59E0B]" />
            <p className="text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
              Daily Cost (RM)
            </p>
          </div>
          <UsageCostChart calls={calls} />
        </div>
      </div>

      {/* Usage history table */}
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E2128]">
          <p className="text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
            Usage History
          </p>
        </div>

        {calls.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748B]">No usage history</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-[#1E2128] text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-3 py-3">Client</th>
                  <th className="text-right px-3 py-3">Duration</th>
                  <th className="text-right px-5 py-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2128]">
                {calls.map((c) => (
                  <tr key={c.id} className="hover:bg-[#161B22] transition-colors">
                    <td className="px-5 py-3 text-xs text-[#64748B] whitespace-nowrap">
                      {formatDateTime(c.created_at)}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#F1F5F9] truncate max-w-[160px]">
                      {c.client_name || 'Unknown'}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-[#F1F5F9] tabular-nums">
                      {Number(c.duration_min || 0).toFixed(1)} min
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-semibold text-[#F59E0B] tabular-nums">
                      {formatRM(c.aya_usage_cost_rm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
