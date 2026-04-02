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
  const { clinic_config_id, holiday_date, description, is_recurring } = body ?? {}

  if (!clinic_config_id || !holiday_date) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const webhookUrl = process.env.N8N_CLOSURES_WEBHOOK_URL ?? 'https://n8n.beaconhorizons.io/webhook/Holiday_Closure'

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'insert',
      clinic_config_id,
      holiday_date,
      description,
      is_recurring,
      user_id: user.id,
      user_email: user.email,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Automation failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { clinic_config_id, id } = body ?? {}

  if (!clinic_config_id || !id) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const webhookUrl = process.env.N8N_CLOSURES_WEBHOOK_URL ?? 'https://n8n.beaconhorizons.io/webhook/Holiday_Closure'

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete',
      clinic_config_id,
      id,
      user_id: user.id,
      user_email: user.email,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Automation failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
