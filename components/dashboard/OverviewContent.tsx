'use client'

import Link from 'next/link'
import { useOverviewData } from '@/lib/hooks/useOverviewData'
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import { formatRM, formatMins, formatDateTime, cn } from '@/lib/utils'

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
      label: '24/7 Availability',
      icon: ShieldCheck,
      color: 'text-[#2DD4BF]',
      bg: 'bg-[#2DD4BF]/10',
      border: 'border-[#2DD4BF]/25',
      dot: 'bg-[#2DD4BF]',
      glow: 'shadow-[0_0_14px_rgba(45,212,191,0.25)]',
    },
    after_hours: {
      label: 'After Hours',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
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
        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-6 text-red-400">
          <p className="font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
            Error loading overview data
          </p>
          <p className="text-sm text-red-400/70 mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  const totalCredits = credits?.total_credits_mins ?? 0
  const minutesUsed = credits?.minutes_used ?? 0
  const usedPct = totalCredits > 0 ? Math.round((minutesUsed / totalCredits) * 100) : 0
  const remainingPct = Math.max(0, 100 - usedPct)
  const isLowCredits = totalCredits > 0 && remainingPct < 20

  const statCards = [
    {
      label: 'Total Calls',
      value: totalCalls > 0 ? totalCalls.toLocaleString() : '--',
      helper: 'All-time inbound volume',
      icon: PhoneCall,
    },
    {
      label: 'Appointments Booked',
      value: appointmentCount > 0 ? appointmentCount.toLocaleString() : '--',
      helper: 'Confirmed patient bookings',
      icon: CalendarCheck,
    },
    {
      label: 'Minutes Saved',
      value: totalMinutesSaved > 0 ? formatMins(totalMinutesSaved) : '--',
      helper: 'Staff effort reclaimed',
      icon: Activity,
    },
    {
      label: 'Projected Revenue',
      value: totalRevenue > 0 ? formatRM(totalRevenue) : '--',
      helper: 'RM captured from bookings',
      icon: TrendingUp,
    },
  ]

  const conversionRate =
    report && report.total_calls > 0
      ? Math.round((report.total_bookings / report.total_calls) * 100)
      : 0

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto relative text-white">
      {/* Page header */}
      <div className="relative mb-8 rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-24 -right-10 h-48 w-48 rounded-full bg-[#2DD4BF]/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-[#2DD4BF] animate-pulse" />
              <p className="text-[10px] text-[#2DD4BF] font-black uppercase tracking-[0.2em]">
                {greeting}
              </p>
            </div>
            <h1
              className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {clinicName}
            </h1>
            <p
              className="text-sm md:text-base text-white/30 tracking-tight mt-2 uppercase"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Overview Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 md:mt-1 shrink-0">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all duration-300',
                isActive
                  ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/25 text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                  : 'bg-red-500/10 border-red-500/20 text-red-400',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full shrink-0',
                  isActive ? 'bg-[#2DD4BF] animate-pulse' : 'bg-red-500',
                )}
              />
              {isActive ? 'Active' : 'Inactive'}
            </div>

            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all duration-300',
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
              <span className={cn('text-[10px] uppercase tracking-widest', mode.color)}>
                {mode.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, helper, icon: Icon }) => (
          <div
            key={label}
            className="relative rounded-2xl border border-[#212129] bg-[#121216] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2DD4BF]/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  {label}
                </p>
                <p
                  className="mt-4 text-3xl font-semibold tracking-tight text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {value}
                </p>
                <p className="mt-2 text-[11px] text-white/30">{helper}</p>
              </div>
              <div className="rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 p-3">
                <Icon className="size-5 text-[#2DD4BF]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Credits */}
      {credits && (
        <div className="mb-6 rounded-2xl border border-[#212129] bg-[#121216] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Credits Balance
              </p>
              <p
                className="text-2xl md:text-3xl font-semibold tracking-tight text-white mt-2"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {credits.balance?.toLocaleString() ?? 0} mins remaining
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border border-[#212129] text-white/40">
                Status: {credits.status ?? 'Unknown'}
              </span>
              {isLowCredits && (
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/10">
                  Low Balance
                </span>
              )}
              {credits.agent_id && (
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border border-[#212129] text-white/30">
                  Agent {credits.agent_id}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/80">
                Balance
              </p>
              <p
                className="mt-3 text-2xl font-semibold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {credits.balance?.toLocaleString() ?? 0}
              </p>
              <p className="text-xs text-white/30 mt-1">minutes remaining</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Used
              </p>
              <p
                className="mt-3 text-2xl font-semibold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {minutesUsed.toLocaleString()}
              </p>
              <p className="text-xs text-white/30 mt-1">{usedPct}% consumed</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Total Credits
              </p>
              <p
                className="mt-3 text-2xl font-semibold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {totalCredits.toLocaleString()}
              </p>
              <p className="text-xs text-white/30 mt-1">allocated minutes</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/40">
              <span>Usage Progress</span>
              <span className={isLowCredits ? 'text-amber-400' : 'text-[#2DD4BF]'}>
                {remainingPct}% remaining
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/40 border border-[#212129] overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  isLowCredits
                    ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.45)]',
                )}
                style={{ width: `${usedPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Two-column panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#212129] bg-black/20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Recent Calls
              </p>
              <h2
                className="text-lg font-semibold text-white mt-1"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Live Call Stream
              </h2>
            </div>
            <Link
              href="/dashboard/operations"
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] hover:text-[#2DD4BF]/70 transition-colors"
            >
              View logs
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          {recentCalls.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest text-white/20">
              Waiting for system activity...
            </div>
          ) : (
            <div className="divide-y divide-[#212129]">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#121216] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {call.client_name || call.patient_phone || 'Incoming Signal'}
                    </p>
                    <p className="text-[10px] font-mono text-white/30 truncate">
                      {call.patient_phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-white/50 tabular-nums">
                      {Number(call.duration_min).toFixed(1)}m
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                      {formatDateTime(call.created_at)}
                    </span>
                    {call.appointment_id && (
                      <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
                        Booked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#212129] bg-black/20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                This Month
              </p>
              <h2
                className="text-lg font-semibold text-white mt-1"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Performance Summary
              </h2>
            </div>
            {report?.report_period ? (
              <Link
                href="/dashboard/reports"
                className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#2DD4BF] transition-colors"
              >
                {report.report_period}
              </Link>
            ) : (
              <Link
                href="/dashboard/reports"
                className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#2DD4BF] transition-colors"
              >
                View reports
              </Link>
            )}
          </div>

          {!report ? (
            <div className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest text-white/20">
              Syncing monthly data...
            </div>
          ) : (
            <div className="divide-y divide-[#212129]">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-semibold text-white/50">Total Calls</span>
                <span
                  className="text-sm font-semibold text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {report.total_calls?.toLocaleString() ?? '--'}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-semibold text-white/50">Appointments</span>
                <span
                  className="text-sm font-semibold text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {report.total_bookings?.toLocaleString() ?? '--'}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-semibold text-white/50">Gross Revenue</span>
                <span
                  className="text-sm font-semibold text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {formatRM(report.gross_revenue_generated ?? totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-semibold text-white/50">Minutes Used</span>
                <span
                  className="text-sm font-semibold text-white tabular-nums"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {formatMins(report.total_minutes_used)}
                </span>
              </div>
              <div className="px-6 py-5 bg-black/20 border-t border-[#212129]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Efficiency Rating
                  </span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {conversionRate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/40 overflow-hidden border border-[#212129]">
                  <div
                    className="h-full rounded-full bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.4)] transition-all duration-700"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-6 right-6 text-[10px] font-black uppercase tracking-widest text-white/40">
          Syncing...
        </div>
      )}
    </div>
  )
}

