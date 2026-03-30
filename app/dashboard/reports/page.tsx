import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { ReportsContent } from '@/components/dashboard/reports/ReportsContent'

export const metadata = {
  title: 'Performance — Callendar',
}

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)
  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  return (
    <ReportsContent
      clinicConfigId={clinicContext.clinicConfigId}
      clinicName={clinicContext.clinicName ?? 'Partner'}
    />
  )
}