import { redirect } from 'next/navigation'
import { BarChart3, TrendingUp, CalendarCheck, Clock, DollarSign, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CallsTrendChart, BookingsRevenueChart } from '@/components/dashboard/reports/ReportCharts'
import { formatRM, formatMins } from '@/lib/utils'

export const metadata = { title: 'Intelligence — AI Blizzard' }

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
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-8 fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#40E0FF]/10 rounded-lg cyan-glow">
          <BarChart3 className="size-5 text-[#40E0FF]" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          Intelligence <span className="text-[#40E0FF]">Hub</span>
        </h1>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Gross Revenue', value: formatRM(totalRevenue), color: '#40E0FF' },
          { icon: CalendarCheck, label: 'Total Bookings', value: totalBookings.toLocaleString(), color: '#10B981' },
          { icon: Clock, label: 'Compute Time', value: formatMins(totalMins), color: '#8B5CF6' },
          { icon: DollarSign, label: 'Total Volume', value: totalCalls.toLocaleString(), color: '#F59E0B' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-[#40E0FF]/30 transition-all"
            style={{ background: `linear-gradient(135deg, #0D0F12 60%, ${color}05 100%)` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl p-2 bg-white/5 group-hover:scale-110 transition-transform">
                <Icon className="size-4" style={{ color }} />
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</p>
            </div>
            <p className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#0D0F12]">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8 text-center">Conversion Velocity</h3>
          <CallsTrendChart data={chartData} />
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#0D0F12]">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8 text-center">Economics (RM)</h3>
          <BookingsRevenueChart data={chartData} />
        </div>
      </div>

      {/* Monthly Cards */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 px-2">Lifecycle Archives</h3>
        {allReports.length === 0 ? (
          <div className="glass-panel py-20 text-center rounded-3xl border border-dashed border-white/10">
            <p className="text-sm text-white/20 font-mono tracking-widest uppercase">No archive data found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...allReports].reverse().map((report) => {
              const roi = report.total_monthly_investment && report.total_monthly_investment > 0
                ? (((report.gross_revenue_generated ?? 0) / report.total_monthly_investment) * 100).toFixed(0)
                : null
              return (
                <div key={report.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-lg font-bold text-white group-hover:text-[#40E0FF] transition-colors">{report.report_period}</p>
                    {roi && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                        {roi}% ROI <ArrowUpRight className="size-3" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Volume', value: report.total_calls, color: 'white' },
                      { label: 'Conversion', value: report.total_bookings, color: '#10B981' },
                      { label: 'Revenue', value: formatRM(report.gross_revenue_generated), color: '#40E0FF' },
                      { label: 'Compute', value: formatRM(report.total_monthly_investment), color: '#F59E0B' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{label}</span>
                        <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
