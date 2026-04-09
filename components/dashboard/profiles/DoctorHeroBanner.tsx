'use client'

import { DoctorProfile, DoctorStats } from '@/components/dashboard/profiles/DoctorProfileClient'
import { cn } from '@/lib/utils'

export function DoctorHeroBanner({
  doctor,
  stats,
}: {
  doctor: DoctorProfile
  stats: DoctorStats
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const initials =
    doctor.display_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR'

  const completion = Math.max(0, Math.min(100, Number(stats.completion_rate ?? 0)))
  const dashOffset = 188.5 * (1 - completion / 100)

  return (
    <div className="relative rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden mb-6">
      <div className="absolute -top-24 -right-10 h-48 w-48 rounded-full bg-[#2DD4BF]/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]">
            {greeting}
          </p>
          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight text-white mt-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Dr. {doctor.display_name || '-'}
          </h1>
          <p className="text-sm text-white/40 mt-2">
            {doctor.specialty || 'General Practice'} - {doctor.clinic_configs?.clinic_name || 'Clinic'}
          </p>
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest mt-4',
              doctor.is_active
                ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/25 text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                : 'bg-red-500/10 border-red-500/20 text-red-400',
            )}
          >
            <span className={cn('size-2 rounded-full', doctor.is_active ? 'bg-[#2DD4BF] animate-pulse' : 'bg-red-400')} />
            {doctor.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" stroke="#212129" strokeWidth="3" fill="none" />
            <circle
              cx="36"
              cy="36"
              r="30"
              stroke="#2DD4BF"
              strokeWidth="3"
              fill="none"
              strokeDasharray="188.5"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '36px 36px' }}
            />
            <foreignObject x="12" y="12" width="48" height="48">
              <div className="w-12 h-12 rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 flex items-center justify-center">
                <span className="text-base font-black text-[#2DD4BF]">{initials}</span>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  )
}
