'use client'

import { useEffect, useMemo, useState } from 'react'
import { Switch } from '@/components/ui/switch'

const STORAGE_KEY = 'reduced_motion'

function getInitialValue() {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === '1') return true
  if (stored === '0') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function ReducedMotionToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getInitialValue())
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('reduced-motion', enabled)
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  }, [enabled])

  const label = useMemo(
    () => (enabled ? 'Reduced Motion On' : 'Reduced Motion Off'),
    [enabled]
  )

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#111318] px-5 py-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
          Reduced Motion
        </p>
        <p className="text-xs text-[#64748B] mt-1">
          Minimizes decorative animations and motion effects across the app.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          {label}
        </span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
    </div>
  )
}
