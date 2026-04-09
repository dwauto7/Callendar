'use client'

import { Appointment } from '@/components/dashboard/profiles/DoctorProfileClient'
import { cn } from '@/lib/utils'

function formatTime(time: string | null) {
  if (!time) return '-'
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function statusBadge(status: Appointment['status'], confirmed: boolean | null) {
  if (status === 'Cancelled' || status === 'No Show') {
    return 'bg-red-500/10 border-red-500/20 text-red-400'
  }
  if (status === 'Booked' && confirmed) {
    return 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF]'
  }
  if (status === 'Booked' && !confirmed) {
    return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  }
  if (status === 'Completed') {
    return 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF]'
  }
  return 'bg-black/20 border-[#212129] text-white/40'
}

export function AppointmentListPanel({
  appointments,
  selectedId,
  onSelect,
  activeFilter,
  onFilterChange,
}: {
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (id: string) => void
  activeFilter: 'today' | 'week' | 'upcoming'
  onFilterChange: (f: 'today' | 'week' | 'upcoming') => void
}) {
  const todayCount = appointments.length

  return (
    <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#212129] bg-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Appointments</p>
        <h2 className="text-lg font-semibold text-white mt-1" style={{ fontFamily: 'var(--font-syne)' }}>
          Schedule
        </h2>
      </div>

      <div className="px-6 py-3 border-b border-[#212129] flex gap-2">
        {(['today', 'week', 'upcoming'] as const).map((filter) => {
          const active = activeFilter === filter
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors',
                active
                  ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20'
                  : 'text-white/30 hover:text-white/60',
              )}
            >
              {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'Upcoming'}
              {active && filter === 'today' && (
                <span className="ml-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
                  {todayCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="divide-y divide-[#212129] overflow-y-auto max-h-[560px]">
        {appointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest text-white/20">
            No appointments found.
          </div>
        ) : (
          appointments.map((appt) => {
            const selected = selectedId === appt.id
            return (
              <button
                key={appt.id}
                onClick={() => onSelect(appt.id)}
                className={cn(
                  'w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-all text-left',
                  selected ? 'bg-[#2DD4BF]/5 border-l-2 border-[#2DD4BF]' : 'hover:bg-white/[0.03]',
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-white">{appt.patient_name || '-'}</p>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5 tabular-nums">
                    {formatTime(appt.appointment_time)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border border-[#212129] text-white/40">
                    {appt.appointment_type || 'General'}
                  </span>
                  <span className={cn('px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border', statusBadge(appt.status, appt.appointment_confirmed))}>
                    {appt.status || 'Booked'}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
