'use client'

import { useEffect, useMemo, useState } from 'react'

type Metrics = {
  lcp?: number
  cls?: number
}

const STORAGE_KEY = 'perf_overlay'

function formatMs(value?: number) {
  if (value == null || Number.isNaN(value)) return '--'
  return `${value.toFixed(0)}ms`
}

function formatCls(value?: number) {
  if (value == null || Number.isNaN(value)) return '--'
  return value.toFixed(3)
}

export function PerfOverlay() {
  const [enabled, setEnabled] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({})

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    const params = new URLSearchParams(window.location.search)
    const param = params.get('perf')
    if (param === '1') {
      window.localStorage.setItem(STORAGE_KEY, '1')
      setEnabled(true)
      return
    }
    if (param === '0') {
      window.localStorage.setItem(STORAGE_KEY, '0')
      setEnabled(false)
      return
    }
    setEnabled(window.localStorage.getItem(STORAGE_KEY) === '1')
  }, [])

  useEffect(() => {
    if (!enabled || typeof PerformanceObserver === 'undefined') return

    let lcpObserver: PerformanceObserver | null = null
    let clsObserver: PerformanceObserver | null = null
    let clsValue = 0

    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1] as LargestContentfulPaint | undefined
        if (last) {
          setMetrics((prev) => ({ ...prev, lcp: last.startTime }))
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {}

    try {
      clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        setMetrics((prev) => ({ ...prev, cls: clsValue }))
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch {}

    return () => {
      lcpObserver?.disconnect()
      clsObserver?.disconnect()
    }
  }, [enabled])

  const classes = useMemo(
    () =>
      'fixed bottom-4 right-4 z-[9999] rounded-lg border border-white/10 bg-black/70 text-white px-3 py-2 text-[11px] font-mono shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md',
    []
  )

  if (!enabled) return null

  return (
    <div className={classes}>
      <div className="flex items-center gap-2">
        <span className="text-white/60">LCP</span>
        <span className="font-bold">{formatMs(metrics.lcp)}</span>
        <span className="text-white/30">|</span>
        <span className="text-white/60">CLS</span>
        <span className="font-bold">{formatCls(metrics.cls)}</span>
      </div>
      <button
        className="mt-1 text-[10px] text-white/40 hover:text-white/80 underline"
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, '0')
          setEnabled(false)
        }}
      >
        Hide overlay
      </button>
    </div>
  )
}
