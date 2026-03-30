import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileNav } from '@/components/dashboard/MobileNav'
import { ClinicProvider } from '@/components/providers/ClinicProvider'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

// ─── Types ────────────────────────────────────────────────────────────────────

const VALID_ROLES = ['admin', 'doctor', 'receptionist', 'owner'] as const
type Role = typeof VALID_ROLES[number]

function resolveRole(raw: string): Role | null {
  return VALID_ROLES.includes(raw as Role) ? (raw as Role) : null
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Verify authenticated user (server-side — does NOT trust cookie alone)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/?auth=required')
  }

  // 2. Resolve clinic context (clinic_users first, fallback to clinic_configs)
  const clinicContext = await getClinicContext(supabase, user.id)

  // 3. Guard: no clinic = send to onboarding
  if (!clinicContext?.clinicConfigId) {
    redirect('/onboarding')
  }

  const clinicName = clinicContext.clinicName ?? 'Your Clinic'
  const role = resolveRole(clinicContext.role ?? 'owner')
  const userEmail = user.email ?? ''

  // 5. Render layout
  return (
    <div className="dashboard-amber min-h-screen bg-[#0B0D10] aurora-bg grain text-slate-200 selection:bg-[#40E0FF]/30 relative overflow-hidden">

      {/* ── Background: Dynamic Glow ── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#40E0FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#40E0FF]/3 rounded-full blur-[100px]" />
      </div>

      {/* ── Background: Subtle Grid ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(64,224,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,255,0.2) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* ── Background: Fog Band ── */}
      <div
        className="fixed -bottom-32 left-1/2 h-[420px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[120px] pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(64,224,255,0.25), rgba(14,165,233,0.12), rgba(64,224,255,0.25))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* ── Background: Vignette ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10">
        <ClinicProvider
          initialClinicConfigId={clinicContext.clinicConfigId}
          initialRole={role}
        >
          <Sidebar
            clinicName={clinicName}
            userEmail={userEmail}
          />

          <div className="lg:pl-[260px] pt-16 lg:pt-0 min-h-screen">
            <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
              {children}
            </main>
          </div>

          <MobileNav />
        </ClinicProvider>
      </div>

    </div>
  )
}
