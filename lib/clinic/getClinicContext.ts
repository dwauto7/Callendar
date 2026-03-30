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
  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select(
      `
        clinic_config_id,
        role,
        clinic_configs (
          clinic_name,
          is_active
        )
      `
    )
    .eq('user_id', userId)
    .maybeSingle()

  if (clinicUser?.clinic_config_id) {
    const clinicConfig = Array.isArray(clinicUser.clinic_configs)
      ? clinicUser.clinic_configs[0]
      : clinicUser.clinic_configs
    return {
      clinicConfigId: clinicUser.clinic_config_id as string,
      role: (clinicUser.role as ClinicRole) ?? null,
      clinicName: clinicConfig?.clinic_name ?? null,
      isActive: clinicConfig?.is_active ?? null,
      source: 'clinic_users',
    }
  }

  const { data: clinicConfig } = await supabase
    .from('clinic_configs')
    .select('id, clinic_name, is_active')
    .eq('user_id', userId)
    .maybeSingle()

  if (clinicConfig?.id) {
    return {
      clinicConfigId: clinicConfig.id as string,
      role: 'admin',
      clinicName: clinicConfig.clinic_name ?? null,
      isActive: clinicConfig.is_active ?? null,
      source: 'clinic_configs',
    }
  }

  return null
}
