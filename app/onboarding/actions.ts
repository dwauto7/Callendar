'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type OnboardingPayload = {
  clinic_name: string
  clinic_whatsapp: string
  ai_name: string
  ai_tone: string
  answering_mode: 'always_on' | 'after_hours' | 'disabled'
  working_hours_start: string
  working_hours_end: string
  working_days: string[]
  timezone: string
  whatsapp_reminders_enabled: boolean
  emergency_contact: string
}

export async function submitOnboarding(payload: OnboardingPayload) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Session expired. Please log in again.' }

  // 🚫 Prevent duplicate onboarding
  const { data: existing } = await admin
    .from('clinic_users')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'User already onboarded.' }
  }

  // 1. Create clinic
  const { data: clinicData, error: clinicErr } = await admin
    .from('clinic_configs')
    .insert({
      user_id: user.id,
      clinic_name: payload.clinic_name.trim(),
      clinic_whatsapp: payload.clinic_whatsapp.trim() || null,
      is_active: true,
    })
    .select('id')
    .single()

  if (clinicErr || !clinicData) {
    return { error: `Clinic creation failed: ${clinicErr?.message}` }
  }

  const clinicId = clinicData.id

  // 2. Link owner
  const { error: userErr } = await admin
    .from('clinic_users')
    .insert({
      clinic_config_id: clinicId,
      user_id: user.id,
      role: 'owner',
    })

  if (userErr) {
    return { error: `User link failed: ${userErr.message}` }
  }

  // 3. Settings
  const { error: settingsErr } = await admin
    .from('clinic_settings')
    .insert({
      clinic_config_id: clinicId,
      ai_name: payload.ai_name.trim(),
      ai_tone: payload.ai_tone,
      answering_mode: payload.answering_mode,
      working_hours: `${payload.working_hours_start}-${payload.working_hours_end}`,
      working_days: payload.working_days.join(','),
      timezone: payload.timezone,
      whatsapp_reminders_enabled: payload.whatsapp_reminders_enabled,
      emergency_contact: payload.emergency_contact.trim() || null,
    })

  if (settingsErr) {
    return { error: `Settings failed: ${settingsErr.message}` }
  }

  // 4. Seed report (non-blocking)
  try {
    await admin.rpc('refresh_monthly_report', {
      p_clinic_config_id: clinicId,
    })
  } catch (e) {
    console.warn('Report seed failed:', e)
  }

  return { error: null }
}