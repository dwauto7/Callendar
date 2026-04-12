import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DoctorProfileClient } from '@/components/dashboard/profiles/DoctorProfileClient'
import type { DoctorStats, NextAppointment } from '@/components/dashboard/profiles/DoctorProfileClient'
import Link from 'next/link'

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('clinic_profiles')
    .select('*, clinic_configs(clinic_name)')
    .eq('id', doctorId)
    .single()

  if (profileError) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-6 text-red-400">
          <p className="font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
            Error loading doctor profile
          </p>
          <p className="text-sm text-red-400/70 mt-1">{profileError.message}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
        <div className="bg-[#121216] border border-[#212129] rounded-2xl p-6 text-red-400">
          <p className="font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
            Doctor profile not found
          </p>
          <p className="text-sm text-red-400/70 mt-1">Please check the profile ID and try again.</p>
        </div>
      </div>
    )
  }

const [{ data: stats }, { data: nextAppointment }] = await Promise.all([
  supabase.rpc('get_doctor_stats', { p_doctor_id: doctorId }),
  supabase.rpc('get_next_appointment', { p_doctor_id: doctorId }),
]) as [
  { data: DoctorStats | null; error: any },
  { data: NextAppointment | null; error: any }
]

  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const todayKey = toDateKey(now)
  const fourteenDaysAhead = new Date(now)
  fourteenDaysAhead.setDate(now.getDate() + 14)
  const fourteenDaysKey = toDateKey(fourteenDaysAhead)


  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, patient_name, phone, email, appointment_date, appointment_time, appointment_type, service_category, status, appointment_confirmed')
    .eq('doctor_profile_id', doctorId)
    .gte('appointment_date', todayKey)
    .lte('appointment_date', fourteenDaysKey)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  const typedAppointments = (appointments ?? []).map(a => ({...a, status: a.status as 'Booked' | 'Cancelled' | 'Completed' | 'No Show' | null }))

  return (
    <DoctorProfileClient
      doctor={profile}
      stats={stats ?? { today: 0, week: 0, month: 0, completion_rate: 0 }}
      nextAppointment={nextAppointment ?? null}
      appointments={typedAppointments ?? []}
    />
  )
}
