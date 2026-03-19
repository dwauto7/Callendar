import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No user logged in' }, { status: 401 })
  }

  // Get clinic_users
  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id, role')
    .eq('user_id', user.id)
    .single()

  if (!clinicUser) {
    return Response.json({ error: 'No clinic_users record found' }, { status: 404 })
  }

  const clinicId = clinicUser.clinic_config_id

  // Get clinic_config
  const { data: clinicConfig } = await supabase
    .from('clinic_configs')
    .select('clinic_name, is_active')
    .eq('id', clinicId)
    .single()

  // Count call_logs
  const { data: callLogs, count: callLogsCount } = await supabase
    .from('call_logs')
    .select('id', { count: 'exact' })
    .eq('clinic_config_id', clinicId)

  // Count appointments
  const { data: appointments, count: appointmentsCount } = await supabase
    .from('appointments')
    .select('id', { count: 'exact' })
    .eq('clinic_id', clinicId)

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    },
    clinic: {
      clinic_config_id: clinicId,
      role: clinicUser.role,
      clinic_name: clinicConfig?.clinic_name,
      is_active: clinicConfig?.is_active
    },
    data_counts: {
      call_logs: callLogsCount || 0,
      appointments: appointmentsCount || 0,
      sample_call_log: callLogs?.[0]
    }
  })
}
