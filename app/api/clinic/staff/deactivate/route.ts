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

    const { error } = await supabase
      .from('clinic_users')
      .update({ is_active: false })
      .eq('id', clinic_user_id)
      .eq('clinic_config_id', caller.clinic_config_id)
      .not('user_id', 'is', null)
      .neq('user_id', sessionUser.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const adminAuth = createAdminClient()
    const { data: targetUser } = await adminAuth
      .from('clinic_users')
      .select('user_id')
      .eq('id', clinic_user_id)
      .single()

    if (targetUser?.user_id) {
      await adminAuth.auth.admin.signOut(targetUser.user_id, 'others')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('deactivate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
