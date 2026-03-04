import { redirect } from 'next/navigation'
import { Phone, CalendarCheck, Clock, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { CreditsWidget } from '@/components/dashboard/CreditsWidget'
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable'
import { MonthSummary } from '@/components/dashboard/MonthSummary'
import { formatRM, formatMins } from '@/lib/utils'

export const metadata = {
  title: 'Overview — Callendar',
}

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()

  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const id = clinicUser.clinic_config_id

  // Parallel fetch — all reads hit Supabase concurrently
  const [statsRes, creditsRes, reportsRes, callsRes] = await Promise.all([
    supabase
      .from('global_stats')
      .select('*')
      .eq('clinic_config_id', id)
      .single(),
    supabase
      .from('credits')
      .select('*')
      .eq('clinic_config_id', id)
      .single(),
    supabase
      .from('monthly_reports')
      .select('*')
      .eq('clinic_config_id', id)
      .order('report_month', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('call_logs')
      .select('id, client_name, patient_phone, duration_min, created_at, is_after_hours, appointment_id')
      .eq('clinic_config_id', id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = statsRes.data
  const credits = creditsRes.data
  const report = reportsRes.data ?? null
  const calls = callsRes.data ?? []

  // Greeting based on KL time
  const hour = new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',
    hour12: false,
  })
  const h = parseInt(hour)
  const greeting =
    h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm text-[#64748B] font-medium">{greeting}</p>
        <h1
          className="text-2xl font-bold text-[#F1F5F9] mt-0.5"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Overview
        </h1>
      </div>

      {/* Stat cards — 2 col mobile / 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Total Calls"
          value={stats?.total_calls?.toLocaleString() ?? '—'}
          description="all time"
          icon={Phone}
          accentColor="#3B82F6"
          accentBg="rgba(59,130,246,0.10)"
        />
        <StatCard
          title="Appointments"
          value={stats?.total_appointments?.toLocaleString() ?? '—'}
          description="booked by Aya"
          icon={CalendarCheck}
          accentColor="#10B981"
          accentBg="rgba(16,185,129,0.10)"
        />
        <StatCard
          title="Minutes Saved"
          value={
            stats?.total_minutes_saved != null
              ? formatMins(stats.total_minutes_saved)
              : '—'
          }
          description="staff time returned"
          icon={Clock}
          accentColor="#8B5CF6"
          accentBg="rgba(139,92,246,0.10)"
        />
        <StatCard
          title="Revenue"
          value={
            stats?.total_revenue != null ? formatRM(stats.total_revenue) : '—'
          }
          description="projected from calls"
          icon={TrendingUp}
          accentColor="#10B981"
          accentBg="rgba(16,185,129,0.10)"
        />
      </div>

      {/* Credits widget — full width */}
      {credits && (
        <div className="mb-4">
          <CreditsWidget
            balance={credits.balance ?? 0}
            minutesUsed={credits.minutes_used ?? 0}
            totalCredits={credits.total_credits_mins ?? 0}
            status={credits.status ?? 'Unknown'}
            systemEnabled={credits.system_enabled ?? false}
            agentId={credits.agent_id}
          />
        </div>
      )}

      {/* Two-column: recent calls + month summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentCallsTable calls={calls} />
        <MonthSummary report={report} />
      </div>
    </div>
  )
}
