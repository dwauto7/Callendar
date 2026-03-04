import { Zap, Wifi, WifiOff } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CreditsWidgetProps {
  balance: number
  minutesUsed: number
  totalCredits: number
  status: string
  systemEnabled: boolean
  agentId?: string
}

export function CreditsWidget({
  balance,
  minutesUsed,
  totalCredits,
  status,
  systemEnabled,
  agentId,
}: CreditsWidgetProps) {
  const usedPct = totalCredits > 0 ? Math.round((minutesUsed / totalCredits) * 100) : 0
  const remainingPct = 100 - usedPct
  const isLow = remainingPct < 20
  const isActive = status?.toLowerCase() === 'active' && systemEnabled

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#111318] p-5 transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40',
        isLow ? 'border-[#F59E0B]/30' : 'border-[#1E2128]',
      )}
      style={{
        background: isLow
          ? 'linear-gradient(135deg, #111318 60%, rgba(245,158,11,0.05) 100%)'
          : 'linear-gradient(135deg, #111318 60%, rgba(16,185,129,0.05) 100%)',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="rounded-lg p-2"
            style={{
              background: isLow
                ? 'rgba(245,158,11,0.12)'
                : 'rgba(16,185,129,0.10)',
            }}
          >
            <Zap
              className="size-4"
              style={{ color: isLow ? '#F59E0B' : '#10B981' }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
              Credits
            </p>
            <p
              className="text-2xl font-bold text-[#F1F5F9] leading-tight"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {balance.toLocaleString()}
              <span className="text-sm font-medium text-[#64748B] ml-1">
                min left
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* System status */}
          <Badge
            className={cn(
              'text-[10px] font-semibold uppercase tracking-wider border-0',
              isActive
                ? 'bg-[#10B981]/15 text-[#10B981]'
                : 'bg-[#64748B]/15 text-[#64748B]',
            )}
          >
            {isActive ? (
              <Wifi className="size-2.5 mr-1" />
            ) : (
              <WifiOff className="size-2.5 mr-1" />
            )}
            {status}
          </Badge>

          {/* Low credit warning */}
          {isLow && (
            <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border-0 text-[10px] font-semibold uppercase tracking-wider">
              Low
            </Badge>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <Progress
          value={usedPct}
          className="h-1.5 bg-[#1E2128]"
          indicatorClassName={isLow ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}
        />
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>
            {minutesUsed.toLocaleString()} of {totalCredits.toLocaleString()} min used
          </span>
          <span
            className={cn(
              'font-semibold tabular-nums',
              isLow ? 'text-[#F59E0B]' : 'text-[#10B981]',
            )}
          >
            {remainingPct}% remaining
          </span>
        </div>
      </div>

      {agentId && (
        <p className="mt-3 text-[10px] text-[#64748B] font-mono truncate">
          Agent ID: {agentId}
        </p>
      )}
    </div>
  )
}
