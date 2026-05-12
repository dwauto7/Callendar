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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Session expired. Please log in again.' }

  const isDuplicateError = (err: { code?: string; message?: string } | null | undefined) =>
    err?.code === '23505' || (err?.message ?? '').toLowerCase().includes('duplicate')

  // Fast exit for retries: user is already linked to a clinic.
  const { data: existingMembership } = await admin
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .limit(1)

  if (existingMembership && existingMembership.length > 0) {
    return { error: null }
  }

  // Reuse existing clinic created by a concurrent request, otherwise create.
  const { data: existingClinic } = await admin
    .from('clinic_configs')
    .select('id')
    .eq('user_id', user.id)
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()

  let clinicId = existingClinic?.id ?? null

  if (!clinicId) {
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

    if (clinicErr && !isDuplicateError(clinicErr)) {
      return { error: `Clinic creation failed: ${clinicErr.message}` }
    }

    if (clinicData?.id) {
      clinicId = clinicData.id
    } else {
      const { data: recoveredClinic, error: recoverErr } = await admin
        .from('clinic_configs')
        .select('id')
        .eq('user_id', user.id)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (recoverErr || !recoveredClinic?.id) {
        return {
          error: `Clinic creation failed: ${recoverErr?.message ?? clinicErr?.message ?? 'Unable to resolve clinic record.'}`,
        }
      }

      clinicId = recoveredClinic.id
    }
  }

  // Link owner safely even if a trigger already inserted this row.
  const { error: userErr } = await admin.from('clinic_users').insert({
    clinic_config_id: clinicId,
    user_id: user.id,
    user_email: user.email ?? null,
    role: 'owner',
    is_active: true,
  })

  if (userErr && !isDuplicateError(userErr)) {
    return { error: `User link failed: ${userErr.message}` }
  }

  const settingsPayload = {
    clinic_config_id: clinicId,
    ai_name: payload.ai_name.trim(),
    ai_tone: payload.ai_tone,
    answering_mode: payload.answering_mode,
    working_hours: `${payload.working_hours_start}-${payload.working_hours_end}`,
    working_days: payload.working_days.join(','),
    timezone: payload.timezone,
    whatsapp_reminders_enabled: payload.whatsapp_reminders_enabled,
    emergency_contact: payload.emergency_contact.trim() || null,
  }

  // Settings should be idempotent too: update on retries, insert on first run.
  const { data: existingSettings } = await admin
    .from('clinic_settings')
    .select('id')
    .eq('clinic_config_id', clinicId)
    .maybeSingle()

  const { error: settingsErr } = existingSettings?.id
    ? await admin.from('clinic_settings').update(settingsPayload).eq('clinic_config_id', clinicId)
    : await admin.from('clinic_settings').insert(settingsPayload)

  if (settingsErr && !isDuplicateError(settingsErr)) {
    return { error: `Settings failed: ${settingsErr.message}` }
  }

  // Seed report (non-blocking).
  try {
    await admin.rpc('refresh_monthly_report', {
      p_clinic_config_id: clinicId,
    })
  } catch (e) {
    console.warn('Report seed failed:', e)
  }

  return { error: null }
}
