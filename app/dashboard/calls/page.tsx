import { redirect } from 'next/navigation'
import { PhoneCall } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CallsClient } from '@/components/dashboard/calls/CallsClient'

export const metadata = { title: 'Call Logs — Callendar' }

export default async function CallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const { data: calls } = await supabase
    .from('call_logs')
    .select(
      'id, client_name, patient_phone, duration_min, aya_usage_cost_rm, minutes_saved, is_after_hours, appointment_id, created_at, recording_url'
    )
    .eq('clinic_config_id', clinicUser.clinic_config_id)
    .order('created_at', { ascending: false })
    .limit(500)

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <PhoneCall className="size-5 text-[#10B981]" />
          <h1
            className="text-2xl font-bold text-[#F1F5F9]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Call Logs
          </h1>
        </div>
        <p className="text-sm text-[#64748B]">
          Every call Aya handled — click a row to view transcript and recording.
        </p>
      </div>

      <CallsClient calls={calls ?? []} />
    </div>
  )
}
