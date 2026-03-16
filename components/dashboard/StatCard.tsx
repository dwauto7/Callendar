'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
// Import all icons here so they are bundled with the client component
import { Phone, CalendarCheck, Clock, TrendingUp, Zap } from 'lucide-react'

const IconMap = {
  phone: Phone,
  calendar: CalendarCheck,
  clock: Clock,
  trending: TrendingUp,
  zap: Zap,
}

interface StatCardProps {
  title: string
  value: string
  description?: string
  iconName: keyof typeof IconMap // Changed from 'icon: LucideIcon'
  accentColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  iconName,
  accentColor = '#40E0FF', 
  className,
}: StatCardProps) {
  // Select the icon based on the string passed
  const Icon = IconMap[iconName] || Zap

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] glass-panel',
        'transition-all duration-500 hover:-translate-y-1 hover:border-[#40E0FF]/30 group',
        className,
      )}
    >
      <CardContent className="p-6 relative">
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-500 pointer-events-none"
          style={{ background: accentColor, transform: 'translate(20%, -20%)' }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
              {title}
            </p>
            <p
              className="text-3xl font-bold text-white leading-none tracking-tighter"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {value}
            </p>
            {description && (
              <p className="text-[11px] text-white/30 font-medium mt-3 tracking-tight">
                {description}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-xl p-3 bg-white/5 border border-white/10 group-hover:cyan-glow transition-all duration-500">
            <Icon className="size-5 text-[#40E0FF]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
