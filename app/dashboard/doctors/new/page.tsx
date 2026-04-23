import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { DoctorProfileNewForm } from '@/components/dashboard/doctors/DoctorProfileNewForm'
import { canViewDashboardPage, getRolePermissions, normalizeClinicRole } from '@/lib/auth/permissions'

export const metadata = { title: 'New Profile — Callendar' }

export default async function NewDoctorProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const role = normalizeClinicRole(clinicContext.role)
  const permissions = getRolePermissions(clinicContext.role)
  if (!canViewDashboardPage(clinicContext.role, 'doctor-new') || !permissions.canView || !permissions.canEdit) {
    redirect('/dashboard/doctors')
  }
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
