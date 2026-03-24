import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { timeAsync } from '@/lib/perf'
import { OperationsClient, type AppointmentRow } from '@/components/dashboard/operations/OperationsClient'

export const metadata = { title: 'Operations Hub — Callendar' }

export default async function OperationsPage() {
  const supabase = await createClient()
  
  // 1. Safer User Retrieval
  const { data: authData } = await timeAsync('ops:get_user', () => supabase.auth.getUser())
  const user = authData?.user
  if (!user) redirect('/')

  // 2. Get Clinic ID
  const { data: clinicUser } = await timeAsync('ops:clinic_user', async () =>
    supabase
      .from('clinic_users')
      .select('clinic_config_id')
      .eq('user_id', user.id)
      .single()
  )

  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  // Explicitly tell TS this is a string so the queries below don't stay red
  const clinicId = clinicUser.clinic_config_id as string

  // 3. Parallel Data Fetch
  const [appointmentsRes, callsRes, statsRes] = await Promise.all([
    timeAsync('ops:appointments', async () =>
      supabase
        .from('appointments')
        .select('id, patient_name, phone, email, appointment_date, appointment_time, appointment_type, patient_status, status, projected_revenue, reminder_sent, created_at')
        .eq('clinic_id', clinicId) // MATCHES SCHEMA
        .order('appointment_date', { ascending: false })
        .limit(400)
    ),
    timeAsync('ops:call_logs', async () =>
      supabase
        .from('call_logs')
        .select('*')
        .eq('clinic_config_id', clinicId) // MATCHES SCHEMA
        .order('created_at', { ascending: false })
        .limit(100)
    ),
    timeAsync('ops:stats', async () =>
      supabase
        .from('credits')
        .select('total_credits_mins, minutes_used, balance')
        .eq('clinic_config_id', clinicId) // MATCHES SCHEMA
        .single()
    )
  ])

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#40E0FF]/10 rounded-lg border border-[#40E0FF]/20">
              <CalendarCheck className="size-5 text-[#40E0FF]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>
              Operations <span className="text-[#40E0FF]">Hub</span>
            </h1>
          </div>
          <p className="text-sm text-white/40 max-w-2xl">
            Bookings in one view with a live calendar. The calendar syncs in real time.
          </p>
        </div>
      </div>

      <OperationsClient
        clinicId={clinicId}
        initialAppointments={appointmentsRes.data ?? []}
        initialCalls={callsRes.data ?? []}
        stats={statsRes.data ?? null}
      />
    </div>
  )
}