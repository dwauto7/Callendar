export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PostAuthPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: clinics, error } = await supabase
    .from('clinic_users')
    .select('clinic_config_id, role')
    .eq('user_id', user.id)

  if (error) {
    console.error('PostAuth: Error fetching clinic memberships:', error)
    redirect('/?auth=error')
  }

  if (!clinics || clinics.length === 0) redirect('/onboarding')

  const clinic = clinics[0]
  if (!clinic?.clinic_config_id) redirect('/onboarding')

  if (clinic.role === 'doctor') {
    const { data: myProfile } = await supabase
      .from('clinic_profiles')
      .select('id')
      .eq('clinic_config_id', clinic.clinic_config_id)  
      .eq('user_id', user.id)
      .maybeSingle()

    if (myProfile?.id) redirect(`/dashboard/doctors/${myProfile.id}`)
  }

  redirect('/dashboard/overview')  // ← must be inside the function
}