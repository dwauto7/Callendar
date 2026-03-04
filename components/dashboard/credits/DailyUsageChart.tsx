'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatRM } from '@/lib/utils'

interface UsageEntry {
  created_at: string
  duration_min: number | null
  aya_usage_cost_rm: number | null
}

interface DailyUsageChartProps {
  calls: UsageEntry[]
}

const tooltipStyle = {
  contentStyle: {
    background: '#111318',
    border: '1px solid #1E2128',
    borderRadius: '8px',
    color: '#F1F5F9',
    fontSize: '12px',
  },
  itemStyle: { color: '#10B981' },
  labelStyle: { color: '#64748B', marginBottom: 4 },
  cursor: { fill: '#1E2128' },
}

export function DailyUsageChart({ calls }: DailyUsageChartProps) {
  const data = useMemo(() => {
    const map: Record<string, { date: string; mins: number; cost: number }> = {}
    calls.forEach((c) => {
      const day = c.created_at.slice(0, 10) // YYYY-MM-DD
      if (!map[day]) {
        const label = new Date(day + 'T00:00:00').toLocaleDateString('en-MY', {
          day: '2-digit', month: 'short',
        })
        map[day] = { date: label, mins: 0, cost: 0 }
      }
      map[day].mins = +(map[day].mins + (c.duration_min || 0)).toFixed(2)
      map[day].cost = +(map[day].cost + (c.aya_usage_cost_rm || 0)).toFixed(2)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([, v]) => v)
  }, [calls])

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-[#64748B]">
        No usage data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          unit=" m"
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [`${Number(v ?? 0).toFixed(1)} min`, 'Usage']}
        />
        <Bar dataKey="mins" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function UsageCostChart({ calls }: DailyUsageChartProps) {
  const data = useMemo(() => {
    const map: Record<string, { date: string; cost: number }> = {}
    calls.forEach((c) => {
      const day = c.created_at.slice(0, 10)
      if (!map[day]) {
        const label = new Date(day + 'T00:00:00').toLocaleDateString('en-MY', {
          day: '2-digit', month: 'short',
        })
        map[day] = { date: label, cost: 0 }
      }
      map[day].cost = +(map[day].cost + (c.aya_usage_cost_rm || 0)).toFixed(2)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([, v]) => v)
  }, [calls])

  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(v) => [formatRM(Number(v ?? 0)), 'Cost']}
          itemStyle={{ color: '#F59E0B' }}
        />
        <Bar dataKey="cost" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
