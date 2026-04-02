import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { clinic_config_id, services } = body ?? {}

  if (!clinic_config_id || !Array.isArray(services)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const webhookUrl = process.env.N8N_SERVICES_WEBHOOK_URL ?? 'https://n8n.beaconhorizons.io/webhook/services-and-offers'
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clinic_config_id,
      services,
      user_id: user.id,
      user_email: user.email,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Automation failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
