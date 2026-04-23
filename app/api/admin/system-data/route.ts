import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getConfiguredAdminEmails, isAllowedAdminEmail } from '@/lib/auth/adminAccess'

type DeleteTarget = 'clinic' | 'user' | 'appointment'
type UpdateTarget = 'user'

async function getAuthorizedUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing access token', status: 401 as const }
  }

  const token = authHeader.slice(7)
  const supabase = createAdminClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { error: 'Invalid access token', status: 401 as const }
  }

  if (!isAllowedAdminEmail(user.email)) {
    return { error: 'This account is not a website admin', status: 403 as const }
  }

  return { user, supabase }
}

export async function GET(request: Request) {
  const auth = await getAuthorizedUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { supabase } = auth

  const [clinicsRes, usersRes, appointmentsRes, auditLogsRes] = await Promise.all([
    supabase
      .from('clinic_configs')
      .select('id, clinic_name, owner_email, plan_type, is_active, clinic_phone, clinic_address, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('clinic_users')
      .select('id, user_email, role, is_active, created_at, last_login_at, clinic_config_id, clinic_config:clinic_config_id(clinic_name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('appointments')
      .select('id, patient_name, appointment_date, appointment_time, status, service_category, clinic_id, created_at, clinic:clinic_id(clinic_name)')
      .order('appointment_date', { ascending: false }),
    supabase
      .from('admin_audit_logs')
      .select('id, admin_id, action, resource_id, clinic_config_id, details, created_at')
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  if (clinicsRes.error || usersRes.error || appointmentsRes.error || auditLogsRes.error) {
    return NextResponse.json(
      {
        error:
          clinicsRes.error?.message ??
          usersRes.error?.message ??
          appointmentsRes.error?.message ??
          auditLogsRes.error?.message ??
          'Failed to fetch admin data',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    clinics: clinicsRes.data ?? [],
    users: usersRes.data ?? [],
    appointments: appointmentsRes.data ?? [],
    auditLogs: auditLogsRes.data ?? [],
    meta: {
      admin_emails_configured: getConfiguredAdminEmails().length,
    },
  })
}

async function writeAuditLog(
  supabase: ReturnType<typeof createAdminClient>,
  adminId: string,
  action: string,
  resourceId: string,
  clinicConfigId: string | null,
  details: Record<string, unknown>
) {
  if (!clinicConfigId) return
  await supabase.from('admin_audit_logs').insert({
    admin_id: adminId,
    clinic_config_id: clinicConfigId,
    action,
    resource_id: resourceId,
    details,
  })
}

export async function PATCH(request: Request) {
  const auth = await getAuthorizedUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { user, supabase } = auth
  const body = await request.json().catch(() => null)
  const target = body?.target as UpdateTarget | undefined
  const id = body?.id as string | undefined
  const updates = body?.updates as Record<string, unknown> | undefined

  if (!target || !id || !updates || typeof updates !== 'object') {
    return NextResponse.json({ error: 'target, id, and updates are required' }, { status: 400 })
  }

  if (target !== 'user') {
    return NextResponse.json({ error: 'Unsupported update target' }, { status: 400 })
  }

  const allowedKeys = ['role', 'is_active']
  const payload = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedKeys.includes(key))
  )

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: currentRow } = await supabase
    .from('clinic_users')
    .select('id, clinic_config_id, user_email, role, is_active')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('clinic_users')
    .update(payload)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const action =
    typeof payload.role === 'string'
      ? 'update_user_role'
      : 'update_user_status'

  await writeAuditLog(supabase, user.id, action, id, currentRow?.clinic_config_id ?? null, {
    admin_email: user.email ?? null,
    user_email: currentRow?.user_email ?? null,
    previous_role: currentRow?.role ?? null,
    previous_is_active: currentRow?.is_active ?? null,
    updates: payload,
    scope: 'system',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const auth = await getAuthorizedUser(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { user, supabase } = auth
  const body = await request.json().catch(() => null)
  const target = body?.target as DeleteTarget | undefined
  const id = body?.id as string | undefined

  if (!target || !id) {
    return NextResponse.json({ error: 'target and id are required' }, { status: 400 })
  }

  if (target === 'clinic') {
    const { data: row } = await supabase
      .from('clinic_configs')
      .select('id, clinic_name')
      .eq('id', id)
      .maybeSingle()

    const { error } = await supabase.from('clinic_configs').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await writeAuditLog(supabase, user.id, 'delete_clinic', id, id, {
      admin_email: user.email ?? null,
      clinic_name: row?.clinic_name ?? null,
      scope: 'system',
    })
    return NextResponse.json({ ok: true })
  }

  if (target === 'user') {
    const { data: row } = await supabase
      .from('clinic_users')
      .select('id, user_email, role, clinic_config_id')
      .eq('id', id)
      .maybeSingle()

    const { error } = await supabase.from('clinic_users').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await writeAuditLog(supabase, user.id, 'delete_user', id, row?.clinic_config_id ?? null, {
      admin_email: user.email ?? null,
      user_email: row?.user_email ?? null,
      role: row?.role ?? null,
      scope: 'system',
    })
    return NextResponse.json({ ok: true })
  }

  const { data: row } = await supabase
    .from('appointments')
    .select('id, patient_name, clinic_id')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await writeAuditLog(supabase, user.id, 'delete_appointment', id, row?.clinic_id ?? null, {
    admin_email: user.email ?? null,
    patient_name: row?.patient_name ?? null,
    scope: 'system',
  })

  return NextResponse.json({ ok: true })
}
