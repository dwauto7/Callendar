'use client'

import { Zap, Clock, AlertCircle, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface CreditsWidgetProps {
  balance: number
  minutesUsed: number
  totalCredits: number
  status: string
  answeringMode: 'always_on' | 'after_hours' | 'disabled'
  agentId?: string
}

export function CreditsWidget({
  balance,
  minutesUsed,
  totalCredits,
  status,
  answeringMode = 'disabled',
  agentId,
}: CreditsWidgetProps) {
  const usedPct = totalCredits > 0 ? Math.round((minutesUsed / totalCredits) * 100) : 0
  const remainingPct = 100 - usedPct
  const isLow = remainingPct < 20

  const modeConfig = {
    always_on: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      label: '24/7 Availability',
      icon: ShieldCheck,
    },
    after_hours: {
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
      label: 'After Working Hours',
      icon: Clock,
    },
    disabled: {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      dot: 'bg-red-500',
      label: 'Offline',
      icon: AlertCircle,
    },
  }

  const currentMode = modeConfig[answeringMode] ?? modeConfig.disabled
  const ModeIcon = currentMode.icon

  return (
    <Card
      className={cn(
        'rounded-2xl border bg-white/[0.02] transition-all duration-500 glass-panel relative overflow-hidden group',
        isLow ? 'border-amber-500/20' : 'border-white/5',
      )}
    >
      <CardContent className="p-6 relative">
        {/* Dynamic Background Glow */}
        <div
          className={cn(
            'absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 transition-opacity duration-500',
            isLow
              ? 'bg-amber-500'
              : answeringMode === 'always_on'
              ? 'bg-emerald-500'
              : 'bg-[#40E0FF]',
          )}
        />

        {/* ── Engine capacity row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

          {/* Left: icon + balance */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'rounded-xl p-3 border transition-all duration-500 group-hover:scale-110',
                isLow
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-[#40E0FF]/10 border-[#40E0FF]/20',
              )}
            >
              <Zap
                className="size-5"
                style={{ color: isLow ? '#F59E0B' : '#40E0FF' }}
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                Engine Capacity
              </p>
              <p
                className="text-3xl font-bold text-white tracking-tighter"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {balance.toLocaleString()}
                <span className="text-sm font-medium text-white/30 ml-2 tracking-normal">
                  mins available
                </span>
              </p>
            </div>
          </div>

          {/* Right: Status + System Live side by side + low warning */}
          <div className="flex items-center gap-2 flex-wrap">
            {status && (
              <Badge className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-full bg-white/5 text-white/40 border-white/10">
                Status: {status}
              </Badge>
            )}

            <Badge
              className={cn(
                'px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-full transition-colors duration-300 flex items-center gap-1.5',
                currentMode.bg,
                currentMode.color,
                currentMode.border,
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full shrink-0',
                  currentMode.dot,
                  answeringMode !== 'disabled' && 'animate-pulse',
                )}
              />
              <ModeIcon className="size-3" />
              {currentMode.label}
            </Badge>

            {isLow && (
              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-full animate-bounce">
                Refill Required
              </Badge>
            )}
          </div>
        </div>

        {/* ── Utilization bar ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/30">
            <span>Utilization Matrix</span>
            <span className={isLow ? 'text-amber-500' : 'text-[#40E0FF]'}>
              {remainingPct}% Power Remaining
            </span>
          </div>
          <div className="h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                isLow
                  ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-[#40E0FF] shadow-[0_0_10px_rgba(64,224,255,0.5)]',
              )}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <div className="text-[10px] text-white/20 font-medium italic">
            Total Bandwidth: {totalCredits.toLocaleString()} minutes allocated for current cycle.
          </div>
        </div>

        {agentId && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] text-white/20 font-mono tracking-tighter uppercase">
              Processor ID: {agentId}
            </span>
            <span className="text-[9px] text-white/20 font-mono uppercase">Region: KL-PJ-01</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
