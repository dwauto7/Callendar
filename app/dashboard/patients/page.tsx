import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PatientsClient } from './PatientsClient'

export const metadata = { title: 'Patients — Callendar' }

type PatientRow = {
  id: string
  name: string | null
  phone: string | null
  last_visit: string | null
  last_appointment_type: string | null
  total_visits: number | null
  created_at: string
  last_doctor: {
    display_name: string | null
  } | null
}

type LatestAppt = {
  phone: string | null
  status: string | null
  appointment_date: string | null
  appointment_type: string | null
}

export default async function PatientsPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single()

  if (!clinicUser) redirect('/login')
  const clinicConfigId = clinicUser.clinic_config_id

  const { data: patientsData, error: patientsError } = await supabase
    .from('patients')
    .select(`
      id,
      name,
      phone,
      last_visit,
      last_appointment_type,
      total_visits,
      created_at,
      last_doctor:clinic_profiles!last_doctor_id (
        display_name
      )
    `)
    .eq('clinic_id', clinicConfigId)
    .order('created_at', { ascending: false })

  if (patientsError) {
    console.error('Patients query error:', patientsError)
  }

  const patients = (patientsData ?? []) as unknown as PatientRow[]
  const phones = patients.map((p) => p.phone).filter((v): v is string => Boolean(v))

  let apptMap: Record<string, LatestAppt> = {}
  if (phones.length > 0) {
    const { data: recentAppts, error: apptError } = await supabase
      .from('appointments')
      .select('phone, status, appointment_date, appointment_type')
      .eq('clinic_id', clinicConfigId)
      .in('phone', phones)
      .order('appointment_date', { ascending: false })

    if (apptError) {
      console.error('Recent appointments query error:', apptError)
    }

    apptMap = {}
    recentAppts?.forEach((a) => {
      if (!a.phone) return
      if (!apptMap[a.phone]) apptMap[a.phone] = a
    })
  }

  const errorMessage = patientsError ? 'Could not load some patient data. Showing what is available.' : null
  const totalCountLabel = `${patients.length} patient${patients.length === 1 ? '' : 's'}`

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
      <div className="relative mb-8 rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
              <Users className="size-5 text-[#2DD4BF]" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-semibold tracking-tight leading-none text-white"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Patients
            </h1>
          </div>
          <p className="text-sm md:text-base uppercase tracking-tight text-white/30 max-w-2xl" style={{ fontFamily: 'var(--font-syne)' }}>
            {totalCountLabel}
          </p>
        </div>
      </div>
      <PatientsClient patients={patients} apptMap={apptMap} errorMessage={errorMessage} />
    </div>
  )
}
