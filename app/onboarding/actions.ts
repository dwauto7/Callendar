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

  console.log('✓ User authenticated:', user.id)

  // 1. Create clinic_configs
  const { data: clinicData, error: clinicErr } = await admin
    .from('clinic_configs')
    .insert({
      user_id:         user.id,
      clinic_name:     payload.clinic_name.trim(),
      clinic_whatsapp: payload.clinic_whatsapp.trim() || null,
      is_active:       true,
    })
    .select('id')
    .single()

  if (clinicErr || !clinicData) {
    console.error('✗ Clinic creation failed:', clinicErr)
    return { error: `Clinic creation failed: ${clinicErr?.message ?? 'Unknown error'}` }
  }

  const clinicId = clinicData.id
  console.log('✓ Clinic created:', clinicId)

  // 2. Link user to clinic (for multi-user support later)
  const { error: userErr } = await admin
    .from('clinic_users')
    .insert({
      clinic_config_id: clinicId,
      user_id:          user.id,
      role:             'owner',
    })

  if (userErr) {
    console.error('✗ clinic_users insert failed:', userErr)
    return { error: `User link failed: ${userErr.message}` }
  }
  console.log('✓ clinic_users inserted successfully')

  // 3. Save clinic settings (AI config + working hours)
  const { error: settingsErr } = await admin
    .from('clinic_settings')
    .insert({
      clinic_config_id:           clinicId,
      ai_name:                    payload.ai_name.trim(),
      ai_tone:                    payload.ai_tone,
      answering_mode:             payload.answering_mode,
      working_hours:              `${payload.working_hours_start}-${payload.working_hours_end}`,
      working_days:               payload.working_days.join(','),
      timezone:                   payload.timezone,
      whatsapp_reminders_enabled: payload.whatsapp_reminders_enabled,
      emergency_contact:          payload.emergency_contact.trim() || null,
    })

  if (settingsErr) {
    console.error('✗ Settings insert failed:', settingsErr)
    return { error: `Settings failed: ${settingsErr.message}` }
  }
  console.log('✓ clinic_settings inserted successfully')

  // 4. Seed monthly report
  try {
    await admin.rpc('refresh_monthly_report', { p_clinic_config_id: clinicId })
    console.log('✓ Monthly report seeded')
  } catch (e) {
    console.warn('⚠ Monthly report seeding failed:', e)
  }

  console.log('✓✓✓ ONBOARDING COMPLETE')
  return { error: null }
}