import type { SupabaseClient } from '@supabase/supabase-js'

type ClinicRole = 'admin' | 'doctor' | 'receptionist' | 'owner' | null

export type ClinicContext = {
  clinicConfigId: string
  role: ClinicRole
  clinicName: string | null
  isActive: boolean | null
  source: 'clinic_users' | 'clinic_configs'
}

export async function getClinicContext(
  supabase: SupabaseClient,
  userId: string
): Promise<ClinicContext | null> {
  // 1. Get clinic_user record by user_id
  const { data: clinicUser, error: clinicUserError } = await supabase
    .from('clinic_users')
    .select('clinic_config_id, role')
    .eq('user_id', userId)
    .maybeSingle()

  if (clinicUserError) {
    console.error('getClinicContext: Error fetching clinic_user:', {
      code:    clinicUserError.code,
      message: clinicUserError.message,
      details: clinicUserError.details,
      hint:    clinicUserError.hint,
    })
    // Throw so layout.tsx catch block can redirect cleanly
    throw new Error(`clinic_users query failed: ${clinicUserError.message}`)
  }

  // No row = user hasn't completed onboarding yet
  if (!clinicUser?.clinic_config_id) {
    return null
  }

  // 2. Fetch the linked clinic config
  const { data: clinicConfig, error: configError } = await supabase
    .from('clinic_configs')
    .select('id, clinic_name, is_active')
    .eq('id', clinicUser.clinic_config_id)
    .maybeSingle()

  if (configError) {
    console.error('getClinicContext: Error fetching clinic_config:', {
      code:    configError.code,
      message: configError.message,
      details: configError.details,
      hint:    configError.hint,
    })
    throw new Error(`clinic_configs query failed: ${configError.message}`)
  }

  return {
    clinicConfigId: clinicUser.clinic_config_id as string,
    role:           (clinicUser.role as ClinicRole) ?? null,
    clinicName:     clinicConfig?.clinic_name ?? null,
    isActive:       clinicConfig?.is_active ?? null,
    source:         'clinic_users',
  }
}