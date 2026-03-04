import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileNav } from '@/components/dashboard/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('[layout] user:', user?.email ?? 'NO USER')

  if (!user) {
    redirect('/?auth=required')
  }

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()

  if (!clinicUser?.clinic_config_id) {
    redirect('/onboarding')
  }

  const { data: clinicConfig } = await supabase
    .from('clinic_config')
    .select('clinic_name')
    .eq('id', clinicUser.clinic_config_id)
    .single()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar
        clinicName={clinicConfig?.clinic_name ?? 'Your Clinic'}
        userEmail={user.email ?? ''}
      />

      {/* Content area: offset for sidebar on desktop, top bar on mobile */}
      <div className="lg:pl-[240px] pt-14 lg:pt-0">
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
