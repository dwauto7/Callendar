import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { CreditsWidget } from '@/components/dashboard/CreditsWidget'
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable'
import { MonthSummary } from '@/components/dashboard/MonthSummary'
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'
import { timeAsync } from '@/lib/perf'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Intelligence Overview — Callendar',
}

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await timeAsync('overview:get_user', async () => supabase.auth.getUser())
  if (!user) redirect('/')

  const { data: clinicUser } = await timeAsync('overview:clinic_user', async () =>
    supabase
      .from('clinic_users')
      .select(`
        clinic_config_id,
        clinic_configs (
          clinic_name,
          is_active
        )
      `)
      .eq('user_id', user.id)
      .single()
  )

  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  // @ts-expect-error - nested supabase join
  const clinicName = clinicUser.clinic_configs?.clinic_name ?? 'Partner'
  // @ts-expect-error - nested supabase join
  const isActive: boolean = clinicUser.clinic_configs?.is_active ?? false
  const id = clinicUser.clinic_config_id

  const [creditsRes, reportsRes, callsRes, appointmentsRes, settingsRes] =
    await Promise.all([
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

      // Fetch all call_logs for aggregation + last 5 for the table
      supabase
        .from('call_logs')
        .select('id, client_name, patient_phone, duration_min, minutes_saved, is_after_hours, appointment_id, created_at, clinic_config_id, summary, recording_url')
        .eq('clinic_config_id', id)
        .order('created_at', { ascending: false }),

      supabase
        .from('appointments')
        .select('id, projected_revenue')
        .eq('clinic_id', id),

      supabase
        .from('clinic_settings')
        .select('answering_mode')
        .eq('clinic_config_id', id)
        .single(),
    ])

  const credits      = creditsRes?.data
  const report       = reportsRes?.data ?? null
  const allCalls     = callsRes?.data ?? []
  const appointments = appointmentsRes?.data ?? []

  // ── Live aggregations (no global_stats dependency) ──────────
  const totalCalls         = allCalls.length
  const totalMinutesSaved  = allCalls.reduce((sum, c) => sum + (Number(c.minutes_saved) || 0), 0)
  const totalRevenue       = appointments.reduce((sum, a) => sum + (Number(a.projected_revenue) || 0), 0)
  const appointmentCount   = appointments.length

  // Only last 5 for the table
  const recentCalls = allCalls.slice(0, 5)

  // ── Answering mode ───────────────────────────────────────────
  const rawMode = settingsRes?.data?.answering_mode ?? 'disabled'
  const answeringMode: 'always_on' | 'after_hours' | 'disabled' =
    rawMode === 'always_on' || rawMode === 'after_hours' ? rawMode : 'disabled'

  // ── Greeting (KL time) ───────────────────────────────────────
  const hour = new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',
    hour12: false,
  })
  const h = parseInt(hour)
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  // ── System status strip config ───────────────────────────────
  const modeConfig = {
    always_on: {
      label: '24/7 - Availability',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    },
    after_hours: {
      label: 'After - Working - Hours',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    },
    disabled: {
      label: 'Offline',
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      dot: 'bg-red-500',
      glow: '',
    },
  }
  const mode = modeConfig[answeringMode]
  const ModeIcon = mode.icon

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto relative">

      {/* ── Page header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-2 rounded-full bg-[#40E0FF] animate-pulse" />
            <p className="text-[10px] text-[#40E0FF] font-black uppercase tracking-[0.2em]">
              {greeting}
            </p>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {clinicName}
          </h1>
          <p
            className="text-base md:text-lg font-semibold text-white/20 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Intelligence Overview
          </p>
        </div>

        {/* ── Active / Inactive badge — top right of header ── */}
        <div className="md:mt-1 shrink-0">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all duration-300',
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-red-500/10 border-red-500/20 text-red-400',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full shrink-0',
                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500',
              )}
            />
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* ── Answering mode strip — above stat cards ── */}
      <div
        className={cn(
          'w-full mb-4 px-5 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-300',
          mode.bg,
          mode.border,
          mode.glow,
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full shrink-0',
            mode.dot,
            answeringMode !== 'disabled' && 'animate-pulse',
          )}
        />
        <ModeIcon className={cn('size-4 shrink-0', mode.color)} />
        <span className={cn('text-[11px] font-black uppercase tracking-widest', mode.color)}>
          {mode.label}
        </span>
        <span className="ml-auto text-[10px] font-mono text-white/20 uppercase tracking-widest">
          Answering Mode
        </span>
      </div>

      {/* ── Stat cards — 2 col mobile / 4 col desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Voice Transactions"
          value={totalCalls > 0 ? totalCalls.toLocaleString() : '—'}
          description="Total calls processed"
          iconName="phone"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Autonomous Bookings"
          value={appointmentCount > 0 ? appointmentCount.toLocaleString() : '—'}
          description="Appointments booked"
          iconName="calendar"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Human Capital Saved"
          value={totalMinutesSaved > 0 ? formatMins(totalMinutesSaved) : '—'}
          description="Staff labor reclaimed"
          iconName="clock"
          accentColor="#40E0FF"
        />
        <StatCard
          title="Captured Revenue"
          value={totalRevenue > 0 ? formatRM(totalRevenue) : '—'}
          description="Projected value"
          iconName="trending"
          accentColor="#40E0FF"
        />
      </div>

      {/* ── Engine Status / Credits widget ── */}
      {credits && (
        <div className="mb-6">
          <CreditsWidget
            balance={credits.balance ?? 0}
            minutesUsed={credits.minutes_used ?? 0}
            totalCredits={credits.total_credits_mins ?? 0}
            status={credits.status ?? 'Unknown'}
            answeringMode={answeringMode}
            agentId={credits.agent_id}
          />
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCallsTable calls={recentCalls} />
        <MonthSummary report={report} />
      </div>
    </div>
  )
}
