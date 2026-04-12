import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/auth/post-oauth'

  if (!code) {
    console.error('No code in callback')
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Code exchange error:', exchangeError)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  // ── Check for a pending invite token in cookies ───────────────
  const cookieStore = await cookies()
  const inviteToken = cookieStore.get('invite_token')?.value

  if (inviteToken) {
    // Use getUser() — verified against Supabase Auth server, not just cookie
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!userError && user) {
      try {
        // Pass user_id directly — accept-invite uses service role to do the linking
        const acceptResponse = await fetch(`${origin}/api/auth/accept-invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invite_token: inviteToken,
            user_id: user.id,        // verified user id from auth server
            user_email: user.email,  // for email match check
          }),
        })

        if (!acceptResponse.ok) {
          const errorData = await acceptResponse.json()
          console.error('Accept invite failed:', errorData)
          const response = NextResponse.redirect(`${origin}/dashboard?invite_error=1`)
          response.cookies.delete('invite_token')
          return response
        }
      } catch (err) {
        console.error('Accept invite fetch error:', err)
        const response = NextResponse.redirect(`${origin}/dashboard?invite_error=1`)
        response.cookies.delete('invite_token')
        return response
      }
    }

    const response = NextResponse.redirect(`${origin}/auth/post-oauth`)
    response.cookies.delete('invite_token')
    return response
  }

  // ── Normal OAuth (no invite) ──────────────────────────────────
  return NextResponse.redirect(`${origin}${next}`)
}