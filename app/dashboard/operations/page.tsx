import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { timeAsync } from '@/lib/perf'
import { OperationsClient } from '@/components/dashboard/operations/OperationsClient'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

export const metadata = { title: 'Operations — Callendar' }

export default async function OperationsPage() {
  const supabase = await createClient()
  
  // 1. Safer User Retrieval
  const { data: authData } = await timeAsync('ops:get_user', () => supabase.auth.getUser())
  const user = authData?.user
  if (!user) redirect('/')

  // 2. Get Clinic ID
  const clinicContext = await timeAsync('ops:clinic_user', async () =>
    getClinicContext(supabase, user.id)
  )

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const clinicId = clinicContext.clinicConfigId as string

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#40E0FF]/10 rounded-lg border border-[#40E0FF]/20">
              <CalendarCheck className="size-5 text-[#40E0FF]" />
            </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>
              Operations
          </h1>
          </div>
          <p className="text-sm text-white/40 max-w-2xl">
            Bookings in one view with a live calendar. The calendar syncs in real time.
          </p>
        </div>
      </div>

      <OperationsClient clinicId={clinicId} />
    </div>
  )
}
