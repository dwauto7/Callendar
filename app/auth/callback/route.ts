import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/overview'

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  // Check for existing clinic_users record
  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()

  if (clinicUser?.clinic_config_id) {
    // Returning user — go straight to dashboard
    return NextResponse.redirect(`${origin}${next}`)
  }

  // No clinic_users record — find the existing clinic_config and auto-link
  const admin = createAdminClient()

  const { data: existingClinic, error: clinicErr } = await admin
    .from('clinic_config')
    .select('id')
    .limit(1)
    .single()

  if (clinicErr || !existingClinic?.id) {
    console.error('[auth/callback] No clinic_config found:', clinicErr?.message)
    // No clinic exists yet — send to onboarding
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  // Auto-create the clinic_users link
  const { error: insertErr } = await admin
    .from('clinic_users')
    .insert({
      user_id: user.id,
      clinic_config_id: existingClinic.id,
      role: 'owner',
    })

  if (insertErr) {
    console.error('[auth/callback] clinic_users insert error:', insertErr.message)
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  return NextResponse.redirect(`${origin}/dashboard/overview`)
}
