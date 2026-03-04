'use client'

import { useState, useMemo } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatRM } from '@/lib/utils'
import { CalendarCheck, DollarSign, CheckCircle2, Filter, X } from 'lucide-react'

export type AppointmentRow = {
  id: string
  patient_name: string | null
  phone: string | null
  email: string | null
  appointment_date: string | null
  appointment_time: string | null
  patient_status: string | null
  status: string
  appointment_confirmed: boolean
  projected_revenue: number | null
  reminder_sent: boolean
  created_at: string
}

interface AppointmentsClientProps {
  appointments: AppointmentRow[]
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function fmtTime(t: string | null) {
  if (!t) return '—'
  // t is HH:MM:SS — parse and format
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function AppointmentsClient({ appointments }: AppointmentsClientProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterConfirmed, setFilterConfirmed] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterConfirmed && !a.appointment_confirmed) return false
      if (dateFrom && a.appointment_date && a.appointment_date < dateFrom) return false
      if (dateTo && a.appointment_date && a.appointment_date > dateTo) return false
      return true
    })
  }, [appointments, filterStatus, filterConfirmed, dateFrom, dateTo])

  const totalRevenue = filtered.reduce((s, a) => s + (a.projected_revenue || 0), 0)
  const totalConfirmed = filtered.filter((a) => a.appointment_confirmed).length
  const totalBooked = filtered.filter((a) => a.status === 'Booked').length

  const hasFilters = filterStatus !== 'all' || filterConfirmed || dateFrom || dateTo

  function clearFilters() {
    setFilterStatus('all')
    setFilterConfirmed(false)
    setDateFrom('')
    setDateTo('')
  }

  return (
    <>
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {[
          { icon: CalendarCheck, label: 'Booked', value: totalBooked.toLocaleString(), color: '#10B981' },
          { icon: CheckCircle2, label: 'Confirmed', value: totalConfirmed.toLocaleString(), color: '#3B82F6' },
          { icon: DollarSign, label: 'Projected Revenue', value: formatRM(totalRevenue), color: '#10B981' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[#1E2128] bg-[#111318] px-4 py-3.5 flex items-center gap-3"
          >
            <div className="rounded-lg p-2 shrink-0" style={{ background: `${color}18` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">{label}</p>
              <p className="text-lg font-bold text-[#F1F5F9] tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Filter className="size-3.5" />
          <span className="font-medium uppercase tracking-wider">Filters</span>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-[120px] border-[#1E2128] bg-[#111318] text-xs text-[#F1F5F9] focus:ring-0 focus:border-[#10B981]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#111318] border-[#1E2128]">
            <SelectItem value="all" className="text-xs text-[#F1F5F9]">All statuses</SelectItem>
            <SelectItem value="Booked" className="text-xs text-[#F1F5F9]">Booked</SelectItem>
            <SelectItem value="Cancelled" className="text-xs text-[#F1F5F9]">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 rounded-md border border-[#1E2128] bg-[#111318] px-2.5 text-xs text-[#F1F5F9] [color-scheme:dark] focus:border-[#10B981] focus:outline-none transition-colors"
          />
          <span className="text-[#64748B] text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-8 rounded-md border border-[#1E2128] bg-[#111318] px-2.5 text-xs text-[#F1F5F9] [color-scheme:dark] focus:border-[#10B981] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1E2128] bg-[#111318]">
          <Switch
            id="confirmed-only"
            checked={filterConfirmed}
            onCheckedChange={setFilterConfirmed}
            className="data-[state=checked]:bg-[#10B981] scale-75"
          />
          <Label htmlFor="confirmed-only" className="text-xs text-[#64748B] cursor-pointer">
            Confirmed only
          </Label>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-[#64748B] tabular-nums">
          {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-[#1E2128] text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">
              <th className="text-left px-5 py-3">Patient</th>
              <th className="text-left px-3 py-3">Date / Time</th>
              <th className="text-left px-3 py-3">Status</th>
              <th className="text-center px-3 py-3">Confirmed</th>
              <th className="text-center px-3 py-3">Reminder</th>
              <th className="text-left px-3 py-3">Patient Status</th>
              <th className="text-right px-5 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2128]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-[#64748B]">
                  No appointments match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-[#161B22] transition-colors duration-200"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[#F1F5F9] truncate max-w-[160px]">
                      {appt.patient_name || '—'}
                    </p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{appt.phone || appt.email || ''}</p>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <p className="text-xs text-[#F1F5F9]">{fmtDate(appt.appointment_date)}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{fmtTime(appt.appointment_time)}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge
                      className={
                        appt.status === 'Booked'
                          ? 'bg-[#10B981]/15 text-[#10B981] border-0 text-[10px] font-bold uppercase'
                          : 'bg-[#EF4444]/15 text-[#EF4444] border-0 text-[10px] font-bold uppercase'
                      }
                    >
                      {appt.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span
                      className={`inline-block size-2 rounded-full ${appt.appointment_confirmed ? 'bg-[#10B981]' : 'bg-[#1E2128]'}`}
                      title={appt.appointment_confirmed ? 'Confirmed' : 'Not confirmed'}
                    />
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span
                      className={`inline-block size-2 rounded-full ${appt.reminder_sent ? 'bg-[#3B82F6]' : 'bg-[#1E2128]'}`}
                      title={appt.reminder_sent ? 'Sent' : 'Not sent'}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs text-[#64748B]">{appt.patient_status || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-[#10B981] tabular-nums">
                      {formatRM(appt.projected_revenue)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
