import Link from 'next/link'
import { BarChart3, ArrowRight, TrendingUp, Phone, CalendarCheck, Clock } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface MonthlyReport {
  report_period: string
  total_calls: number
  total_bookings: number
  gross_revenue_generated: number
  total_monthly_investment: number
  total_minutes_used: number
}

interface MonthSummaryProps {
  report: MonthlyReport | null
  liveRevenue?: number
}

export function MonthSummary({ report, liveRevenue }: MonthSummaryProps) {
  const conversionRate =
    report && report.total_calls > 0
      ? Math.round((report.total_bookings / report.total_calls) * 100)
      : 0

  const rows = [
    {
      label: 'Voice Inquiries',
      value: report?.total_calls?.toLocaleString() ?? '—',
      icon: Phone,
      color: '#40E0FF',
    },
    {
      label: 'System Appointments',
      value: report?.total_bookings?.toLocaleString() ?? '—',
      icon: CalendarCheck,
      color: '#40E0FF',
    },
    {
      label: 'Gross Revenue Capture',
      value: formatRM(report?.gross_revenue_generated ?? liveRevenue ?? 0),
      icon: TrendingUp,
      color: '#40E0FF',
    },
    {
      label: 'Engine Minutes',
      value: formatMins(report?.total_minutes_used),
      icon: Clock,
      color: '#64748B',
    },
  ]

  return (
    <Card className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden glass-panel">
      <CardHeader className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#40E0FF]/10 flex items-center justify-center border border-[#40E0FF]/20">
            <BarChart3 className="size-4 text-[#40E0FF]" />
          </div>
          <div>
            <h2
              className="text-sm font-black text-white uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Performance Cycle
            </h2>
            {report?.report_period && (
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mt-0.5">
                {report.report_period}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/dashboard/reports"
          className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#40E0FF] transition-all"
        >
          View Intelligence
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {!report ? (
          <div className="px-6 py-12 text-center text-xs font-bold uppercase tracking-widest text-white/20">
            Syncing local data...
          </div>
        ) : (
          <>
            {/* Metric rows */}
            <div className="divide-y divide-white/5">
              {rows.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5"
                      style={{ background: `${color}10` }}
                    >
                      <Icon className="size-4" style={{ color }} />
                    </div>
                    <span className="text-sm font-bold text-white/50 tracking-tight">{label}</span>
                  </div>
                  <span
                    className="text-sm font-bold text-white tabular-nums tracking-tighter"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Conversion rate footer - Cyan styled */}
            <div className="px-6 py-5 bg-[#40E0FF]/5 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-[#40E0FF] uppercase tracking-widest">Efficiency Rating</span>
                <span className="text-sm font-black text-white tabular-nums">
                  {conversionRate}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-[#40E0FF] shadow-[0_0_10px_rgba(64,224,255,0.5)] transition-all duration-1000"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
