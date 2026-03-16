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

  // 1. Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/?auth=required')
  }

  // 2. Get the clinic link for this user
  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()

  // If they don't have a clinic yet, send them to onboarding
  if (!clinicUser?.clinic_config_id) {
    redirect('/onboarding')
  }

  // 3. Get the actual clinic name for the Sidebar
  const { data: clinicConfig } = await supabase
    .from('clinic_configs')
    .select('clinic_name')
    .eq('id', clinicUser.clinic_config_id)
    .single()

  // 4. Return the UI (Single Return Statement)
  return (
    <div className="min-h-screen bg-[#0B0D10] aurora-bg grain text-slate-200 selection:bg-[#40E0FF]/30 relative overflow-hidden">
      {/* Dynamic Background Glow - keeps the AI Blizzard aesthetic consistent */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#40E0FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#40E0FF]/3 rounded-full blur-[100px]" />
      </div>
      {/* Subtle grid overlay for structure */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(64,224,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,255,0.2) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />
      {/* Soft moving fog band */}
      <div
        className="fixed -bottom-32 left-1/2 h-[420px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[120px] pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(64,224,255,0.25), rgba(14,165,233,0.12), rgba(64,224,255,0.25))',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 20s ease infinite',
        }}
      />
      {/* Subtle vignette to frame content */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="relative z-10">
        <Sidebar
          clinicName={clinicConfig?.clinic_name ?? 'Your Clinic'}
          userEmail={user.email ?? ''}
        />

        {/* Content area */}
        <div className="lg:pl-[260px] pt-16 lg:pt-0 min-h-screen">
          <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    </div>
  )
}
