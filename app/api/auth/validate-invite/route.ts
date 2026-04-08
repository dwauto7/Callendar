import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface InviteRecord {
  id: string
  token: string
  email: string
  expires_at: string
  clinic_config_id: string
  role: string | null
  accepted_at: string | null
  created_at: string
}

interface ValidationResponse {
  valid?: boolean
  email?: string
  clinicId?: string
  role?: string
  expiresAt?: string
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ValidationResponse>> {
  try {
    const body = await request.json()
    const { token } = body

    // Validate input
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    if (token.trim().length === 0) {
      return NextResponse.json(
        { error: 'Token cannot be empty' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if clinic_invites table exists by trying to query it
    const { data: invite, error: fetchError } = await supabase
      .from('clinic_invites')
      .select('id, token, email, expires_at, clinic_config_id, role, accepted_at, created_at')
      .eq('token', token.trim())
      .single()

    if (fetchError) {
      // Table doesn't exist or other error
      console.warn('Invite validation error - table may not exist:', fetchError.message)
      return NextResponse.json(
        { error: 'Failed to validate invite. Please ensure the clinic_invites table exists. Contact support.' },
        { status: 500 }
      )
    }

    if (!invite) {
      console.warn('Invite validation: Token not found:', { token: token.substring(0, 10) + '...' })
      return NextResponse.json(
        { error: 'Invalid invite token' },
        { status: 404 }
      )
    }

    const inviteData = invite 

    // Check if already accepted
    if (inviteData.accepted_at) {
      console.warn('Invite validation: Token already used:', { token: token.substring(0, 10) + '...' })
      return NextResponse.json(
        { error: 'This invite has already been used' },
        { status: 410 }
      )
    }

    // Check expiration
    const expiresAt = new Date(inviteData.expires_at)
    const now = new Date()

    if (expiresAt < now) {
      console.warn('Invite validation: Token expired:', { 
        token: token.substring(0, 10) + '...', 
        expiresAt 
      })
      return NextResponse.json(
        { error: 'Invite link has expired' },
        { status: 410 }
      )
    }

    // Token is valid - return safe metadata
    console.info('Invite validation: Success', { 
      token: token.substring(0, 10) + '...', 
      email: inviteData.email,
      clinicId: inviteData.clinic_config_id,
    })

    return NextResponse.json({
      valid: true,
      email: inviteData.email,
      clinicId: inviteData.clinic_config_id,
      role: inviteData.role || 'staff',
      expiresAt: inviteData.expires_at,
    })

  } catch (error) {
    console.error('Invite validation error:', error)
    
    // Provide helpful error message if clinic_invites table doesn't exist
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('clinic_invites')) {
      return NextResponse.json(
        { 
          error: 'Invite system not configured. Please run the database migration.' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to validate invite' },
      { status: 500 }
    )
  }
}
