'use client'

import dynamic from 'next/dynamic'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X, PhoneCall } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CallLogRow } from '@/components/dashboard/operations/TranscriptDrawer'

const CreditsLogsClient = dynamic(
  () => import('@/components/dashboard/credits/CreditsLogsClient').then(m => m.CreditsLogsClient),
  { ssr: false }
)

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
  patient_status: string | null
  status: string | null
  projected_revenue: number | null
  reminder_sent: boolean | null
  created_at: string | null
}

function fmtDateLabel(date: Date) {
  return date.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtTime(t: string | null) {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}
function toDateKey(date: Date) { return date.toISOString().slice(0, 10) }
function buildCalendar(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const startDay = start.getDay()
  const totalDays = end.getDate()
  const cells: Date[] = []
  for (let i = startDay - 1; i >= 0; i -= 1) { cells.push(new Date(month.getFullYear(), month.getMonth(), -i)) }
  for (let day = 1; day <= totalDays; day += 1) { cells.push(new Date(month.getFullYear(), month.getMonth(), day)) }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
  }
  return cells
}

export function OperationsClient({
  clinicId,
  initialAppointments,
  initialCalls,
  stats,
}: {
  clinicId: string
  initialAppointments: AppointmentRow[]
  initialCalls: CallLogRow[]
  stats: { total_credits_mins: number | null; minutes_used: number | null; balance: number | null } | null
}) {
  const [appointments, setAppointments] = useState<AppointmentRow[]>(initialAppointments)
  const [calls] = useState<CallLogRow[]>(initialCalls)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [visibleAppointments, setVisibleAppointments] = useState(80)
  const [detailAppt, setDetailAppt] = useState<AppointmentRow | null>(null)
  const deferredSearch = useDeferredValue(search)

  // Transcript drawer state
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<CallLogRow | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const appointmentsChannel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `clinic_id=eq.${clinicId}`
        },
        (payload) => {
          setAppointments((prev) => {
            const next = [...prev]
            const incoming = payload.new as AppointmentRow
            if (payload.eventType === 'DELETE') {
              return next.filter((item) => item.id !== (payload.old as { id: string }).id)
            }
            const idx = next.findIndex((item) => item.id === incoming.id)
            if (idx >= 0) {
              next[idx] = { ...next[idx], ...incoming }
            } else {
              next.unshift(incoming)
            }
            return next
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(appointmentsChannel) }
  }, [clinicId])

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentRow[]>()
    for (const appt of appointments) {
      if (!appt.appointment_date) continue
      const key = appt.appointment_date
      const list = map.get(key) ?? []
      list.push(appt)
      map.set(key, list)
    }
    return map
  }, [appointments])

  const calendarCells = useMemo(() => buildCalendar(month), [month])
  const monthLabel = useMemo(
    () => month.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' }),
    [month]
  )

  const filteredAppointments = useMemo(() => {
    const list = selectedDate
      ? appointments.filter((a) => a.appointment_date === selectedDate)
      : appointments
    if (!deferredSearch) return list
    const query = deferredSearch.toLowerCase()
    return list.filter(
      (a) =>
        (a.patient_name || '').toLowerCase().includes(query) ||
        (a.phone || '').includes(query)
    )
  }, [appointments, selectedDate, deferredSearch])

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <Input
          placeholder="Search by patient name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#111318] border-[#1E2128] text-white placeholder:text-gray-600"
        />
      </div>

      {/* Two-Column Layout: List on left, Calendar on right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        {/* LEFT: Appointments List */}
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-400">
            {selectedDate
              ? `${filteredAppointments.length} appointment${filteredAppointments.length !== 1 ? 's' : ''} on ${fmtDateLabel(new Date(selectedDate))}`
              : `${filteredAppointments.length} total appointment${filteredAppointments.length !== 1 ? 's' : ''}`}
          </div>
          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredAppointments.slice(0, visibleAppointments).map((appt) => {
              const linkedCall = calls?.find((c) => c.appointment_id === appt.id)
              const statusColor =
                appt.status === 'Booked'
                  ? 'bg-emerald-600/20 text-emerald-300'
                  : appt.status === 'Cancelled'
                  ? 'bg-red-600/20 text-red-300'
                  : 'bg-amber-600/20 text-amber-300'

              return (
                <button
                  key={appt.id}
                  onClick={() => setDetailAppt(appt)}
                  className="p-4 bg-[#111318] border border-[#1E2128] rounded-lg hover:bg-[#161B22] transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-medium text-white">{appt.patient_name || '—'}</p>
                      <p className="text-sm text-gray-400">{appt.phone || '—'}</p>
                    </div>
                    <Badge className={statusColor}>{appt.status || '—'}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>
                      {appt.appointment_date && fmtDateLabel(new Date(appt.appointment_date))} ·{' '}
                      {fmtTime(appt.appointment_time)}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      RM {appt.projected_revenue?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  {linkedCall && (
                    <div className="text-xs text-gray-500 pt-2 border-t border-[#1E2128]">
                      Call recorded • {linkedCall.duration_min?.toFixed(1) || '0'} min
                    </div>
                  )}
                </button>
              )
            })}
            {visibleAppointments < filteredAppointments.length && (
              <button
                onClick={() => setVisibleAppointments((v) => v + 40)}
                className="py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Load more...
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Calendar */}
        <div className="p-4 bg-[#111318] border border-[#1E2128] rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">{monthLabel}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="p-1 hover:bg-[#161B22] rounded transition-colors"
              >
                <ChevronLeft className="size-4 text-gray-400" />
              </button>
              <button
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="p-1 hover:bg-[#161B22] rounded transition-colors"
              >
                <ChevronRight className="size-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((date) => {
              const dateStr = toDateKey(date)
              const isCurrentMonth = date.getMonth() === month.getMonth()
              const isSelected = selectedDate === dateStr
              const hasAppointments = appointmentsByDate.has(dateStr)
              const appointmentCount = appointmentsByDate.get(dateStr)?.length ?? 0

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    'aspect-square p-2 rounded text-sm font-medium transition-colors flex flex-col items-center justify-center',
                    isCurrentMonth ? 'text-white' : 'text-gray-600',
                    isSelected ? 'bg-emerald-600/30 border border-emerald-500/50' : 'hover:bg-[#161B22]',
                    !isCurrentMonth && 'opacity-50'
                  )}
                >
                  <span>{date.getDate()}</span>
                  {hasAppointments && (
                    <span className="text-xs mt-1 bg-emerald-600/50 px-1 rounded-full text-emerald-200">
                      {appointmentCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── VOICE LOGS SECTION ── */}

      {/* Credits Stats Bar */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mt-2">
          {[
            { label: 'Total Credits', value: `${stats.total_credits_mins ?? 0} min` },
            { label: 'Used', value: `${stats.minutes_used ?? 0} min` },
            { label: 'Balance', value: `${stats.balance ?? 0} min` },
          ].map(({ label, value }) => (
            <div key={label} className="glass-panel rounded-2xl border border-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Voice Logs List — clicking a row opens TranscriptDrawer */}
      <CreditsLogsClient
        calls={calls}
        onSelectCall={(call) => {
          setSelectedCall(call)
          setTranscriptOpen(true)
        }}
      />

      {/* Transcript / Summary Drawer */}
      <TranscriptDrawer
        call={selectedCall}
        open={transcriptOpen}
        onOpenChange={setTranscriptOpen}
      />

      {/* ── APPOINTMENT DETAIL DRAWER ── */}
      {detailAppt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center lg:justify-end">
          <div className="w-full lg:w-[500px] bg-[#0A0A0A] border-l border-[#1E2128] h-full lg:h-auto lg:rounded-lg lg:mr-6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#1E2128]">
              <h2 className="text-lg font-semibold text-white">
                {detailAppt.patient_name || 'Appointment'}
              </h2>
              <button
                onClick={() => setDetailAppt(null)}
                className="p-1 hover:bg-[#111318] rounded transition-colors"
              >
                <X className="size-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Appointment Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Appointment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-white">
                      {detailAppt.appointment_date && fmtDateLabel(new Date(detailAppt.appointment_date))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="text-white">{fmtTime(detailAppt.appointment_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-white">{detailAppt.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-white text-xs">{detailAppt.email || '—'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#1E2128]">
                    <span className="text-gray-500">Status</span>
                    <Badge
                      className={
                        detailAppt.status === 'Booked'
                          ? 'bg-emerald-600/20 text-emerald-300'
                          : detailAppt.status === 'Cancelled'
                          ? 'bg-red-600/20 text-red-300'
                          : 'bg-amber-600/20 text-amber-300'
                      }
                    >
                      {detailAppt.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenue</span>
                    <span className="text-emerald-400 font-medium">
                      RM {detailAppt.projected_revenue?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Call — with button to open transcript */}
              {(() => {
                const linkedCall = calls?.find((c) => c.appointment_id === detailAppt.id)
                return linkedCall ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400 uppercase">Call Record</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-white">{linkedCall.duration_min?.toFixed(1) || '0'} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Minutes Saved</span>
                        <span className="text-white">{linkedCall.minutes_saved?.toFixed(1) || '0'} min</span>
                      </div>
                      {linkedCall.is_after_hours && (
                        <div className="pt-2 border-t border-[#1E2128]">
                          <Badge className="bg-amber-600/20 text-amber-300">After Hours</Badge>
                        </div>
                      )}
                    </div>
                    {/* Open transcript for this linked call */}
                    <button
                      onClick={() => {
                        setDetailAppt(null)
                        setSelectedCall(linkedCall)
                        setTranscriptOpen(true)
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#40E0FF]/20 bg-[#40E0FF]/5 text-[#40E0FF] text-sm font-semibold hover:bg-[#40E0FF]/10 transition-colors"
                    >
                      <PhoneCall className="size-4" />
                      View Transcript & Summary
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 italic">No call record linked to this appointment.</p>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
