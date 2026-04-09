import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { DoctorProfileEditorClient } from '@/components/dashboard/doctors/DoctorProfileEditorClient'

export const metadata = { title: 'Profile — Callendar' }

type ClinicRole = 'admin' | 'doctor' | 'receptionist' | 'owner' | null

function normalizeRole(role: ClinicRole) {
  if (role === 'owner') return 'admin'
  return role ?? 'receptionist'
}

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('en-MY', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(time: string | null) {
  if (!time) return ''
  return time.slice(0, 5)
}

export default async function DoctorProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const role = normalizeRole(clinicContext.role)

  const { data: profile } = await supabase
    .from('clinic_profiles')
    .select('id, display_name, role, google_calendar_id, user_id, user_email, is_active')
    .eq('clinic_config_id', clinicContext.clinicConfigId)
    .eq('id', params.id)
    .maybeSingle()

  if (!profile) {
    redirect('/dashboard/doctors')
  }

  if (role === 'doctor' && profile.user_id !== user.id) {
    redirect('/dashboard/overview')
  }

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto space-y-6">
      <div className="rounded-xl border border-[#212129] bg-[#121216] p-5 space-y-2">
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
          {profile.display_name}
        </h1>
        <p className="text-xs text-white/30">Role: {profile.role ?? 'doctor'}</p>
        <p className="text-xs text-white/30">
          Calendar ID: {profile.google_calendar_id ?? 'Not linked'}
        </p>
      </div>

      <DoctorProfileEditorClient
        clinicConfigId={clinicContext.clinicConfigId}
        profile={{
          id: profile.id,
          display_name: profile.display_name,
          role: profile.role,
          google_calendar_id: profile.google_calendar_id,
          user_id: profile.user_id,
          user_email: profile.user_email,
        }}
        currentRole={role}
        currentUserId={user.id}
      />
    </div>
  )
}
