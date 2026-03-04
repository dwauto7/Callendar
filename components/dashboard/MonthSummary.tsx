import Link from 'next/link'
import { BarChart3, ArrowRight, TrendingUp, Phone, CalendarCheck, Clock } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'

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
}

export function MonthSummary({ report }: MonthSummaryProps) {
  const conversionRate =
    report && report.total_calls > 0
      ? Math.round((report.total_bookings / report.total_calls) * 100)
      : 0

  const rows = [
    {
      label: 'Total Calls',
      value: report?.total_calls?.toLocaleString() ?? '—',
      icon: Phone,
      color: '#3B82F6',
    },
    {
      label: 'Appointments Booked',
      value: report?.total_bookings?.toLocaleString() ?? '—',
      icon: CalendarCheck,
      color: '#10B981',
    },
    {
      label: 'Revenue Generated',
      value: formatRM(report?.gross_revenue_generated),
      icon: TrendingUp,
      color: '#10B981',
    },
    {
      label: 'Minutes Used',
      value: formatMins(report?.total_minutes_used),
      icon: Clock,
      color: '#64748B',
    },
  ]

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2128]">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-[#10B981]" />
          <div>
            <h2
              className="text-sm font-semibold text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              This Month
            </h2>
            {report?.report_period && (
              <p className="text-[10px] text-[#64748B] mt-0.5">
                {report.report_period}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/dashboard/reports"
          className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#10B981] transition-colors duration-200"
        >
          All reports
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {!report ? (
        <div className="px-5 py-10 text-center text-sm text-[#64748B]">
          No report data yet
        </div>
      ) : (
        <>
          {/* Metric rows */}
          <div className="divide-y divide-[#1E2128]">
            {rows.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[#161B22] transition-colors duration-200"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="size-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <Icon className="size-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm text-[#64748B]">{label}</span>
                </div>
                <span
                  className="text-sm font-semibold text-[#F1F5F9] tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Conversion rate footer */}
          <div className="px-5 py-3.5 bg-[#10B981]/5 border-t border-[#1E2128]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Booking conversion</span>
              <span className="text-xs font-bold text-[#10B981] tabular-nums">
                {conversionRate}%
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-[#1E2128] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
