import { redirect } from 'next/navigation'
import { PhoneCall } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { timeAsync } from '@/lib/perf'
import { CallsClient } from '@/components/dashboard/calls/CallsClient'
import type { CallLogRow } from '@/components/dashboard/operations/TranscriptDrawer'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

export const metadata = { title: 'Voice Logs — Callendar' }

export default async function CallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const clinicId = clinicContext.clinicConfigId as string

  // Fetch call_logs directly to ensure data is retrieved
  const { data: callLogs, error: callLogsError } = await supabase
    .from('call_logs')
    .select('id, client_name, patient_phone, duration_min, minutes_saved, is_after_hours, appointment_id, aya_usage_cost_rm, created_at, clinic_config_id, summary, recording_url')
    .eq('clinic_config_id', clinicId)
    .order('created_at', { ascending: false })
    .limit(500)

  // Debug log
  console.log('CallsPage - callLogs count:', callLogs?.length ?? 0)
  console.log('CallsPage - callLogsError:', callLogsError)
  if (callLogs && callLogs.length > 0) {
    console.log('CallsPage - first call log:', callLogs[0])
  }

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <PhoneCall className="size-5 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>
          Voice Logs ({callLogs?.length ?? 0})
        </h1>
        {callLogsError && (
          <p className="text-red-500 text-sm ml-auto">(Error: {callLogsError.message})</p>
        )}
      </div>

      <CallsClient initialCalls={(callLogs as any) ?? []} />
    </div>
  )
}
