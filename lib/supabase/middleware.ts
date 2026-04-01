import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/auth')
  const isOnboarding = pathname.startsWith('/onboarding')
  const isDashboard = pathname.startsWith('/dashboard')

  // 🔒 NOT LOGGED IN → block protected routes
  if (!user && (isDashboard || isOnboarding)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // 🔁 LOGGED IN → prevent going back to auth pages
  if (user && isAuthRoute && pathname !== '/auth/accept-invite') {
    return NextResponse.redirect(new URL('/auth/post-auth', request.url))
  }

  return response
}