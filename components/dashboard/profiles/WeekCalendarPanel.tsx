'use client'

import { Appointment } from '@/components/dashboard/profiles/DoctorProfileClient'
import { cn } from '@/lib/utils'

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekDates() {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const start = new Date(now)
  start.setDate(now.getDate() + diffToMonday)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return date
  })
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString('en-MY', { weekday: 'short' }).toUpperCase()
}

export function WeekCalendarPanel({
  appointments,
  selectedId,
  onSelect,
}: {
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const weekDates = getWeekDates()
  const todayKey = toDateKey(new Date())

  return (
    <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#212129] bg-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">This Week</p>
        <h2 className="text-lg font-semibold text-white mt-1" style={{ fontFamily: 'var(--font-syne)' }}>
          Calendar
        </h2>
      </div>

      <div className="grid grid-cols-7 border-b border-[#212129]">
        {weekDates.map((date) => {
          const key = toDateKey(date)
          const isToday = key === todayKey
          return (
            <div
              key={key}
              className="px-1 py-3 text-center border-r border-[#212129] last:border-r-0"
            >
              <div className={cn('text-[9px] font-black uppercase tracking-widest', isToday ? 'text-[#2DD4BF]' : 'text-white/30')}>
                {formatDayLabel(date)}
              </div>
              <div className={cn('text-sm font-semibold tabular-nums mt-0.5', isToday ? 'text-[#2DD4BF]' : 'text-white/60')} style={{ fontFamily: 'var(--font-syne)' }}>
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-7">
        {weekDates.map((date) => {
          const key = toDateKey(date)
          const dayAppointments = appointments.filter((a) => a.appointment_date === key)
          const isToday = key === todayKey
          return (
            <div
              key={key}
              className={cn(
                'border-r border-[#212129] last:border-r-0 min-h-[380px] p-1.5 space-y-1',
                isToday && 'bg-[#2DD4BF]/[0.03]',
              )}
            >
              {dayAppointments.map((appt) => {
                const isCancelled = appt.status === 'Cancelled' || appt.status === 'No Show'
                const isSelected = selectedId === appt.id
                return (
                  <button
                    key={appt.id}
                    onClick={() => onSelect(appt.id)}
                    className={cn(
                      'w-full text-left rounded-xl px-1.5 py-1 cursor-pointer transition-colors',
                      isCancelled
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-[#2DD4BF]/10 border border-[#2DD4BF]/20',
                      isSelected && 'ring-1 ring-white/20',
                    )}
                  >
                    <div
                      className={cn(
                        'text-[8px] font-black uppercase tabular-nums',
                        isCancelled ? 'text-red-400/70' : 'text-[#2DD4BF]/70'
                      )}
                    >
                      {appt.appointment_time ? appt.appointment_time.slice(0, 5) : '-'}
                    </div>
                    <div className={cn('text-[9px] font-semibold mt-0.5 truncate', isCancelled ? 'text-red-400' : 'text-[#2DD4BF]')}>
                      {appt.patient_name || '-'}
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
