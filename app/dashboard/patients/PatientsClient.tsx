'use client'

import { useMemo, useState } from 'react'
import { Search, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PatientRow = {
  id: string
  name: string | null
  phone: string | null
  last_visit: string | null
  last_appointment_type: string | null
  total_visits: number | null
  created_at: string
  last_doctor: {
    display_name: string | null
  } | null
}

type LatestAppt = {
  phone: string | null
  status: string | null
  appointment_date: string | null
  appointment_type: string | null
}

function fmtDate(date: string | null, fallback = '—') {
  if (!date) return fallback
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

function latestBadgeClass(status: string | null) {
  if (status === 'Booked') return 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20'
  if (status === 'Cancelled') return 'bg-red-500/10 text-red-400 border-red-500/20'
  if (status === 'Rescheduled') return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  return 'bg-black/20 text-white/50 border-[#212129]'
}

export function PatientsSkeleton() {
  return (
    <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden">
      <div className="p-4 border-b border-[#212129]">
        <div className="h-8 w-64 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function PatientsClient({
  patients,
  apptMap,
  errorMessage,
}: {
  patients: PatientRow[]
  apptMap: Record<string, LatestAppt>
  errorMessage?: string | null
}) {
  const [search, setSearch] = useState('')
  const [lastVisitAsc, setLastVisitAsc] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = q
      ? patients.filter((p) => {
          const name = (p.name ?? '').toLowerCase()
          const phone = p.phone ?? ''
          return name.includes(q) || phone.toLowerCase().includes(q)
        })
      : patients

    return [...base].sort((a, b) => {
      const da = a.last_visit ? new Date(a.last_visit).getTime() : Number.NEGATIVE_INFINITY
      const db = b.last_visit ? new Date(b.last_visit).getTime() : Number.NEGATIVE_INFINITY
      return lastVisitAsc ? da - db : db - da
    })
  }, [patients, search, lastVisitAsc])

  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-[#212129] bg-[#121216] p-10 text-center">
        <div className="mx-auto mb-4 size-12 rounded-full border border-[#212129] bg-black/20 flex items-center justify-center">
          <UserRound className="size-6 text-white/40" />
        </div>
        <h2 className="text-white text-lg font-semibold">No patients yet</h2>
        <p className="text-sm text-white/40 mt-1">Patients will appear here after their first call or appointment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="pl-8 h-9 bg-[#121216] border-[#212129] text-white/90 placeholder:text-white/30"
        />
      </div>

      <div className="rounded-2xl border border-[#212129] bg-[#121216] overflow-x-auto">
        <table className="w-full min-w-[1020px]">
          <thead>
            <tr className="border-b border-[#212129]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Name</th>
              <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Phone</th>
              <th className="text-left px-3 py-3">
                <button
                  className="text-[10px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
                  onClick={() => setLastVisitAsc((v) => !v)}
                >
                  Last Visit {lastVisitAsc ? '↑' : '↓'}
                </button>
              </th>
              <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Last Type</th>
              <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Doctor</th>
              <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Total Visits</th>
              <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Latest Appt</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const latest = p.phone ? apptMap[p.phone] : undefined
              return (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm text-white/90 font-medium">{p.name || '—'}</td>
                  <td className="px-3 py-3 text-sm text-white/70">{p.phone || '—'}</td>
                  <td className="px-3 py-3 text-sm text-white/70">{fmtDate(p.last_visit, 'Never')}</td>
                  <td className="px-3 py-3 text-sm text-white/70">{p.last_appointment_type || '—'}</td>
                  <td className="px-3 py-3 text-sm text-white/70">{p.last_doctor?.display_name || '—'}</td>
                  <td className="px-3 py-3 text-sm text-white/80">{p.total_visits ?? 0}</td>
                  <td className="px-3 py-3">
                    {latest ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">{fmtDate(latest.appointment_date)}</span>
                        <Badge className={cn('text-[10px] uppercase tracking-widest border rounded-full', latestBadgeClass(latest.status))}>
                          {latest.status || 'Unknown'}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-white/35">No appointments</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-white/70">{fmtDate(p.created_at.slice(0, 10))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
