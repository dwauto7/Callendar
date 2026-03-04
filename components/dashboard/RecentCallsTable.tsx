import Link from 'next/link'
import { PhoneCall, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

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
    <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2128]">
        <div className="flex items-center gap-2">
          <PhoneCall className="size-4 text-[#10B981]" />
          <h2
            className="text-sm font-semibold text-[#F1F5F9]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Recent Calls
          </h2>
        </div>
        <Link
          href="/dashboard/calls"
          className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#10B981] transition-colors duration-200"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Rows */}
      {calls.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-[#64748B]">
          No calls yet
        </div>
      ) : (
        <div className="divide-y divide-[#1E2128]">
          {calls.map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-[#161B22] transition-colors duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar letter */}
                <div className="size-8 rounded-full bg-[#1E2128] flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-[#F1F5F9]">
                    {(call.client_name?.[0] ?? '?').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">
                    {call.client_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">
                    {call.patient_phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                {call.is_after_hours && (
                  <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border-0 text-[10px] font-semibold hidden sm:inline-flex">
                    After-hours
                  </Badge>
                )}
                {call.appointment_id && (
                  <Badge className="bg-[#10B981]/15 text-[#10B981] border-0 text-[10px] font-semibold hidden sm:inline-flex">
                    Booked
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-[#64748B]">
                  <Clock className="size-3 shrink-0" />
                  <span className="tabular-nums">
                    {Number(call.duration_min).toFixed(1)}m
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] whitespace-nowrap hidden md:block">
                  {formatDateTime(call.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
