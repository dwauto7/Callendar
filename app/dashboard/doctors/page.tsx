import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { Button } from '@/components/ui/button'
import { canViewDashboardPage, getRolePermissions, normalizeClinicRole } from '@/lib/auth/permissions'

export const metadata = { title: 'Profiles — Callendar' }

export default async function DoctorsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const role = normalizeClinicRole(clinicContext.role)
  const permissions = getRolePermissions(clinicContext.role)
  if (!canViewDashboardPage(clinicContext.role, 'doctors') || !permissions.canView) {
    redirect('/dashboard/overview')
  }

  if (role === 'doctor') {
    const { data: myProfile } = await supabase
      .from('clinic_profiles')
      .select('id')
      .eq('clinic_config_id', clinicContext.clinicConfigId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (myProfile?.id) {
      redirect(`/dashboard/doctors/${myProfile.id}`)
    }
  }

  const { data: profiles } = await supabase
    .from('clinic_profiles')
    .select('id, display_name, role, google_calendar_id, is_active, created_at')
    .eq('clinic_config_id', clinicContext.clinicConfigId)
    .order('created_at', { ascending: true })

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
          {clinicContext.clinicName ?? 'Your Clinic'}
        </p>
        <h1 className="text-3xl font-semibold text-white tracking-tighter mt-2" style={{ fontFamily: 'var(--font-syne)' }}>
          Profiles
        </h1>
        <p className="text-sm text-white/40 mt-2">
          Manage doctor calendars and view appointments by provider.
        </p>
      </div>

      {role === 'admin' && (
        <div className="flex justify-end">
          <Button
            asChild
            className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white font-semibold"
          >
            <Link href="/dashboard/doctors/new">Add Profile</Link>
          </Button>
        </div>
      )}

      {profiles && profiles.length > 0 ? (
        <div className="rounded-xl border border-[#212129] bg-[#121216] overflow-hidden">
          <div className="divide-y divide-[#1E2128]">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/dashboard/doctors/${profile.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[#161B22] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile.display_name}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Role: {profile.role ?? 'doctor'}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-white bg-[#2DD4BF] px-2.5 py-1 rounded-full">
                  {profile.google_calendar_id ? 'Calendar Linked' : 'No Calendar'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#212129] bg-[#121216] p-6 text-sm text-white/30">
          No doctor profiles found yet.
        </div>
      )}
    </div>
  )
}

