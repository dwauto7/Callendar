'use client'

import { useOperationsData } from '@/lib/hooks/useOperationsData'
import { formatRM } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OperationsContentProps {
  clinicName: string
  isActive: boolean
  clinicConfigId: string
}

export function OperationsContent({
  clinicName,
  isActive,
  clinicConfigId,
}: OperationsContentProps) {
  const { credits, appointments, callLogs, isLoading, error } =
    useOperationsData(clinicConfigId)

  // Aggregations from credits
  const balance = credits?.balance ?? 0
  const minutesUsed = credits?.minutes_used ?? 0
  const totalCredits = credits?.total_credits_mins ?? 0

  // Filter non-cancelled appointments for display
  const activeAppointments = appointments.filter((a) => a.status !== 'cancelled')
  const appointmentCount = activeAppointments.length

  if (error) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          <p className="font-semibold">Error loading operations data</p>
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
          <h1
            className="text-4xl md:text-5xl font-semibold text-white tracking-tighter leading-none"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {clinicName}
          </h1>
          <p
            className="text-base md:text-lg font-semibold text-white/20 tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Operations Hub
          </p>
        </div>

        {/* ── Active / Inactive badge ── */}
        <div className="md:mt-1 shrink-0">
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all duration-300',
              isActive
                ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF] shadow-[0_0_12px_rgba(16,185,129,0.15)]'
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
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-4">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">
            Engine Capacity
          </p>
          <p className="text-2xl font-semibold text-white">
            {balance.toLocaleString()}
            <span className="text-xs font-medium text-white/30 ml-1">mins</span>
          </p>
        </div>

        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-4">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">
            Minutes Used
          </p>
          <p className="text-2xl font-semibold text-white">
            {minutesUsed.toLocaleString()}
            <span className="text-xs font-medium text-white/30 ml-1">mins</span>
          </p>
        </div>

        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-4">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">
            Total Allocation
          </p>
          <p className="text-2xl font-semibold text-white">
            {totalCredits.toLocaleString()}
            <span className="text-xs font-medium text-white/30 ml-1">mins</span>
          </p>
        </div>

        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-4">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-2">
            Active Appointments
          </p>
          <p className="text-2xl font-semibold text-white">
            {appointmentCount}
            <span className="text-xs font-medium text-white/30 ml-1">booked</span>
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Calendar (left - 2 cols) */}
        <div className="lg:col-span-2 bg-[#121216] border border-[#212129] rounded-2xl p-6">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">
            Appointment Schedule
          </h2>
          
          {activeAppointments.length === 0 ? (
            <div className="text-center py-12 text-white/20 italic">
              No upcoming appointments
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {activeAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#121216] border border-[#212129] rounded-xl p-3 hover:bg-[#121216] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {apt.patient_name || apt.patient_phone || 'Unknown'}
                      </p>
                      <p className="text-xs text-white/40 font-mono">
                        {apt.appointment_date} @ {apt.appointment_time}
                      </p>
                      <p className="text-xs text-white/30 mt-1">
                        {apt.service_name || 'Service'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          'inline-block text-xs font-black px-2 py-1 rounded-md',
                          apt.status === 'booked'
                            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
                            : 'bg-amber-500/10 text-amber-500'
                        )}
                      >
                        {apt.status}
                      </span>
                      {apt.projected_revenue > 0 && (
                        <p className="text-xs text-white/40 mt-2">
                          {formatRM(apt.projected_revenue)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call Logs (right - 1 col) */}
        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-6">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">
            Recent Calls
          </h2>

          {callLogs.length === 0 ? (
            <div className="text-center py-12 text-white/20 italic">
              No calls yet
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {callLogs.slice(0, 20).map((call) => (
                <div
                  key={call.id}
                  className="bg-[#121216] border border-[#212129] rounded-xl p-3 hover:bg-[#121216] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">
                        {call.client_name || call.patient_phone || 'Incoming'}
                      </p>
                      <p className="text-[10px] text-white/40 font-mono truncate">
                        {call.patient_phone}
                      </p>
                      <p className="text-[9px] text-white/20 mt-1">
                        {new Date(call.created_at).toLocaleString('en-MY', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-[#2DD4BF]">
                        {Number(call.duration_min).toFixed(1)}m
                      </p>
                      {call.is_after_hours && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded mt-1 inline-block">
                          After Hrs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
