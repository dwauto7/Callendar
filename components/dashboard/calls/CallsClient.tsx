'use client'

import { useState, useMemo } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime, formatRM } from '@/lib/utils'
import {
  PhoneCall, Clock, DollarSign, Zap, FileText, Mic, ChevronRight,
  Calendar, Filter, X
} from 'lucide-react'

export type CallLogRow = {
  id: string
  client_name: string | null
  patient_phone: string | null
  duration_min: number | null
  aya_usage_cost_rm: number | null
  minutes_saved: number | null
  is_after_hours: boolean
  appointment_id: string | null
  created_at: string
  recording_url: string | null
}

type DrawerDetail = {
  transcript: string | null
  summary: string | null
  recording_url: string | null
}

interface CallsClientProps {
  calls: CallLogRow[]
}

export function CallsClient({ calls }: CallsClientProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CallLogRow | null>(null)
  const [detail, setDetail] = useState<DrawerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterAfterHours, setFilterAfterHours] = useState(false)
  const [filterHasAppt, setFilterHasAppt] = useState(false)

  const filtered = useMemo(() => {
    return calls.filter((c) => {
      if (filterAfterHours && !c.is_after_hours) return false
      if (filterHasAppt && !c.appointment_id) return false
      if (dateFrom && c.created_at < dateFrom) return false
      if (dateTo && c.created_at > dateTo + 'T23:59:59') return false
      return true
    })
  }, [calls, filterAfterHours, filterHasAppt, dateFrom, dateTo])

  const activeFilters =
    filterAfterHours || filterHasAppt || dateFrom || dateTo

  async function openDrawer(call: CallLogRow) {
    setSelected(call)
    setDetail(null)
    setOpen(true)
    setDetailLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('call_logs')
      .select('transcript, summary, recording_url')
      .eq('id', call.id)
      .single()
    setDetail(data)
    setDetailLoading(false)
  }

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setFilterAfterHours(false)
    setFilterHasAppt(false)
  }

  return (
    <>
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Filter className="size-3.5" />
          <span className="font-medium uppercase tracking-wider">Filters</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 rounded-md border border-[#1E2128] bg-[#111318] px-2.5 text-xs text-[#F1F5F9] [color-scheme:dark] focus:border-[#10B981] focus:outline-none transition-colors"
            title="From date"
          />
          <span className="text-[#64748B] text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-8 rounded-md border border-[#1E2128] bg-[#111318] px-2.5 text-xs text-[#F1F5F9] [color-scheme:dark] focus:border-[#10B981] focus:outline-none transition-colors"
            title="To date"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1E2128] bg-[#111318]">
          <Switch
            id="after-hours"
            checked={filterAfterHours}
            onCheckedChange={setFilterAfterHours}
            className="data-[state=checked]:bg-[#F59E0B] scale-75"
          />
          <Label htmlFor="after-hours" className="text-xs text-[#64748B] cursor-pointer">
            After-hours only
          </Label>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1E2128] bg-[#111318]">
          <Switch
            id="has-appt"
            checked={filterHasAppt}
            onCheckedChange={setFilterHasAppt}
            className="data-[state=checked]:bg-[#10B981] scale-75"
          />
          <Label htmlFor="has-appt" className="text-xs text-[#64748B] cursor-pointer">
            Booked only
          </Label>
        </div>

        {activeFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-[#64748B] tabular-nums">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] gap-3 px-5 py-3 border-b border-[#1E2128] text-[10px] font-semibold text-[#64748B] uppercase tracking-widest">
          <span>Client</span>
          <span className="hidden sm:block">Phone</span>
          <span>Duration</span>
          <span className="hidden md:block">Cost</span>
          <span className="hidden md:block">Saved</span>
          <span className="hidden lg:block">Flags</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#64748B]">
            No calls match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-[#1E2128]">
            {filtered.map((call) => (
              <button
                key={call.id}
                onClick={() => openDrawer(call)}
                className="w-full grid grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] gap-3 items-center px-5 py-3.5 text-left hover:bg-[#161B22] transition-colors duration-200 group"
              >
                {/* Client */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">
                    {call.client_name || 'Unknown'}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate">
                    {formatDateTime(call.created_at)}
                  </p>
                </div>

                {/* Phone */}
                <p className="hidden sm:block text-xs text-[#64748B] truncate">
                  {call.patient_phone || '—'}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-1 text-xs text-[#F1F5F9] tabular-nums">
                  <Clock className="size-3 text-[#64748B]" />
                  {Number(call.duration_min || 0).toFixed(1)}m
                </div>

                {/* Cost */}
                <p className="hidden md:block text-xs text-[#64748B] tabular-nums">
                  {formatRM(call.aya_usage_cost_rm)}
                </p>

                {/* Saved */}
                <p className="hidden md:block text-xs text-[#10B981] tabular-nums">
                  +{Number(call.minutes_saved || 0).toFixed(1)}m
                </p>

                {/* Flags */}
                <div className="hidden lg:flex items-center gap-1.5">
                  {call.is_after_hours && (
                    <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border-0 text-[9px] font-bold uppercase tracking-wider">
                      After-hrs
                    </Badge>
                  )}
                  {call.appointment_id && (
                    <Badge className="bg-[#10B981]/15 text-[#10B981] border-0 text-[9px] font-bold uppercase tracking-wider">
                      Booked
                    </Badge>
                  )}
                </div>

                {/* Arrow */}
                <ChevronRight className="size-4 text-[#64748B] group-hover:text-[#10B981] transition-colors duration-200" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transcript / detail drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-[#0D0F12] border-l border-[#1E2128] p-0 flex flex-col"
        >
          {selected && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#1E2128] shrink-0">
                <SheetTitle
                  className="text-lg font-bold text-[#F1F5F9]"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {selected.client_name || 'Unknown Caller'}
                </SheetTitle>
                <p className="text-sm text-[#64748B]">{selected.patient_phone}</p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Meta row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Clock, label: 'Duration', value: `${Number(selected.duration_min || 0).toFixed(1)} min`, color: '#3B82F6' },
                    { icon: DollarSign, label: 'Cost', value: formatRM(selected.aya_usage_cost_rm), color: '#F59E0B' },
                    { icon: Zap, label: 'Saved', value: `${Number(selected.minutes_saved || 0).toFixed(1)} min`, color: '#10B981' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="rounded-lg border border-[#1E2128] bg-[#111318] p-3 text-center">
                      <Icon className="size-4 mx-auto mb-1.5" style={{ color }} />
                      <p className="text-xs text-[#64748B]">{label}</p>
                      <p className="text-sm font-semibold text-[#F1F5F9] tabular-nums mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Badges + date */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Calendar className="size-3.5" />
                    {formatDateTime(selected.created_at)}
                  </div>
                  {selected.is_after_hours && (
                    <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border-0 text-[10px] font-bold uppercase">
                      After-hours
                    </Badge>
                  )}
                  {selected.appointment_id && (
                    <Badge className="bg-[#10B981]/15 text-[#10B981] border-0 text-[10px] font-bold uppercase">
                      Appointment booked
                    </Badge>
                  )}
                </div>

                {detailLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 rounded bg-[#1E2128] animate-pulse" />
                    ))}
                  </div>
                ) : detail ? (
                  <>
                    {/* AI Summary */}
                    {detail.summary && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="size-3.5 text-[#10B981]" />
                          <p className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-widest">
                            AI Summary
                          </p>
                        </div>
                        <div className="rounded-lg border border-[#1E2128] bg-[#111318] p-4 text-sm text-[#64748B] leading-relaxed">
                          {detail.summary}
                        </div>
                      </div>
                    )}

                    {/* Transcript */}
                    {detail.transcript && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="size-3.5 text-[#64748B]" />
                          <p className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-widest">
                            Transcript
                          </p>
                        </div>
                        <div className="rounded-lg border border-[#1E2128] bg-[#111318] p-4 max-h-56 overflow-y-auto text-xs text-[#64748B] leading-relaxed whitespace-pre-wrap font-mono">
                          {detail.transcript}
                        </div>
                      </div>
                    )}

                    {/* Recording */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="size-3.5 text-[#64748B]" />
                        <p className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-widest">
                          Recording
                        </p>
                      </div>
                      {detail.recording_url ? (
                        <audio
                          controls
                          src={detail.recording_url}
                          className="w-full h-10 rounded-lg"
                          style={{ colorScheme: 'dark' }}
                        />
                      ) : (
                        <p className="text-xs text-[#64748B] italic">No recording available</p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
