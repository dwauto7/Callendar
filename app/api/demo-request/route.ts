import { NextRequest, NextResponse } from 'next/server'

const submissions = new Map<string, number[]>()

export async function POST(req: NextRequest) {
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
  const { name, email, phone, clinic_name, role } = body

  if (!name || !email || !phone || !clinic_name || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (!/^\+?[\d\s\-]{8,15}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
  }

  const res = await fetch('https://n8n.beaconhorizons.io/webhook/callendar-demo-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, clinic_name, role }),
  })

  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}