import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BarChart3, TrendingUp, Phone, CalendarCheck, Clock, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CallsTrendChart, BookingsRevenueChart } from '@/components/dashboard/reports/ReportCharts'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Performance & ROI — Callendar',
}

export default async function ReportsPage() { 
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select(`
      clinic_config_id,
      clinic_configs (
        clinic_name
      )
    `)
    .eq('user_id', user.id)
    .single()

  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  // @ts-expect-error - nested supabase join
  const clinicName = clinicUser.clinic_configs?.clinic_name ?? 'Partner'
  const id = clinicUser.clinic_config_id

  // Fetch last 6 months of reports
  const [reportsRes, appointmentsRes] = await Promise.all([
  supabase
    .from('monthly_reports')
    .select('*')
    .eq('clinic_config_id', id)
    .order('report_month', { ascending: false })
    .limit(6),
  supabase
    .from('appointments')
    .select('projected_revenue, created_at, status')
    .eq('clinic_id', id)
    .eq('status', 'Booked')
    .not('projected_revenue', 'is', null),
  ])

  const allReports = reportsRes.data ?? []
  const currentReport = allReports[0] ?? null
  const previousReport = allReports[1] ?? null

  const liveRevenue = (appointmentsRes.data ?? []).reduce(
  (sum, a) => sum + (Number(a.projected_revenue) || 0), 0
  )

  // ── Month-on-month delta helpers ─────────────────────────────
  function delta(current: number | null, previous: number | null) {
    if (!current || !previous || previous === 0) return null
    return Math.round(((current - previous) / previous) * 100)
  }

  const callsDelta    = delta(currentReport?.total_calls, previousReport?.total_calls)
  const bookingsDelta = delta(currentReport?.total_bookings, previousReport?.total_bookings)
  const revenueDelta  = delta(currentReport?.gross_revenue_generated, previousReport?.gross_revenue_generated)
  const minutesDelta  = delta(currentReport?.total_minutes_used, previousReport?.total_minutes_used)

  const conversionRate =
    currentReport && currentReport.total_calls > 0
      ? Math.round((currentReport.total_bookings / currentReport.total_calls) * 100)
      : 0

  // ── Chart data (oldest → newest for left-to-right trend) ─────
  const chartData = [...allReports].reverse().map((r) => ({
    period: r.report_period ?? '—',
    calls: r.total_calls ?? 0,
    bookings: r.total_bookings ?? 0,
    revenue: r.gross_revenue_generated ?? 0,
    investment: r.total_monthly_investment ?? 0,
  }))

  // ── Snapshot metric rows ──────────────────────────────────────
  const snapshotRows = [
    {
      label: 'Voice Inquiries',
      value: currentReport?.total_calls?.toLocaleString() ?? '—',
      icon: Phone,
      delta: callsDelta,
    },
    {
      label: 'System Appointments',
      value: currentReport?.total_bookings?.toLocaleString() ?? '—',
      icon: CalendarCheck,
      delta: bookingsDelta,
    },
    {
      label: 'Gross Revenue Capture',
      value: formatRM(currentReport?.gross_revenue_generated ?? liveRevenue),
      icon: TrendingUp,
      delta: revenueDelta,
    },
    {
      label: 'Engine Minutes Used',
      value: formatMins(currentReport?.total_minutes_used),
      icon: Clock,
      delta: minutesDelta,
    },
  ]

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">

      {/* ── Page header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-2 rounded-full bg-[#40E0FF] animate-pulse" />
          <p className="text-[10px] text-[#40E0FF] font-black uppercase tracking-[0.2em]">
            {clinicName}
          </p>
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Performance <span className="text-white/20">&amp; ROI</span>
        </h1>
        <p
          className="text-base md:text-lg font-semibold text-white/20 tracking-tight mt-1"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {currentReport?.report_period ?? 'No data yet'} · Intelligence Cycle
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────
          1. CURRENT MONTH SNAPSHOT
      ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionLabel>Current Cycle Snapshot</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {snapshotRows.map(({ label, value, icon: Icon, delta: d }) => (
            <Card
              key={label}
              className="rounded-2xl border border-white/5 bg-white/[0.02] glass-panel"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-9 rounded-xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 flex items-center justify-center">
                    <Icon className="size-4 text-[#40E0FF]" />
                  </div>
                  <DeltaBadge delta={d} />
                </div>
                <p
                  className="text-2xl font-bold text-white tracking-tighter tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {value}
                </p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Efficiency rating bar */}
        <Card className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] glass-panel">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-[#40E0FF] uppercase tracking-widest">
                Booking Efficiency Rating
              </span>
              <span className="text-sm font-black text-white tabular-nums">
                {conversionRate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-[#40E0FF] shadow-[0_0_10px_rgba(64,224,255,0.5)] transition-all duration-1000"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <p className="text-[10px] text-white/20 font-mono mt-2">
              {currentReport?.total_bookings ?? 0} bookings from {currentReport?.total_calls ?? 0} calls this cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────
          2. MULTI-MONTH TREND CHARTS
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-2xl border border-white/5 bg-white/[0.02] glass-panel">
          <CardHeader className="px-6 py-5 border-b border-white/5 bg-white/[0.01]">
            <ChartHeader icon={Phone} title="Calls & Bookings" subtitle="Trend over time" />
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <CallsTrendChart data={chartData} />
            )}
            <div className="flex items-center gap-4 mt-4">
              <LegendDot color="#40E0FF" label="Total Calls" />
              <LegendDot color="#10B981" label="Bookings" />
            </div>
          </CardContent>
        </Card>

        {/* ─────────────────────────────────────────────────────
            3. COST VS REVENUE ROI
        ───────────────────────────────────────────────────── */}
        <Card className="rounded-2xl border border-white/5 bg-white/[0.02] glass-panel">
          <CardHeader className="px-6 py-5 border-b border-white/5 bg-white/[0.01]">
            <ChartHeader icon={TrendingUp} title="Revenue vs Investment" subtitle="ROI by cycle" />
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <BookingsRevenueChart data={chartData} />
            )}
            <div className="flex items-center gap-4 mt-4">
              <LegendDot color="#40E0FF" label="Revenue" />
              <LegendDot color="rgba(255,255,255,0.15)" label="Investment" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────
          4. MONTH-ON-MONTH COMPARISON TABLE
      ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionLabel>Month-on-Month Comparison</SectionLabel>
        <Card className="rounded-2xl border border-white/5 bg-white/[0.02] glass-panel overflow-hidden">
          {allReports.length === 0 ? (
            <CardContent className="px-6 py-12 text-center text-xs font-bold uppercase tracking-widest text-white/20">
              No historical data yet
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {['Period', 'Calls', 'Bookings', 'Efficiency', 'Revenue', 'Minutes'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-black text-white/30 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allReports.map((r, i) => {
                    const prev = allReports[i + 1]
                    const eff =
                      r.total_calls > 0
                        ? Math.round((r.total_bookings / r.total_calls) * 100)
                        : 0
                    return (
                      <tr
                        key={r.id}
                        className={cn(
                          'hover:bg-white/[0.02] transition-colors',
                          i === 0 && 'bg-[#40E0FF]/[0.02]',
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {i === 0 && (
                              <span className="text-[9px] font-black text-[#40E0FF] uppercase tracking-widest bg-[#40E0FF]/10 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                            <span className="text-xs font-bold text-white/60">
                              {r.report_period}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta
                            value={r.total_calls?.toLocaleString() ?? '—'}
                            delta={delta(r.total_calls, prev?.total_calls)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta
                            value={r.total_bookings?.toLocaleString() ?? '—'}
                            delta={delta(r.total_bookings, prev?.total_bookings)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-black/40 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#40E0FF]"
                                style={{ width: `${eff}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-white/50 tabular-nums">
                              {eff}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta
                            value={formatRM(r.gross_revenue_generated)}
                            delta={delta(r.gross_revenue_generated, prev?.gross_revenue_generated)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-white/50 tabular-nums">
                            {formatMins(r.total_minutes_used)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
      {children}
    </p>
  )
}

function ChartHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-lg bg-[#40E0FF]/10 flex items-center justify-center border border-[#40E0FF]/20">
        <Icon className="size-4 text-[#40E0FF]" />
      </div>
      <div>
        <h2
          className="text-sm font-black text-white uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {title}
        </h2>
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null
  if (delta === 0)
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-black text-white/20">
        <Minus className="size-3" /> 0%
      </span>
    )
  const positive = delta > 0
  return (
    <span
      className={cn(
        'flex items-center gap-0.5 text-[10px] font-black',
        positive ? 'text-emerald-400' : 'text-red-400',
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {Math.abs(delta)}%
    </span>
  )
}

function CellWithDelta({ value, delta }: { value: string; delta: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-white/70 tabular-nums">{value}</span>
      <DeltaBadge delta={delta} />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[240px] flex items-center justify-center text-xs font-mono text-white/20 uppercase tracking-widest">
      Awaiting Data
    </div>
  )
}
