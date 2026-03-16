import { redirect } from 'next/navigation'
import { PhoneCall } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CallsClient } from '@/components/dashboard/calls/CallsClient'

export const metadata = { title: 'Call Intelligence — AI Blizzard' }

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
    .select(`
      id, 
      client_name, 
      patient_phone, 
      duration_min, 
      minutes_saved, 
      is_after_hours, 
      appointment_id, 
      clinic_config_id,
      summary,
      created_at, 
      recording_url
    `)
    .eq('clinic_config_id', clinicUser.clinic_config_id)
    .order('created_at', { ascending: false })
    .limit(500)

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#40E0FF]/10 rounded-lg border border-[#40E0FF]/20">
            <PhoneCall className="size-5 text-[#40E0FF]" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>
            Call <span className="text-[#40E0FF]">Intelligence</span>
          </h1>
        </div>
        <p className="text-sm text-white/40">
          Historical data handled by the Aya Node. Recordings are stored for 30 days.
        </p>
      </div>

      {/* Passing the data as 'initialCalls' to match the component */}
      <CallsClient initialCalls={calls || []} />
    </div>
  )
}
