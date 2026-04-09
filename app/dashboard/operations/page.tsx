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
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
      <div className="relative mb-8 rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
              <CalendarCheck className="size-5 text-[#2DD4BF]" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-semibold tracking-tight leading-none text-white"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Operations
            </h1>
          </div>
          <p className="text-sm md:text-base uppercase tracking-tight text-white/30 max-w-2xl" style={{ fontFamily: 'var(--font-syne)' }}>
            Bookings in one view with a live calendar. The calendar syncs in real time.
          </p>
        </div>
      </div>

      <OperationsClient clinicId={clinicId} />
    </div>
  )
}
