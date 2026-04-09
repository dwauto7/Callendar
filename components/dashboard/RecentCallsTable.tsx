import Link from 'next/link'
import { PhoneCall, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface CallLog {
  id: string
  client_name: string
  patient_phone: string
  duration_min: number
  created_at: string
  is_after_hours: boolean
  appointment_id: string | null
}

interface RecentCallsTableProps {
  calls: CallLog[]
}

export function RecentCallsTable({ calls }: RecentCallsTableProps) {
  return (
    <Card className="rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden glass-panel flex flex-col">
      <CardHeader className="flex items-center justify-between px-6 py-5 border-b border-[#212129] bg-black/20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/20">
            <PhoneCall className="size-4 text-[#2DD4BF]" />
          </div>
          <h2
            className="text-sm font-black text-white uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Live Stream <span className="text-white/20">/ Logs</span>
          </h2>
        </div>
        <Link
          href="/dashboard/operations"
          className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#2DD4BF] transition-all"
        >
          Detailed Records
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>

      {/* Rows */}
      {calls.length === 0 ? (
        <CardContent className="px-6 py-12 text-center text-xs font-semibold uppercase tracking-widest text-white/20 italic">
          Waiting for system activity...
        </CardContent>
      ) : (
        <CardContent className="p-0 divide-y divide-white/5">
          {calls.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#121216] transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-10 rounded-xl bg-black/20 border border-[#212129] flex items-center justify-center shrink-0 group-hover:border-[#2DD4BF]/30 transition-colors">
                  <span className="text-xs font-black text-white/60">
                    {(call.client_name?.[0] ?? '?').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white tracking-tight truncate">
                    {call.client_name || call.patient_phone || 'Incoming Signal...'}
                  </p>
                  <p className="text-[10px] font-mono text-white/30 tracking-tighter truncate">
                    {call.patient_phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-4">
                <div className="hidden sm:flex items-center gap-2">
                  {call.is_after_hours && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[9px] font-black uppercase tracking-widest rounded-md">
                      After-Hours
                    </Badge>
                  )}
                  {call.appointment_id && (
                    <Badge className="bg-[#2DD4BF]/10 text-[#2DD4BF] border-0 text-[9px] font-black uppercase tracking-widest rounded-md">
                      Success
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 tabular-nums">
                    <Clock className="size-3 text-[#2DD4BF]" />
                    {Number(call.duration_min).toFixed(1)}m
                  </div>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter">
                    {formatDateTime(call.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      )}
      
      {/* Footer Decoration */}
      <div className="mt-auto px-6 py-3 bg-black/20 border-t border-[#212129] flex items-center gap-2">
        <ShieldCheck className="size-3 text-[#2DD4BF]/40" />
        <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">End-to-End Encrypted Intelligence</span>
      </div>
    </Card>
  )
}

