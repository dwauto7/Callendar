import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  accentColor?: string       // e.g. '#10B981'
  accentBg?: string          // e.g. 'rgba(16,185,129,0.12)'
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = '#10B981',
  accentBg = 'rgba(16,185,129,0.10)',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#1E2128] bg-[#111318] p-5',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 hover:border-[#2A3040]',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, #111318 60%, ${accentColor}08 100%)`,
      }}
    >
      {/* Subtle top-right glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
        style={{ background: accentColor, transform: 'translate(30%, -30%)' }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
            {title}
          </p>
          <p
            className="text-3xl font-bold text-[#F1F5F9] leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {value}
          </p>
          {description && (
            <p className="text-xs text-[#64748B] mt-2">{description}</p>
          )}
        </div>

        {/* Icon badge */}
        <div
          className="shrink-0 rounded-lg p-2.5"
          style={{ background: accentBg }}
        >
          <Icon className="size-5" style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  )
}
