'use client'

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const blizzardTooltip = {
  contentStyle: {
    background: '#0D0F12',
    border: '1px solid rgba(64, 224, 255, 0.2)',
    borderRadius: '16px',
    color: '#FFFFFF',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    backdropFilter: 'blur(10px)',
  },
  cursor: { fill: 'rgba(64, 224, 255, 0.03)' },
}

type ChartPoint = {
  period: string
  calls: number
  bookings: number
  revenue?: number
  investment?: number
}

export function CallsTrendChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0)
    return (
      <div className="h-[240px] flex items-center justify-center text-xs font-black text-white/20 uppercase tracking-widest">
        Awaiting Data
      </div>
    )

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip {...blizzardTooltip} />
        <Line type="monotone" dataKey="calls" stroke="#2DD4BF" strokeWidth={4} dot={false} name="Total Calls" />
        <Line type="monotone" dataKey="bookings" stroke="#2DD4BF" strokeWidth={4} dot={false} name="Bookings" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BookingsRevenueChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0)
    return (
      <div className="h-[240px] flex items-center justify-center text-xs font-black text-white/20 uppercase tracking-widest">
        Awaiting Data
      </div>
    )

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          {...blizzardTooltip}
          formatter={(v, name) => [typeof v === 'number' ? `RM ${v.toLocaleString()}` : v, name]}
        />
        <Bar dataKey="investment" name="Cost" fill="rgba(255,255,255,0.05)" radius={[6, 6, 0, 0]} maxBarSize={20} />
        <Bar dataKey="revenue" name="Revenue" fill="#2DD4BF" radius={[6, 6, 0, 0]} maxBarSize={20} className="cyan-glow-bar" />
      </BarChart>
    </ResponsiveContainer>
  )
}

