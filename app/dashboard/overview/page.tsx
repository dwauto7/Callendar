import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OverviewContent } from '@/components/dashboard/OverviewContent'
import { timeAsync } from '@/lib/perf'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

export const metadata = {
  title: 'Overview — Callendar',
}

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await timeAsync('overview:get_user', async () => supabase.auth.getUser())
  if (!user) redirect('/')

  const clinicContext = await timeAsync('overview:clinic_user', async () =>
    getClinicContext(supabase, user.id)
  )

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const clinicName = clinicContext.clinicName ?? 'Partner'
  const isActive: boolean = clinicContext.isActive ?? false
  const id = clinicContext.clinicConfigId

  // Fetch answering_mode on server side (fast, only once)
  const { data: settingsData } = await timeAsync('overview:settings', async () =>
    supabase
      .from('clinic_settings')
      .select('answering_mode')
      .eq('clinic_config_id', id)
      .single()
  )

  const rawMode = settingsData?.answering_mode ?? 'disabled'
  const answeringMode: 'always_on' | 'after_hours' | 'disabled' =
    rawMode === 'always_on' || rawMode === 'after_hours' ? rawMode : 'disabled'

  return (
    <OverviewContent
      clinicName={clinicName}
      isActive={isActive}
      clinicConfigId={id}
      answeringMode={answeringMode}
    />
  )
}
