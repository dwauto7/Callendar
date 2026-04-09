import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DoctorProfileClient } from '@/components/dashboard/profiles/DoctorProfileClient'

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default async function DoctorProfilePage({ params }: { params: { doctorId: string } }) {
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('clinic_profiles')
    .select('*, clinic_configs(clinic_name)')
    .eq('id', params.doctorId)
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

  const { data: stats } = await supabase.rpc('get_doctor_stats', { p_doctor_id: params.doctorId })
  const { data: nextAppointment } = await supabase.rpc('get_next_appointment', { p_doctor_id: params.doctorId })

  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() + diffToMonday)
  const thirtyDaysAhead = new Date(now)
  thirtyDaysAhead.setDate(now.getDate() + 30)

  const startOfWeekKey = toDateKey(startOfWeek)
  const thirtyDaysAheadKey = toDateKey(thirtyDaysAhead)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, patient_name, phone, email, appointment_date, appointment_time, appointment_type, service_category, status, appointment_confirmed')
    .eq('doctor_profile_id', params.doctorId)
    .gte('appointment_date', startOfWeekKey)
    .lte('appointment_date', thirtyDaysAheadKey)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  return (
    <DoctorProfileClient
      doctor={profile}
      stats={stats ?? { today: 0, week: 0, month: 0, completion_rate: 0 }}
      nextAppointment={nextAppointment ?? null}
      appointments={appointments ?? []}
    />
  )
}
