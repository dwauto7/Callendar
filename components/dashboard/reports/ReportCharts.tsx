'use client'

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface ReportPoint {
  period: string
  calls: number
  bookings: number
  revenue: number
  investment: number
}

interface ReportChartsProps {
  data: ReportPoint[]
}

const tooltipStyle = {
  contentStyle: {
    background: '#111318',
    border: '1px solid #1E2128',
    borderRadius: '8px',
    color: '#F1F5F9',
    fontSize: '12px',
    padding: '8px 12px',
  },
  cursor: { fill: '#1E2128', opacity: 0.4 },
}

const legendStyle = {
  wrapperStyle: { paddingTop: 12, fontSize: 11, color: '#64748B' },
}

export function CallsTrendChart({ data }: ReportChartsProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-[#64748B]">
        No data
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="calls"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 3 }}
          activeDot={{ r: 5 }}
          name="Calls"
        />
        <Line
          type="monotone"
          dataKey="bookings"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 3 }}
          activeDot={{ r: 5 }}
          name="Bookings"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BookingsRevenueChart({ data }: ReportChartsProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-[#64748B]">
        No data
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2128" vertical={false} />
        <XAxis
          dataKey="period"
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
          formatter={(v, name) =>
            name === 'Revenue' || name === 'Investment'
              ? [`RM ${Number(v ?? 0).toLocaleString()}`, name]
              : [v, name]
          }
        />
        <Legend {...legendStyle} />
        <Bar dataKey="bookings" name="Bookings" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={24} />
        <Bar dataKey="investment" name="Investment" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={24} />
        <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
