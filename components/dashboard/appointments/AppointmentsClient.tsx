'use client'

import { useState, useMemo } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
          { icon: CalendarCheck, label: 'Booked', value: totalBooked.toLocaleString(), color: '#2DD4BF' },
          { icon: CheckCircle2, label: 'Confirmed', value: totalConfirmed.toLocaleString(), color: '#2DD4BF' },
          { icon: DollarSign, label: 'Projected Revenue', value: formatRM(totalRevenue), color: '#2DD4BF' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#212129] bg-[#121216] px-4 py-3.5 flex items-center gap-3 glass-panel"
          >
            <div className="rounded-xl p-2 shrink-0" style={{ background: `${color}18` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{label}</p>
              <p className="text-lg font-semibold text-white tabular-nums" style={{ fontFamily: 'var(--font-syne)' }}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Filter className="size-3.5" />
          <span className="font-medium uppercase tracking-wider">Filters</span>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-[120px] border-[#212129] bg-[#121216] text-xs text-white focus:ring-0 focus:border-[#2DD4BF]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1014] border-[#212129]">
            <SelectItem value="all" className="text-xs text-white">All statuses</SelectItem>
            <SelectItem value="Booked" className="text-xs text-white">Booked</SelectItem>
            <SelectItem value="Cancelled" className="text-xs text-white">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 rounded-md border border-[#212129] bg-[#121216] px-2.5 text-xs text-white [color-scheme:dark] focus:border-[#2DD4BF] focus:outline-none transition-colors"
          />
          <span className="text-white/30 text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-8 rounded-md border border-[#212129] bg-[#121216] px-2.5 text-xs text-white [color-scheme:dark] focus:border-[#2DD4BF] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#212129] bg-[#121216] backdrop-blur-md">
          <Switch
            id="confirmed-only"
            checked={filterConfirmed}
            onCheckedChange={setFilterConfirmed}
            className="data-[state=checked]:bg-[#2DD4BF] scale-75"
          />
          <Label htmlFor="confirmed-only" className="text-xs text-white/40 cursor-pointer">
            Confirmed only
          </Label>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-red-400 transition-colors"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-white/40 tabular-nums">
          {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden overflow-x-auto glass-panel">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="border-b border-[#212129] text-[10px] font-semibold text-white/40 uppercase tracking-widest">
              <TableHead className="text-left px-5 py-3">Patient</TableHead>
              <TableHead className="text-left px-3 py-3">Date / Time</TableHead>
              <TableHead className="text-left px-3 py-3">Status</TableHead>
              <TableHead className="text-center px-3 py-3">Confirmed</TableHead>
              <TableHead className="text-center px-3 py-3">Reminder</TableHead>
              <TableHead className="text-left px-3 py-3">Patient Status</TableHead>
              <TableHead className="text-right px-5 py-3">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-sm text-white/40">
                  No appointments match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((appt) => (
                <TableRow
                  key={appt.id}
                  className="hover:bg-[#121216] transition-colors duration-200"
                >
                  <TableCell className="px-5 py-3.5">
                    <p className="font-medium text-white truncate max-w-[160px]">
                      {appt.patient_name || '—'}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{appt.phone || appt.email || ''}</p>
                  </TableCell>
                  <TableCell className="px-3 py-3.5 whitespace-nowrap">
                    <p className="text-xs text-white">{fmtDate(appt.appointment_date)}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{fmtTime(appt.appointment_time)}</p>
                  </TableCell>
                  <TableCell className="px-3 py-3.5">
                    <Badge
                      className={
                        appt.status === 'Booked'
                          ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-0 text-[10px] font-semibold uppercase'
                          : 'bg-[#EF4444]/15 text-red-400 border-0 text-[10px] font-semibold uppercase'
                      }
                    >
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-3.5 text-center">
                    <span
                      className={`inline-block size-2 rounded-full ${appt.appointment_confirmed ? 'bg-[#2DD4BF]' : 'bg-black/20'}`}
                      title={appt.appointment_confirmed ? 'Confirmed' : 'Not confirmed'}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-3.5 text-center">
                    <span
                      className={`inline-block size-2 rounded-full ${appt.reminder_sent ? 'bg-[#2DD4BF]' : 'bg-black/20'}`}
                      title={appt.reminder_sent ? 'Sent' : 'Not sent'}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-3.5">
                    <span className="text-xs text-white/30">{appt.patient_status || '—'}</span>
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold text-[#2DD4BF] tabular-nums">
                      {formatRM(appt.projected_revenue)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

