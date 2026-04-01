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

        {/* ── Metrics row (Balance | Minutes Used | Total Minutes) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Balance (Remaining) - Cyan */}
          <div className="rounded-xl p-4 bg-[#40E0FF]/5 border border-[#40E0FF]/20">
            <p className="text-[10px] font-semibold text-[#40E0FF]/70 uppercase tracking-[0.15em] mb-2">
              Balance Available
            </p>
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {balance.toLocaleString()}
            </p>
            <p className="text-xs text-white/40 mt-1">minutes</p>
          </div>

          {/* Minutes Used - Amber */}
          <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20">
            <p className="text-[10px] font-semibold text-amber-500/70 uppercase tracking-[0.15em] mb-2">
              Minutes Used
            </p>
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {minutesUsed.toLocaleString()}
            </p>
            <p className="text-xs text-white/40 mt-1">{usedPct}% consumed</p>
          </div>

          {/* Total Minutes - Emerald */}
          <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-[0.15em] mb-2">
              Total Minutes
            </p>
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {totalCredits.toLocaleString()}
            </p>
            <p className="text-xs text-white/40 mt-1">allocated</p>
          </div>
        </div>

        {/* ── Status & Mode badges ── */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {status && (
            <Badge className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest border rounded-full bg-white/5 text-white/40 border-white/10">
              Status: {status}
            </Badge>
          )}

          <Badge
            className={cn(
              'px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest border rounded-full transition-colors duration-300 flex items-center gap-1.5',
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
            <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-widest rounded-full animate-bounce">
              Refill Required
            </Badge>
          )}
        </div>

        {/* ── Usage progress bar ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-white/40">
            <span>Usage Progress</span>
            <span className={isLow ? 'text-amber-500 font-bold' : 'text-[#40E0FF]'}>
              {remainingPct}% remaining
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
