import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { CreditsWidget } from '@/components/dashboard/CreditsWidget'
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable'
import { MonthSummary } from '@/components/dashboard/MonthSummary'
import { formatRM, formatMins } from '@/lib/utils'

export const metadata = {
  title: 'Intelligence Overview — AI Blizzard',
}

export default async function OverviewPage() {
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

  // @ts-expect-error - handling nested supabase join
  const clinicName = clinicUser.clinic_configs?.clinic_name ?? 'Partner'
  const id = clinicUser.clinic_config_id

  // Parallel fetch hitting Supabase concurrently
  const [statsRes, creditsRes, reportsRes, callsRes, settingsRes] = await Promise.all([
    supabase.from('global_stats').select('*').eq('clinic_config_id', id).single(),
    supabase.from('credits').select('*').eq('clinic_config_id', id).single(),
    supabase.from('monthly_reports').select('*').eq('clinic_config_id', id).order('report_month', { ascending: false }).limit(1).single(),
    supabase.from('call_logs').select('id, client_name, patient_phone, duration_min, created_at, is_after_hours, appointment_id').eq('clinic_config_id', id).order('created_at', { ascending: false }).limit(5),
    supabase.from('clinic_settings').select('*').eq('clinic_config_id', id).single(),
  ])

  const stats = statsRes.data
  const credits = creditsRes.data
  const report = reportsRes.data ?? null
  const calls = callsRes.data ?? []
  const settings = settingsRes.data

  // Greeting based on KL time
  const hour = new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',
    hour12: false,
  })
  const h = parseInt(hour)
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto relative">
      {/* Page header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-[#40E0FF] animate-pulse" />
            <p className="text-[10px] text-[#40E0FF] font-black uppercase tracking-[0.2em]">
              {greeting}, {clinicName}
            </p>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white tracking-tighter"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Intelligence <span className="text-white/20">Overview</span>
          </h1>
        </div>

        <div className="hidden md:block text-right">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
            System Status
          </p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <div
              className={`size-2 rounded-full animate-pulse ${
                settings?.answering_mode === 'always_on'
                  ? 'bg-emerald-500'
                  : settings?.answering_mode === 'after_hours'
                  ? 'bg-amber-400'
                  : 'bg-red-500'
              }`}
            />
            <p className="text-sm text-white/60 font-medium">
              {settings?.answering_mode === 'always_on'
                ? 'Full Autonomy Active'
                : settings?.answering_mode === 'after_hours'
                ? 'Standing by for After-Hours'
                : 'System Paused'}
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards — 2 col mobile / 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Voice Transactions"
          value={stats?.total_calls?.toLocaleString() ?? '—'}
          description="Total calls processed"
          iconName="phone"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Autonomous Bookings"
          value={stats?.total_appointments?.toLocaleString() ?? '—'}
          description="Confirmed by AI Blizzard"
          iconName="calendar"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Human Capital Saved"
          value={stats?.total_minutes_saved != null ? formatMins(stats.total_minutes_saved) : '—'}
          description="Staff labor reclaimed"
          iconName="clock"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Captured Revenue"
          value={stats?.total_revenue != null ? formatRM(stats.total_revenue) : '—'}
          description="Projected value"
          iconName="trending"
          accentColor="#40E0FF"
        />
      </div>

      {/* Engine Status / Credits widget */}
      {credits && (
        <div className="mb-6">
          <CreditsWidget
            balance={credits.balance ?? 0}
            minutesUsed={credits.minutes_used ?? 0}
            totalCredits={credits.total_credits_mins ?? 0}
            status={credits.status ?? 'Unknown'}
            // Fix: Pass the new answeringMode prop to the widget
            answeringMode={settings?.answering_mode ?? 'disabled'}
            agentId={credits.agent_id}
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCallsTable calls={calls} />
        <MonthSummary report={report} />
      </div>
    </div>
  )
}
