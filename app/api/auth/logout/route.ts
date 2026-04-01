// app/api/auth/logout/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user (for logging)
    const { data: { user } } = await supabase.auth.getUser()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: 500 }
      )
    }

    console.info('User logged out successfully', { userId: user?.id })

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Logout endpoint error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during logout' },
      { status: 500 }
    )
  }
}

// Optional: GET method to handle logout from direct link
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    // Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url))
  } catch (error) {
    console.error('Logout GET error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=logout_failed', request.url))
  }
}
