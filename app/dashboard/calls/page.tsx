import { redirect } from 'next/navigation'
import { PhoneCall } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CallsClient, type CallLogRow } from '@/components/dashboard/calls/CallsClient'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { canViewDashboardPage, getRolePermissions } from '@/lib/auth/permissions'

export const metadata = { title: 'Voice Logs — Callendar' }

export default async function CallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')
  const permissions = getRolePermissions(clinicContext.role)
  if (!canViewDashboardPage(clinicContext.role, 'calls') || !permissions.canView) {
    redirect('/dashboard/overview')
  }

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
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto">
      <div className="relative mb-8 rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden flex items-center gap-3">
        <div className="p-3 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
          <PhoneCall className="size-5 text-[#2DD4BF]" />
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold tracking-tight leading-none text-white tabular-nums"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Voice Logs ({callLogs?.length ?? 0})
        </h1>
        {callLogsError && (
          <p className="text-red-400 text-sm font-semibold ml-auto">(Error: {callLogsError.message})</p>
        )}
      </div>

      <CallsClient initialCalls={(callLogs as CallLogRow[]) ?? []} />
    </div>
  )
}
