'use client'

import { BarChart3, TrendingUp, Phone, CalendarCheck, Clock, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CallsTrendChart, BookingsRevenueChart } from '@/components/dashboard/reports/ReportCharts'
import { cn } from '@/lib/utils'
import { useReportsData } from '@/lib/hooks/useReportsData'

interface ReportsContentProps {
  clinicConfigId: string
  clinicName: string
}

export function ReportsContent({ clinicConfigId, clinicName }: ReportsContentProps) {
  const { allReports, liveRevenue, isLoading } = useReportsData(clinicConfigId)

  const currentReport  = allReports[0] ?? null
  const previousReport = allReports[1] ?? null

  function delta(current: number | null | undefined, previous: number | null | undefined) {
    if (current == null || previous == null || previous === 0) return null
    return Math.round(((current - previous) / previous) * 100)
  }

  const callsDelta    = delta(currentReport?.total_calls, previousReport?.total_calls)
  const bookingsDelta = delta(currentReport?.total_bookings, previousReport?.total_bookings)
  const revenueDelta  = delta(currentReport?.gross_revenue_generated, previousReport?.gross_revenue_generated)
  const minutesDelta  = delta(currentReport?.total_minutes_used, previousReport?.total_minutes_used)

  const totalCalls    = currentReport?.total_calls ?? 0
  const totalBookings = currentReport?.total_bookings ?? 0
  const conversionRate = totalCalls > 0 ? Math.round((totalBookings / totalCalls) * 100) : 0

  const chartData = [...allReports].reverse().map((r) => ({
    period:     r.report_period ?? '???',
    calls:      r.total_calls ?? 0,
    bookings:   r.total_bookings ?? 0,
    revenue:    r.gross_revenue_generated ?? 0,
    investment: r.total_monthly_investment ?? 0,
  }))

  const snapshotRows = [
    {
      label: 'Voice Inquiries',
      value: totalCalls > 0 ? totalCalls.toLocaleString() : '???',
      icon: Phone,
      delta: callsDelta,
    },
    {
      label: 'System Appointments',
      value: totalBookings > 0 ? totalBookings.toLocaleString() : '???',
      icon: CalendarCheck,
      delta: bookingsDelta,
    },
    {
      label: 'Gross Revenue Capture',
      value: formatRM(liveRevenue || currentReport?.gross_revenue_generated),
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

      {/* ?????? Page header ?????? */}
      <div className="mb-10 relative rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]">
            {clinicName}
          </p>
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-none"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Performance
        </h1>
        <p
          className="text-sm md:text-base uppercase tracking-tight text-white/30 mt-2"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {currentReport?.report_period ?? 'No data yet'} ?? Intelligence Cycle
        </p>
      </div>

      {/* ?????? 1. CURRENT MONTH SNAPSHOT ?????? */}
      <div className="mb-6">
        <SectionLabel>Current Cycle Snapshot</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {snapshotRows.map(({ label, value, icon: Icon, delta: d }) => (
            <Card
              key={label}
              className="rounded-2xl border border-[#212129] bg-[#121216] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2DD4BF]/40"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-9 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
                    <Icon className="size-4 text-[#2DD4BF]" />
                  </div>
                  <DeltaBadge delta={d} />
                </div>
                <p className="text-3xl font-semibold text-white tracking-tight tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
                  {value}
                </p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-4 rounded-2xl border border-[#212129] bg-[#121216]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest">
                Booking Efficiency Rating
              </span>
              <span className="text-sm font-semibold text-white tabular-nums">{conversionRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/40 overflow-hidden border border-[#212129]">
              <div
                className="h-full rounded-full bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.4)] transition-all duration-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <p className="text-[10px] text-white/20 font-mono mt-2">
              {totalBookings} bookings from {totalCalls} calls this cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ?????? 2. TREND CHARTS ?????? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-[#212129] bg-black/20">
            <ChartHeader icon={Phone} title="Calls & Bookings" subtitle="Trend over time" />
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length === 0 ? <EmptyChart /> : <CallsTrendChart data={chartData} />}
            <div className="flex items-center gap-4 mt-4">
              <LegendDot color="#2DD4BF" label="Total Calls" />
              <LegendDot color="rgba(255,255,255,0.4)" label="Bookings" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-[#212129] bg-black/20">
            <ChartHeader icon={TrendingUp} title="Revenue vs Investment" subtitle="ROI by cycle" />
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length === 0 ? <EmptyChart /> : <BookingsRevenueChart data={chartData} />}
            <div className="flex items-center gap-4 mt-4">
              <LegendDot color="#2DD4BF" label="Revenue" />
              <LegendDot color="rgba(255,255,255,0.15)" label="Investment" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ?????? 3. MONTH-ON-MONTH TABLE ?????? */}
      <div className="mb-6">
        <SectionLabel>Month-on-Month Comparison</SectionLabel>
        <Card className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
          {allReports.length === 0 ? (
            <CardContent className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest text-white/20">
              No historical data yet
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#212129] bg-black/20">
                    {['Period', 'Calls', 'Bookings', 'Efficiency', 'Revenue', 'Minutes'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#212129]">
                  {allReports.map((r, i) => {
                    const prev = allReports[i + 1]
                    const calls = r.total_calls ?? 0
                    const bookings = r.total_bookings ?? 0
                    const eff = calls > 0 ? Math.round((bookings / calls) * 100) : 0

                    return (
                      <tr key={r.id} className={cn('hover:bg-[#121216] transition-colors', i === 0 && 'bg-[#2DD4BF]/[0.04]')}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {i === 0 && (
                              <span className="text-[9px] font-black text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/10 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                            <span className="text-xs font-semibold text-white/60">{r.report_period}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta value={calls > 0 ? calls.toLocaleString() : '???'} delta={delta(r.total_calls, prev?.total_calls)} />
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta value={bookings > 0 ? bookings.toLocaleString() : '???'} delta={delta(r.total_bookings, prev?.total_bookings)} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-black/40 overflow-hidden border border-[#212129]">
                              <div className="h-full rounded-full bg-[#2DD4BF]" style={{ width: `${eff}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-white/50 tabular-nums">{eff}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CellWithDelta value={formatRM(r.gross_revenue_generated)} delta={delta(r.gross_revenue_generated, prev?.gross_revenue_generated)} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-white/50 tabular-nums">{formatMins(r.total_minutes_used)}</span>
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

// ?????? Sub-components ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">{children}</p>
}

function ChartHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/20">
        <Icon className="size-4 text-[#2DD4BF]" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white mt-1" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h2>
        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null
  if (delta === 0) return (
    <span className="flex items-center gap-0.5 text-[10px] font-black text-white/20">
      <Minus className="size-3" /> 0%
    </span>
  )
  const positive = delta > 0
  return (
    <span className={cn('flex items-center gap-0.5 text-[10px] font-black', positive ? 'text-[#2DD4BF]' : 'text-red-400')}>
      {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(delta)}%
    </span>
  )
}

function CellWithDelta({ value, delta }: { value: string; delta: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-white/70 tabular-nums">{value}</span>
      <DeltaBadge delta={delta} />
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[240px] flex items-center justify-center text-xs font-black text-white/20 uppercase tracking-widest">
      Awaiting Data
    </div>
  )
}

