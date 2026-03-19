'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Activity, DollarSign } from 'lucide-react'

const DailyUsageChart = dynamic(
  () => import('./DailyUsageChart').then((m) => m.DailyUsageChart),
  { ssr: false }
)
const UsageCostChart = dynamic(
  () => import('./DailyUsageChart').then((m) => m.UsageCostChart),
  { ssr: false }
)

type UsageEntry = {
  created_at: string
  duration_min: number | null
  aya_usage_cost_rm: number | null
}

function useInView(rootMargin = '200px') {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || visible) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
        }
      },
      { rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return { ref, visible }
}

export function CreditsChartsClient({ calls }: { calls: UsageEntry[] }) {
  const { ref, visible } = useInView()

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-3xl border border-white/5 min-h-[260px]">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="size-4 text-[#40E0FF]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Throughput (min)
          </p>
        </div>
        {visible ? (
          <DailyUsageChart calls={calls} />
        ) : (
          <div className="h-[200px] rounded-xl bg-white/[0.02] animate-pulse" />
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/5 min-h-[200px]">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="size-4 text-amber-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Compute Cost (RM)
          </p>
        </div>
        {visible ? (
          <UsageCostChart calls={calls} />
        ) : (
          <div className="h-[120px] rounded-xl bg-white/[0.02] animate-pulse" />
        )}
      </div>
    </div>
  )
}
