import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { DoctorProfileNewForm } from '@/components/dashboard/doctors/DoctorProfileNewForm'

export const metadata = { title: 'New Profile — Callendar' }

type ClinicRole = 'admin' | 'doctor' | 'receptionist' | 'owner' | null

function normalizeRole(role: ClinicRole) {
  if (role === 'owner') return 'admin'
  return role ?? 'receptionist'
}

export default async function NewDoctorProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const role = normalizeRole(clinicContext.role)
  if (role !== 'admin') redirect('/dashboard/doctors')

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>
          New Profile
        </h1>
        <p className="text-sm text-white/40 mt-2">
          Create a profile and link a Google Calendar ID for routing.
        </p>
      </div>

      <DoctorProfileNewForm clinicConfigId={clinicContext.clinicConfigId} />
    </div>
  )
}
