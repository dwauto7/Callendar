import { redirect } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppointmentsClient } from '@/components/dashboard/appointments/AppointmentsClient'

export const metadata = { title: 'Patient Schedule — AI Blizzard' }

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

  // Note: Using 'clinic_id' to match your schema logic
  const { data: appointments } = await supabase
    .from('appointments')
    .select(
      'id, patient_name, phone, email, appointment_date, appointment_time, patient_status, status, appointment_confirmed, projected_revenue, reminder_sent, created_at'
    )
    .eq('clinic_id', clinicUser.clinic_config_id)
    .order('appointment_date', { ascending: false })
    .limit(300)

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {/* Cyan Glow Icon */}
          <div className="p-2 bg-[#40E0FF]/10 rounded-lg cyan-glow">
            <CalendarCheck className="size-5 text-[#40E0FF]" />
          </div>
          <h1
            className="text-3xl font-bold text-white tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Booking <span className="text-[#40E0FF]">Pipeline</span>
          </h1>
        </div>
        <p className="text-sm text-[#8B949E] max-w-2xl">
          Live feed of appointments secured by the Closer Agent. Data is synchronized with your clinic&apos;s primary calendar node.
        </p>
      </div>

      {/* Wrapping the client component in your signature glass panel */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 p-1">
         <AppointmentsClient appointments={appointments ?? []} />
      </div>
    </div>
  )
}
