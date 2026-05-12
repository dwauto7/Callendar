import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

const ratelimit = upstashConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(20, '10s'), // 20 requests per 10s per IP
    })
  : null

const OWNER_ONLY_ROUTES = ['/dashboard/settings', '/dashboard/reports']
const RATE_LIMITED_PATHS = ['/', '/onboarding'] // login page + onboarding

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // Rate limit public entry points only when Upstash is configured
  if (ratelimit && RATE_LIMITED_PATHS.includes(pathname)) {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return new NextResponse('Too many requests', { status: 429 })
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', 'required')
    return NextResponse.redirect(url)
  }

  if (pathname === '/onboarding' && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Role-gate owner routes (use Redis cache only if configured)
  if (user && OWNER_ONLY_ROUTES.some(r => pathname.startsWith(r))) {
    let role: string | null = null

    if (upstashConfigured) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
      const cacheKey = `role:${user.id}`
      role = await redis.get<string>(cacheKey)

      if (!role) {
        const { data: clinicUser } = await supabase
          .from('clinic_users')
          .select('role')
          .eq('user_id', user.id)
          .single()

        role = clinicUser?.role ?? 'staff'
        await redis.set(cacheKey, role, { ex: 300 }) // cache for 5 minutes
      }
    } else {
      const { data: clinicUser } = await supabase
        .from('clinic_users')
        .select('role')
        .eq('user_id', user.id)
        .single()
      role = clinicUser?.role ?? 'staff'
    }

    const isOwner = role === 'owner' || role === 'admin'
    if (!isOwner) {
      return NextResponse.redirect(new URL('/dashboard/overview', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/'],
}
