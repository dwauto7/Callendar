import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createAdminClient()
    const {
      data: { user: sessionUser },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !sessionUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const clinic_user_id = body?.clinic_user_id as string | undefined
    if (!clinic_user_id) {
      return NextResponse.json({ error: 'clinic_user_id is required' }, { status: 400 })
    }

    const { data: caller } = await supabase
      .from('clinic_users')
      .select('clinic_config_id, role')
      .eq('user_id', sessionUser.id)
      .eq('is_active', true)
      .single()

    if (!caller || caller.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: target } = await supabase
      .from('clinic_users')
      .select('id, user_id')
      .eq('id', clinic_user_id)
      .eq('clinic_config_id', caller.clinic_config_id)
      .single()

    if (!target) {
      return NextResponse.json({ error: 'Staff row not found' }, { status: 404 })
    }
    if (target.user_id === sessionUser.id) {
      return NextResponse.json({ error: 'You cannot revoke yourself' }, { status: 400 })
    }

    const { error } = await supabase
      .from('clinic_users')
      .delete()
      .eq('id', clinic_user_id)
      .eq('clinic_config_id', caller.clinic_config_id)
      .is('user_id', null)
      .not('invite_token', 'is', null)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('revoke error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

