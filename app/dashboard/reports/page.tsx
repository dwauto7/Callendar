import { redirect } from 'next/navigation'
import { BarChart3, TrendingUp, CalendarCheck, Clock, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CallsTrendChart, BookingsRevenueChart } from '@/components/dashboard/reports/ReportCharts'
import { formatRM, formatMins } from '@/lib/utils'

export const metadata = { title: 'Reports — Callendar' }

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users').select('clinic_config_id').eq('user_id', user.id).single()
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const { data: reports } = await supabase
    .from('monthly_reports')
    .select('*')
    .eq('clinic_config_id', clinicUser.clinic_config_id)
    .order('report_month', { ascending: true })

  const allReports = reports ?? []

  const chartData = allReports.map((r) => ({
    period: r.report_period ?? r.report_month?.slice(0, 7) ?? '—',
    calls: r.total_calls ?? 0,
    bookings: r.total_bookings ?? 0,
    revenue: r.gross_revenue_generated ?? 0,
    investment: r.total_monthly_investment ?? 0,
  }))

  const totalRevenue = allReports.reduce((s, r) => s + (r.gross_revenue_generated ?? 0), 0)
  const totalCalls = allReports.reduce((s, r) => s + (r.total_calls ?? 0), 0)
  const totalBookings = allReports.reduce((s, r) => s + (r.total_bookings ?? 0), 0)
  const totalMins = allReports.reduce((s, r) => s + (r.total_minutes_used ?? 0), 0)

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-5 text-[#10B981]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
          Reports
        </h1>
      </div>

      {/* All-time summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Total Revenue', value: formatRM(totalRevenue), color: '#10B981' },
          { icon: CalendarCheck, label: 'Total Bookings', value: totalBookings.toLocaleString(), color: '#3B82F6' },
          { icon: Clock, label: 'Minutes Used', value: formatMins(totalMins), color: '#8B5CF6' },
          { icon: DollarSign, label: 'Total Calls', value: totalCalls.toLocaleString(), color: '#F59E0B' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[#1E2128] bg-[#111318] px-4 py-4"
            style={{ background: `linear-gradient(135deg, #111318 60%, ${color}07 100%)` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg p-1.5" style={{ background: `${color}18` }}>
                <Icon className="size-3.5" style={{ color }} />
              </div>
              <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-2xl font-bold text-[#F1F5F9] tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5">
          <p className="text-sm font-semibold text-[#F1F5F9] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            Calls & Bookings Trend
          </p>
          <CallsTrendChart data={chartData} />
          <div className="flex items-center gap-4 mt-3 justify-end">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#10B981] inline-block" />
              <span className="text-[10px] text-[#64748B]">Calls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#3B82F6] inline-block" />
              <span className="text-[10px] text-[#64748B]">Bookings</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5">
          <p className="text-sm font-semibold text-[#F1F5F9] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            Revenue vs Investment
          </p>
          <BookingsRevenueChart data={chartData} />
        </div>
      </div>

      {/* Monthly report cards */}
      {allReports.length === 0 ? (
        <div className="rounded-xl border border-[#1E2128] bg-[#111318] py-16 text-center text-sm text-[#64748B]">
          No monthly reports yet
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
            Monthly Breakdown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...allReports].reverse().map((report) => {
              const roi = report.total_monthly_investment && report.total_monthly_investment > 0
                ? (((report.gross_revenue_generated ?? 0) / report.total_monthly_investment) * 100).toFixed(0)
                : null
              return (
                <div
                  key={report.id}
                  className="rounded-xl border border-[#1E2128] bg-[#111318] p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-base font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
                      {report.report_period}
                    </p>
                    {roi && (
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                        {roi}% ROI
                      </span>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Calls', value: (report.total_calls ?? 0).toLocaleString(), color: '#64748B' },
                      { label: 'Bookings', value: (report.total_bookings ?? 0).toLocaleString(), color: '#3B82F6' },
                      { label: 'Revenue', value: formatRM(report.gross_revenue_generated), color: '#10B981' },
                      { label: 'Investment', value: formatRM(report.total_monthly_investment), color: '#F59E0B' },
                      { label: 'Mins Used', value: formatMins(report.total_minutes_used), color: '#8B5CF6' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-xs text-[#64748B]">{label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
