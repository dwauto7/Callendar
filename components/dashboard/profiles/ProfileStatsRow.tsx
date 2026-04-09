'use client'

import { DoctorStats } from '@/components/dashboard/profiles/DoctorProfileClient'

export function ProfileStatsRow({ stats }: { stats: DoctorStats }) {
  const items = [
    { label: "Today's Appointments", value: stats.today ?? 0, helper: 'appointments today' },
    { label: 'This Week', value: stats.week ?? 0, helper: 'this week' },
    { label: 'This Month', value: stats.month ?? 0, helper: 'this month' },
    { label: 'Completion Rate', value: `${stats.completion_rate ?? 0}%`, helper: 'confirmed this month' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-[#212129] bg-black/20 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{item.label}</p>
          <p
            className="mt-3 text-2xl font-semibold tracking-tight text-white tabular-nums"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {item.value}
          </p>
          <p className="text-xs text-white/30 mt-1">{item.helper}</p>
        </div>
      ))}
    </div>
  )
}
