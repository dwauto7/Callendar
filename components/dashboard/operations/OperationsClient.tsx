'use client'

import dynamic from 'next/dynamic'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X, PhoneCall, Clock, Mic, CalendarDays } from 'lucide-react'
import { useOperationsData } from '@/lib/hooks/useOperationsData'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CallLogRow } from '@/components/dashboard/operations/TranscriptDrawer'
import { VoiceLogsEnhanced } from '@/components/dashboard/operations/VoiceLogsEnhanced'

const TranscriptDrawer = dynamic(
  () => import('@/components/dashboard/operations/TranscriptDrawer').then(m => m.TranscriptDrawer),
  { ssr: false }
)

export type AppointmentRow = {
  id: string
  patient_name: string | null
  phone: string | null
  email: string | null
  appointment_date: string | null
  appointment_time: string | null
  appointment_type: string | null
  patient_status: string | null
  status: string | null
  projected_revenue: number | null
  reminder_sent: boolean | null
  created_at: string | null
}

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function fmtDateLabel(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00').toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

function fmtTime(t: string | null) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function buildCalendar(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const startDay = start.getDay()
  const totalDays = end.getDate()
  const cells: Date[] = []
  for (let i = startDay - 1; i >= 0; i--) cells.push(new Date(month.getFullYear(), month.getMonth(), -i))
  for (let day = 1; day <= totalDays; day++) cells.push(new Date(month.getFullYear(), month.getMonth(), day))
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
  }
  return cells
}

const STATUS_CONFIG = {
  Booked:      { dot: 'bg-[#2DD4BF]', badge: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20' },
  Cancelled:   { dot: 'bg-red-400',     badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  Rescheduled: { dot: 'bg-amber-400',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
} as const

function statusConfig(status: string | null) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? { dot: 'bg-black/20', badge: 'bg-black/20 text-white/40 border-[#212129]' }
}

export function OperationsClient({ clinicId }: { clinicId: string }) {
  const { appointments: hookAppointments, callLogs, credits, isLoading, error } = useOperationsData(clinicId)
  const [appointments, setAppointments] = useState<AppointmentRow[]>(hookAppointments)
  const [month, setMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1) })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [visibleAppointments, setVisibleAppointments] = useState(80)
  const [detailAppt, setDetailAppt] = useState<AppointmentRow | null>(null)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => { setAppointments(hookAppointments) }, [hookAppointments])

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentRow[]>()
    for (const appt of appointments) {
      if (!appt.appointment_date) continue
      const list = map.get(appt.appointment_date) ?? []
      list.push(appt)
      map.set(appt.appointment_date, list)
    }
    return map
  }, [appointments])

  const calendarCells = useMemo(() => buildCalendar(month), [month])
  const monthLabel = useMemo(() => month.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' }), [month])

  const filteredAppointments = useMemo(() => {
    const list = selectedDate ? appointments.filter(a => a.appointment_date === selectedDate) : appointments
    if (!deferredSearch) return list
    const q = deferredSearch.toLowerCase()
    return list.filter(a => (a.patient_name || '').toLowerCase().includes(q) || (a.phone || '').includes(q))
  }, [appointments, selectedDate, deferredSearch])

  const safeStats = useMemo(() => ({
    total_credits_mins: credits?.total_credits_mins ?? 0,
    minutes_used: credits?.minutes_used ?? 0,
    balance: credits?.balance ?? 0,
  }), [credits])

  const today = toDateKey(new Date())

  if (error) return (
    <div className="border border-red-500/20 rounded-xl p-6 text-red-400 text-sm">
      <p className="font-semibold mb-1">Error loading operations data</p>
      <p className="text-red-400/60">{error.message}</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">

      {/* ── CREDITS STRIP (Color-Coordinated) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Balance Available - Cyan */}
        <div className="rounded-xl p-4 bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 flex flex-col md:block">
          <p className="text-[10px] font-semibold text-[#2DD4BF]/70 uppercase tracking-[0.15em] mb-2">
            Balance Available
          </p>
          <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {safeStats.balance.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-1">minutes</p>
        </div>

        {/* Minutes Used - Amber */}
        <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20 flex flex-col md:block">
          <p className="text-[10px] font-semibold text-amber-500/70 uppercase tracking-[0.15em] mb-2">
            Minutes Used
          </p>
          <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {safeStats.minutes_used.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-1">consumed</p>
        </div>

        {/* Total Minutes - Emerald */}
        <div className="rounded-xl p-4 bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 flex flex-col md:block">
          <p className="text-[10px] font-semibold text-[#2DD4BF]/70 uppercase tracking-[0.15em] mb-2">
            Total Minutes
          </p>
          <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {safeStats.total_credits_mins.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-1">allocated</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-white/20" />
        <Input
          placeholder="Search patient or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 bg-[#0D0D11] border-[#212129] text-white/80 placeholder:text-white/20 text-sm focus:border-white/20 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="size-3.5 text-white/30 hover:text-white/60 transition-colors" />
          </button>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">

        {/* LEFT — APPOINTMENT LIST */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
              {selectedDate ? fmtDateLabel(selectedDate) : 'All Appointments'}
            </p>
            <p className="text-[10px] font-mono text-white/20">
              {filteredAppointments.length} records
            </p>
          </div>

          <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredAppointments.length === 0 ? (
              <div className="py-16 text-center text-xs text-white/20 uppercase tracking-widest">
                No appointments
              </div>
            ) : (
              filteredAppointments.slice(0, visibleAppointments).map(appt => {
                const cfg = statusConfig(appt.status)
                const linkedCall = callLogs?.find(c => c.appointment_id === appt.id)
                return (
                  <button
                    key={appt.id}
                    onClick={() => setDetailAppt(appt)}
                    className="group w-full text-left bg-[#0D0D11] border border-[#212129] rounded-xl p-4 hover:border-white/[0.12] hover:bg-[#121216] transition-all duration-150"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">{appt.patient_name || '—'}</p>
                        <p className="text-xs text-white/30 mt-0.5">{appt.phone || '—'}</p>
                      </div>
                      <span className={cn('shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border', cfg.badge)}>
                        {appt.status || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {fmtDateLabel(appt.appointment_date)} · {fmtTime(appt.appointment_time)}
                      </span>
                      <span className="text-xs font-semibold text-[#2DD4BF] tabular-nums">
                        RM {appt.projected_revenue?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    {linkedCall && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center gap-1.5">
                        <Mic className="size-3 text-white/20" />
                        <span className="text-[10px] text-white/25">
                          {linkedCall.duration_min?.toFixed(1) || '0'} min recorded
                        </span>
                      </div>
                    )}
                  </button>
                )
              })
            )}
            {visibleAppointments < filteredAppointments.length && (
              <button
                onClick={() => setVisibleAppointments(v => v + 40)}
                className="py-2 text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest font-semibold"
              >
                Load more
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — CALENDAR */}
        <div className="bg-[#0D0D11] border border-[#212129] rounded-xl p-5">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-white/80">{monthLabel}</p>
            <div className="flex gap-1">
              {[
                { icon: ChevronLeft, onClick: () => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1)) },
                { icon: ChevronRight, onClick: () => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1)) },
              ].map(({ icon: Icon, onClick }, i) => (
                <button key={i} onClick={onClick} className="size-7 flex items-center justify-center rounded-xl hover:bg-[#0D0D11] transition-colors">
                  <Icon className="size-3.5 text-white/40" />
                </button>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map(date => {
              const dateStr = toDateKey(date)
              const isCurrentMonth = date.getMonth() === month.getMonth()
              const isSelected = selectedDate === dateStr
              const isToday = dateStr === today
              const dayAppts = appointmentsByDate.get(dateStr) ?? []
              const hasBooked = dayAppts.some(a => a.status === 'Booked')
              const hasCancelled = dayAppts.some(a => a.status === 'Cancelled')
              const hasRescheduled = dayAppts.some(a => a.status === 'Rescheduled')

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    'relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150',
                    !isCurrentMonth && 'opacity-20',
                    isSelected && 'bg-black/20 ring-1 ring-white/20',
                    !isSelected && isCurrentMonth && 'hover:bg-[#121216]',
                    isToday && !isSelected && 'ring-1 ring-white/15',
                  )}
                >
                  <span className={cn(
                    'text-xs tabular-nums leading-none',
                    isToday ? 'font-black text-white' : 'font-medium text-white/50',
                    isSelected && 'text-white',
                  )}>
                    {date.getDate()}
                  </span>
                  {dayAppts.length > 0 && (
                    <div className="flex gap-0.5 items-center">
                      {hasBooked      && <span className="size-1 rounded-full bg-[#2DD4BF]" />}
                      {hasRescheduled && <span className="size-1 rounded-full bg-amber-400" />}
                      {hasCancelled   && <span className="size-1 rounded-full bg-red-400" />}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.05]">
            {[
              { color: 'bg-[#2DD4BF]', label: 'Booked' },
              { color: 'bg-amber-400',   label: 'Rescheduled' },
              { color: 'bg-red-400',     label: 'Cancelled' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn('size-1.5 rounded-full', color)} />
                <span className="text-[9px] uppercase tracking-widest font-semibold text-white/25">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VOICE LOGS ── */}
      <VoiceLogsEnhanced callLogs={callLogs || []} />

      {/* ── APPOINTMENT DETAIL PANEL ── */}
      {detailAppt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end lg:items-center lg:justify-end">
          <div className="w-full lg:w-[440px] bg-[#0A0B0E] border border-white/[0.08] h-full lg:h-auto lg:max-h-[90vh] lg:rounded-2xl lg:mr-6 flex flex-col overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#212129]">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25 mb-0.5">Appointment</p>
                <h2 className="text-base font-semibold text-white">{detailAppt.patient_name || '—'}</h2>
              </div>
              <button
                onClick={() => setDetailAppt(null)}
                className="size-8 flex items-center justify-center rounded-xl hover:bg-[#0D0D11] transition-colors"
              >
                <X className="size-4 text-white/40" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status badge */}
              <div>
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border',
                  statusConfig(detailAppt.status).badge
                )}>
                  {detailAppt.status || '—'}
                </span>
              </div>

              {/* Details grid */}
              <div className="space-y-1">
                {[
                  { label: 'Date',  value: fmtDateLabel(detailAppt.appointment_date) },
                  { label: 'Time',  value: fmtTime(detailAppt.appointment_time) },
                  { label: 'Type',  value: detailAppt.appointment_type || '—' },
                  { label: 'Phone', value: detailAppt.phone || '—' },
                  { label: 'Email', value: detailAppt.email || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04]">
                    <span className="text-xs text-white/30">{label}</span>
                    <span className="text-xs font-medium text-white/70">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-white/30">Revenue</span>
                  <span className="text-sm font-semibold text-[#2DD4BF] tabular-nums">
                    RM {detailAppt.projected_revenue?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Linked call */}
              {(() => {
                const linkedCall = callLogs?.find(c => c.appointment_id === detailAppt.id)
                return linkedCall ? (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">Call Record</p>
                    <div className="bg-[#121216] border border-[#212129] rounded-xl p-4 space-y-2">
                      {[
                        { label: 'Duration',       value: `${linkedCall.duration_min?.toFixed(1) || '0'} min` },
                        { label: 'Minutes Saved',  value: `${linkedCall.minutes_saved?.toFixed(1) || '0'} min` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-xs text-white/30">{label}</span>
                          <span className="text-xs font-medium text-white/60">{value}</span>
                        </div>
                      ))}
                      {linkedCall.is_after_hours && (
                        <div className="pt-2 border-t border-[#212129]">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            After Hours
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/20 italic">No call record linked.</p>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed bottom-6 right-6 text-[10px] text-white/20 font-mono uppercase tracking-widest">
          Syncing
        </div>
      )}
    </div>
  )
}