import { NextRequest, NextResponse } from 'next/server'

const submissions = new Map<string, number[]>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const now = Date.now()
    const windowMs = 60 * 60 * 1000
    const limit = 3

    const timestamps = (submissions.get(ip) ?? []).filter(t => now - t < windowMs)
    if (timestamps.length >= limit) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    submissions.set(ip, [...timestamps, now])

    const body = await req.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const clinic_name = typeof body?.clinic_name === 'string' ? body.clinic_name.trim() : ''
    const role = typeof body?.role === 'string' ? body.role.trim() : ''
    const rawPhone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const normalizedDigits = rawPhone.replace(/\D/g, '')

    if (!name || !email || !rawPhone || !clinic_name || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (normalizedDigits.length < 8 || normalizedDigits.length > 15) {
      return NextResponse.json(
        {
          error: 'Invalid phone',
          details: { message: 'Phone number must contain 8 to 15 digits.' },
        },
        { status: 400 }
      )
    }

    const res = await fetch('https://n8n.beaconhorizons.io/webhook/callendar-demo-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        clinic_name,
        role,
        phone: normalizedDigits,
        phone_raw: rawPhone,
      }),
    })

    if (!res.ok) {
      const responseText = await res.text()
      const details = {
        upstreamStatus: res.status,
        upstreamStatusText: res.statusText,
        upstreamResponse: responseText.slice(0, 500),
      }
      console.error('Demo request webhook error:', details)
      return NextResponse.json({ error: 'Failed to submit demo request', details }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as { message?: string; cause?: unknown }
    console.error('Demo request route error:', { message: err?.message ?? 'Unknown error', cause: err?.cause ?? null })
    return NextResponse.json(
      { error: 'Failed to submit demo request', details: { message: err?.message ?? 'Unknown error' } },
      { status: 500 }
    )
  }
}
