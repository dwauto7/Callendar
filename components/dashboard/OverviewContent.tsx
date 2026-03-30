'use client'

import { useOverviewData } from '@/lib/hooks/useOverviewData'
import { StatCard } from '@/components/dashboard/StatCard'
import { CreditsWidget } from '@/components/dashboard/CreditsWidget'
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable'
import { MonthSummary } from '@/components/dashboard/MonthSummary'
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react'
import { formatRM, formatMins } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OverviewContentProps {
  clinicName: string
  isActive: boolean
  clinicConfigId: string
  answeringMode: 'always_on' | 'after_hours' | 'disabled'
}

export function OverviewContent({
  clinicName,
  isActive,
  clinicConfigId,
  answeringMode,
}: OverviewContentProps) {
  const { credits, report, allCalls, appointments, isLoading, error } =
    useOverviewData(clinicConfigId)

  // Aggregations
  const totalCalls = allCalls.length
  const totalMinutesSaved = allCalls.reduce((sum, c) => sum + (Number(c.minutes_saved) || 0), 0)
  
  // Only count non-cancelled appointments for revenue
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (Number(a.projected_revenue) || 0), 0)
  
  const appointmentCount = appointments.filter((a) => a.status !== 'cancelled').length
  const recentCalls = allCalls.slice(0, 5)

  // Greeting
  const hour = new Date().toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',
    hour12: false,
  })
  const h = parseInt(hour)
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  // Mode config
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

  if (error) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          <p className="font-bold">Error loading overview data</p>
          <p className="text-sm text-red-400/70 mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

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
            Overview
          </p>
        </div>

        {/* ── Active / Inactive badge ── */}
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

      {/* ── Answering mode strip ── */}
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

      {/* ── Stat cards ── */}
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

      {/* ── Credits widget ── */}
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
        <MonthSummary report={report} liveRevenue={totalRevenue} />
      </div>

      {/* Optional: Real-time sync indicator */}
      {isLoading && (
        <div className="fixed bottom-6 right-6 text-xs text-white/40 font-mono">
          Syncing...
        </div>
      )}
    </div>
  )
}