// app/auth/post-auth/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PostAuthPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: clinics, error } = await supabase
    .from('clinic_users')
    .select('clinic_config_id, role')
    .eq('user_id', user!.id)

  if (error) {
    console.error('PostAuth: Error fetching clinic memberships:', {
      code: error.code,
      message: error.message,
    })
    redirect('/?auth=error')
  }

  // No clinics → onboarding
  if (!clinics || clinics.length === 0) {
    redirect('/onboarding')
  }

  // Has valid clinic → dashboard
  const clinic = clinics[0]
  if (!clinic?.clinic_config_id) {
    redirect('/onboarding')
  }

  redirect('/dashboard/overview')
}