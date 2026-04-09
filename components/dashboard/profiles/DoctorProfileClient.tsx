'use client'

import { useMemo, useState } from 'react'
import { DoctorHeroBanner } from '@/components/dashboard/profiles/DoctorHeroBanner'
import { ProfileStatsRow } from '@/components/dashboard/profiles/ProfileStatsRow'
import { AppointmentListPanel } from '@/components/dashboard/profiles/AppointmentListPanel'
import { WeekCalendarPanel } from '@/components/dashboard/profiles/WeekCalendarPanel'
import { AppointmentDrawer } from '@/components/dashboard/profiles/AppointmentDrawer'

export type DoctorProfile = {
  display_name: string | null
  specialty: string | null
  user_email: string | null
  is_active: boolean | null
  avatar_url: string | null
  clinic_configs: { clinic_name: string | null } | null
}

export type DoctorStats = {
  today: number | null
  week: number | null
  month: number | null
  completion_rate: number | null
}

export type Appointment = {
  id: string
  patient_name: string | null
  phone: string | null
  email: string | null
  appointment_date: string | null
  appointment_time: string | null
  appointment_type: string | null
  service_category: string | null
  status: 'Booked' | 'Cancelled' | 'Completed' | 'No Show' | null
  appointment_confirmed: boolean | null
}

type NextAppointment = {
  id: string
  patient_name: string | null
  appointment_date: string | null
  appointment_time: string | null
  appointment_type: string | null
  status: string | null
} | null

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTime(time: string | null) {
  if (!time) return '-'
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDateLong(dateStr: string | null) {
  if (!dateStr) return '-'
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

function minutesUntil(appointmentDate: string | null, appointmentTime: string | null) {
  if (!appointmentDate || !appointmentTime) return null
  const [h, m] = appointmentTime.split(':').map(Number)
  const target = new Date(`${appointmentDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
  const diffMs = target.getTime() - new Date().getTime()
  const diffMin = Math.round(diffMs / 60000)
  return diffMin
}

function NextAppointmentBanner({ appointment }: { appointment: NextAppointment }) {
  if (!appointment) return null
  const minutes = minutesUntil(appointment.appointment_date, appointment.appointment_time)
  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-[#212129] border-l-4 border-l-[#2DD4BF] bg-[#121216] mb-6">
      <span className="size-2 rounded-full bg-[#2DD4BF] animate-pulse" />
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Next:</span>
        <span className="tabular-nums">
          {appointment.patient_name || '-'} - {formatTime(appointment.appointment_time)} - {appointment.appointment_type || '-'}
        </span>
      </div>
      <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] tabular-nums">
        {minutes !== null ? `in ${minutes} minutes` : 'up next'}
      </div>
    </div>
  )
}

export function DoctorProfileClient({
  doctor,
  stats,
  nextAppointment,
  appointments,
}: {
  doctor: DoctorProfile
  stats: DoctorStats
  nextAppointment: NextAppointment
  appointments: Appointment[]
}) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'upcoming'>('today')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const todayKey = useMemo(() => toDateKey(new Date()), [])

  const weekRange = useMemo(() => {
    const now = new Date()
    const day = now.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const start = new Date(now)
    start.setDate(now.getDate() + diffToMonday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start: toDateKey(start), end: toDateKey(end) }
  }, [])

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (!appt.appointment_date) return false
      if (activeFilter === 'today') return appt.appointment_date === todayKey
      if (activeFilter === 'week') return appt.appointment_date >= weekRange.start && appt.appointment_date <= weekRange.end
      return appt.appointment_date > todayKey
    })
  }, [appointments, activeFilter, todayKey, weekRange])

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId]
  )

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
      <DoctorHeroBanner doctor={doctor} stats={stats} />
      <ProfileStatsRow stats={stats} />
      <NextAppointmentBanner appointment={nextAppointment} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentListPanel
          appointments={filteredAppointments}
          selectedId={selectedAppointmentId}
          onSelect={(id) => {
            setSelectedAppointmentId(id)
            setIsDrawerOpen(true)
          }}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <WeekCalendarPanel
          appointments={appointments}
          selectedId={selectedAppointmentId}
          onSelect={(id) => {
            setSelectedAppointmentId(id)
            setIsDrawerOpen(true)
          }}
        />
      </div>

      <AppointmentDrawer
        appointment={selectedAppointment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        formatTime={formatTime}
        formatDateLong={formatDateLong}
      />
    </div>
  )
}
