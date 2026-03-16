'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface UsageEntry {
  created_at: string
  duration_min: number | null
  aya_usage_cost_rm: number | null
}

interface DailyUsageChartProps {
  calls: UsageEntry[]
}

// Updated Tooltip for the "Blizzard" look
const blizzardTooltip = {
  contentStyle: {
    background: '#0D0F12',
    border: '1px solid rgba(64, 224, 255, 0.2)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    backdropFilter: 'blur(8px)',
  },
  cursor: { fill: 'rgba(64, 224, 255, 0.05)' },
}

export function DailyUsageChart({ calls }: DailyUsageChartProps) {
  const data = useMemo(() => {
    const map: Record<string, { date: string; mins: number; cost: number }> = {}
    calls.forEach((c) => {
      const day = c.created_at.slice(0, 10)
      if (!map[day]) {
        const label = new Date(day + 'T00:00:00').toLocaleDateString('en-MY', {
          day: '2-digit', month: 'short',
        })
        map[day] = { date: label, mins: 0, cost: 0 }
      }
      map[day].mins = +(map[day].mins + (c.duration_min || 0)).toFixed(2)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([, v]) => v)
  }, [calls])

  if (data.length === 0) {
    return <div className="h-[200px] flex items-center justify-center text-sm text-white/20">No usage data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} unit="m" />
        <Tooltip {...blizzardTooltip} formatter={(v) => [`${Number(v ?? 0).toFixed(1)} min`, 'Usage']} />
        <Bar dataKey="mins" fill="#40E0FF" radius={[4, 4, 0, 0]} maxBarSize={32} />
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
        map[day] = { 
            date: new Date(day + 'T00:00:00').toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }), 
            cost: 0 
        }
      }
      map[day].cost = +(map[day].cost + (c.aya_usage_cost_rm || 0)).toFixed(2)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-30).map(([, v]) => v)
  }, [calls])

  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip 
          {...blizzardTooltip} 
          formatter={(v) => [`RM ${Number(v ?? 0).toFixed(2)}`, 'Cost']} 
        />
        <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}