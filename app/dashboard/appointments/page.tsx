import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppointmentsClient } from '@/components/dashboard/appointments/AppointmentsClient'

export const metadata = { title: 'Appointments — Callendar' }

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  // appointments uses `clinic_id` (not clinic_config_id) per schema
  const { data: appointments } = await supabase
    .from('appointments')
    .select(
      'id, patient_name, phone, email, appointment_date, appointment_time, patient_status, status, appointment_confirmed, projected_revenue, reminder_sent, created_at'
    )
    .eq('clinic_id', clinicUser.clinic_config_id)
    .order('appointment_date', { ascending: false })
    .limit(300)

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarCheck className="size-5 text-[#10B981]" />
          <h1
            className="text-2xl font-bold text-[#F1F5F9]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Appointments
          </h1>
        </div>
        <p className="text-sm text-[#64748B]">
          All appointments booked by Aya — filter by status, date, or confirmation.
        </p>
      </div>

      <AppointmentsClient appointments={appointments ?? []} />
    </div>
  )
}
