import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClinicContext } from '@/lib/clinic/getClinicContext'
import { canViewDashboardPage, getRolePermissions } from '@/lib/auth/permissions'

export const metadata = { title: 'Debug - Callendar' }

export default async function DebugPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8 text-red-500">No user logged in</div>
  }

  // Get clinic context
  const clinicContext = await getClinicContext(supabase, user.id)

  if (!clinicContext) {
    return <div className="p-8 text-red-500">No clinic record found</div>
  }
  const permissions = getRolePermissions(clinicContext.role)
  if (!canViewDashboardPage(clinicContext.role, 'debug') || !permissions.canView) {
    redirect('/dashboard/overview')
  }

  const clinicId = clinicContext.clinicConfigId

  // Get clinic_config
  const { data: clinicConfig } = await supabase
    .from('clinic_configs')
    .select('*')
    .eq('id', clinicId)
    .single()

  // Count call_logs
  const { data: callLogs, count: callLogsCount } = await supabase
    .from('call_logs')
    .select('id', { count: 'exact' })
    .eq('clinic_config_id', clinicId)

  // Get sample call log
  const { data: sampleCallLog } = await supabase
    .from('call_logs')
    .select('*')
    .eq('clinic_config_id', clinicId)
    .limit(1)
    .single()

  // Count appointments
  const { data: appointments, count: appointmentsCount } = await supabase
    .from('appointments')
    .select('id', { count: 'exact' })
    .eq('clinic_id', clinicId)

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold text-white">Debug Info</h1>

      <div className="bg-[#121216] border border-[#212129] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[#2DD4BF]">User</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-white/40">ID:</span> <code className="text-white">{user.id}</code></p>
          <p><span className="text-white/40">Email:</span> <code className="text-white">{user.email}</code></p>
        </div>
      </div>

      <div className="bg-[#121216] border border-[#212129] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[#2DD4BF]">Clinic Info</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-white/40">Clinic Config ID:</span> <code className="text-white">{clinicId}</code></p>
          <p><span className="text-white/40">Role:</span> <code className="text-white">{clinicContext.role}</code></p>
          <p><span className="text-white/40">Clinic Name:</span> <code className="text-white">{clinicConfig?.clinic_name || 'N/A'}</code></p>
          <p><span className="text-white/40">Is Active:</span> <code className={`${clinicConfig?.is_active ? 'text-[#2DD4BF]' : 'text-red-400'}`}>{String(clinicConfig?.is_active)}</code></p>
        </div>
      </div>

      <div className="bg-[#121216] border border-[#212129] rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[#2DD4BF]">Data Counts</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-white/40">Call Logs:</span> <code className="text-[#2DD4BF] font-semibold">{callLogsCount || 0}</code></p>
          <p><span className="text-white/40">Appointments:</span> <code className="text-[#2DD4BF] font-semibold">{appointmentsCount || 0}</code></p>
        </div>
      </div>

      {sampleCallLog && (
        <div className="bg-[#121216] border border-[#212129] rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[#2DD4BF]">Sample Call Log</h2>
          <pre className="bg-black/50 p-4 rounded text-xs text-green-400 overflow-auto">
            {JSON.stringify(sampleCallLog, null, 2)}
          </pre>
        </div>
      )}

      {clinicConfig && (
        <div className="bg-[#121216] border border-[#212129] rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[#2DD4BF]">Full Clinic Config</h2>
          <pre className="bg-black/50 p-4 rounded text-xs text-green-400 overflow-auto">
            {JSON.stringify(clinicConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

