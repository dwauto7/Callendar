import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ValidationResponse {
  valid?: boolean
  email?: string
  clinicId?: string
  role?: string
  expiresAt?: string
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ValidationResponse>> {
  console.log('🔍 validate-invite route hit')
  try {
    const body = await request.json()
    const { token } = body
    console.log('🔍 token received:', token)

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      console.log('🔍 token missing or invalid')
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const { data: invite, error: fetchError } = await supabase
      .from('clinic_users')
      .select('id, user_email, invite_expires_at, clinic_config_id, role')
      .eq('invite_token', token.trim())
      .is('user_id', null)
      .maybeSingle()

    console.log('🔍 invite data:', invite)
    console.log('🔍 fetch error:', fetchError)

    if (fetchError) {
      console.warn('🔍 returning 500 - fetch error')
      return NextResponse.json({ error: 'Failed to validate invite.' }, { status: 500 })
    }

    if (!invite) {
      console.log('🔍 returning 404 - no invite found')
      return NextResponse.json({ error: 'Invalid invite token' }, { status: 404 })
    }

    const expiresAt = new Date(invite.invite_expires_at as string)
    console.log('🔍 expiresAt:', expiresAt, 'now:', new Date())
    if (expiresAt < new Date()) {
      console.log('🔍 returning 410 - expired')
      return NextResponse.json({ error: 'Invite link has expired' }, { status: 410 })
    }

    console.log('🔍 returning success')
    return NextResponse.json({
      valid: true as const,
      email: invite.user_email ?? undefined,
      clinicId: invite.clinic_config_id ?? undefined,
      role: invite.role || 'staff',
      expiresAt: invite.invite_expires_at ?? undefined,
    })

  } catch (error) {
    console.error('🔍 catch block hit:', error)
    return NextResponse.json({ error: 'Failed to validate invite' }, { status: 500 })
  }
}