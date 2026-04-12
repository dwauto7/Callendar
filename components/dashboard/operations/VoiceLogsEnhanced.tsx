'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  X,
  Play,
  Pause,
  Download,
  FileText,
  Phone,
  Clock,
  ChevronDown,
  Mic,
  ScrollText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TranscriptDrawer } from '@/components/dashboard/operations/TranscriptDrawer'
import type { CallLogRow } from '@/components/dashboard/operations/TranscriptDrawer'

type VoiceLogsEnhancedProps = {
  callLogs: CallLogRow[]
}

type SummaryModalState = {
  call: CallLogRow
}

// ─── Inline Audio Player ──────────────────────────────────────────────────────
function AudioPlayer({ src, callId }: { src: string; callId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime)
      setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0)
    }
    const onLoaded = () => setDuration(el.duration)
    const onEnded = () => setPlaying(false)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('loadedmetadata', onLoaded)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('loadedmetadata', onLoaded)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else { el.play(); setPlaying(true) }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration
  }

  const fmt = (s: number) => {
    if (isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-[#0A0A0C] border border-white/[0.06] rounded-xl px-3 py-2.5">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className="shrink-0 size-8 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center hover:bg-[#2DD4BF]/20 transition-all active:scale-95"
      >
        {playing
          ? <Pause className="size-3.5 text-[#2DD4BF]" />
          : <Play className="size-3.5 text-[#2DD4BF] translate-x-[1px]" />}
      </button>

      <div className="flex-1 space-y-1">
        <div
          className="relative h-1 bg-white/[0.06] rounded-full cursor-pointer group"
          onClick={seek}
        >
          <div className="h-full bg-[#2DD4BF] rounded-full" style={{ width: `${progress}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-2.5 bg-[#2DD4BF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 5px)` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-white/20">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <a
        href={src}
        download={`call-${callId}.wav`}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 size-7 rounded-lg flex items-center justify-center hover:bg-white/[0.05] transition-colors"
        title="Download recording"
      >
        <Download className="size-3.5 text-white/25 hover:text-white/50" />
      </a>
    </div>
  )
}

// ─── Call Row Card ────────────────────────────────────────────────────────────
function CallCard({
  call,
  onSummary,
  onTranscript,
}: {
  call: CallLogRow
  onSummary: (call: CallLogRow) => void
  onTranscript: (call: CallLogRow) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur', })

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur', })

  const hasActions = !!call.recording_url || !!call.summary

  return (
    <div className={cn(
      'group border border-white/[0.04] rounded-xl overflow-hidden transition-all duration-200',
      expanded ? 'bg-[#111115] border-white/[0.08]' : 'bg-transparent hover:bg-[#0D0D11] hover:border-white/[0.06]'
    )}>
      {/* Main Row */}
      <div
        className="flex items-center gap-4 px-4 py-3.5 cursor-pointer"
        onClick={() => hasActions && setExpanded(v => !v)}
      >
        <div className="shrink-0 size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
          <Mic className="size-3.5 text-white/20" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white/85 truncate">
              {call.client_name || 'Unknown Caller'}
            </p>
            {call.is_after_hours && (
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/15">
                After Hrs
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {call.patient_phone && (
              <>
                <span className="flex items-center gap-1 text-[11px] text-white/30">
                  <Phone className="size-2.5" />
                  {call.patient_phone}
                </span>
                <span className="text-white/15 text-xs">·</span>
              </>
            )}
            <span className="text-[11px] text-white/25">
              {formatDate(call.created_at)} at {formatTime(call.created_at)}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.05]">
            <Clock className="size-3 text-white/20" />
            <span className="text-[11px] font-mono text-white/40">
              {call.duration_min?.toFixed(1) ?? '0'}m
            </span>
          </div>

          {hasActions && (
            <div className={cn(
              'size-6 rounded-lg flex items-center justify-center transition-all duration-200',
              expanded ? 'bg-[#2DD4BF]/10' : 'bg-white/[0.03]'
            )}>
              <ChevronDown className={cn(
                'size-3.5 transition-transform duration-200',
                expanded ? 'rotate-180 text-[#2DD4BF]' : 'text-white/20'
              )} />
            </div>
          )}
        </div>
      </div>

      {/* Expanded Panel */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-3">
          {/* Audio Player */}
          {call.recording_url && (
            <AudioPlayer src={call.recording_url} callId={call.id} />
          )}

          {/* Summary block with transcript link */}
          {call.summary && (
            <div className="bg-[#0A0A0C] border border-white/[0.06] rounded-xl p-3 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/20">
                AI Summary
              </p>
              <p className="text-xs text-white/50 leading-relaxed line-clamp-2 italic">
                {call.summary}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onSummary(call)}
                  className="flex items-center gap-1.5 text-[11px] text-[#2DD4BF]/60 hover:text-[#2DD4BF] transition-colors font-medium"
                >
                  <FileText className="size-3" />
                  Full summary
                </button>
                <span className="text-white/10">|</span>
                <button
                  onClick={() => onTranscript(call)}
                  className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors font-medium"
                >
                  <ScrollText className="size-3" />
                  View transcript
                </button>
              </div>
            </div>
          )}

          {/* Transcript-only fallback (no summary) */}
          {!call.summary && (
            <button
              onClick={() => onTranscript(call)}
              className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors font-medium"
            >
              <ScrollText className="size-3" />
              View transcript
            </button>
          )}

          {call.minutes_saved != null && (
            <p className="text-[10px] text-white/20 font-mono">
              {call.minutes_saved.toFixed(1)} staff minutes saved on this call
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Summary Modal ────────────────────────────────────────────────────────────
function SummaryModal({ state, onClose }: { state: SummaryModalState; onClose: () => void }) {
  const { call } = state

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur', })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#0A0A0B] border border-[#1E1E26] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Call Summary</p>
            <h2 className="text-base font-bold text-white leading-tight">
              {call.client_name || 'Unknown Caller'}
            </h2>
            <p className="text-xs text-white/30 mt-0.5">{formatDate(call.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 size-8 rounded-xl hover:bg-white/[0.05] flex items-center justify-center transition-colors mt-0.5"
          >
            <X className="size-4 text-white/30" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Duration', value: `${call.duration_min?.toFixed(1) ?? '0'} min` },
              { label: 'Mins Saved', value: `${call.minutes_saved?.toFixed(1) ?? '0'} min` },
              { label: 'Time', value: call.is_after_hours ? 'After Hours' : 'Business Hrs' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111115] border border-white/[0.05] rounded-xl p-3 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/20 mb-1.5">{stat.label}</p>
                <p className="text-sm font-semibold text-white/80">{stat.value}</p>
              </div>
            ))}
          </div>

          {call.patient_phone && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111115] border border-white/[0.05]">
              <Phone className="size-3.5 text-white/20" />
              <span className="text-xs text-white/40 font-mono">{call.patient_phone}</span>
              {call.is_after_hours && (
                <span className="ml-auto text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/15">
                  After Hrs
                </span>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">AI Summary</p>
            <div className="bg-[#111115] border border-white/[0.05] rounded-xl p-4">
              <p className="text-sm text-white/65 leading-relaxed italic">
                {call.summary || 'No summary available for this call.'}
              </p>
            </div>
          </div>

          {call.recording_url && (
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">Recording</p>
              <AudioPlayer src={call.recording_url} callId={call.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function VoiceLogsEnhanced({ callLogs }: VoiceLogsEnhancedProps) {
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [summaryModal, setSummaryModal] = useState<SummaryModalState | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Transcript drawer
  const [transcriptCall, setTranscriptCall] = useState<CallLogRow | null>(null)
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  const deferredName = useDeferredValue(searchName)
  const deferredPhone = useDeferredValue(searchPhone)
  const deferredDateFrom = useDeferredValue(dateFrom)
  const deferredDateTo = useDeferredValue(dateTo)

  const hasActiveFilters = !!(searchName || searchPhone || dateFrom || dateTo)

  const filteredLogs = useMemo(() => {
    return callLogs.filter(call => {
      const nameMatch = !deferredName ||
        (call.client_name?.toLowerCase().includes(deferredName.toLowerCase()) ?? false)
      const phoneMatch = !deferredPhone ||
        (call.patient_phone?.includes(deferredPhone) ?? false)
      let dateMatch = true
      if (deferredDateFrom || deferredDateTo) {
        const callDate = new Date(call.created_at)
        if (deferredDateFrom) dateMatch = dateMatch && callDate >= new Date(deferredDateFrom + 'T00:00:00')
        if (deferredDateTo) dateMatch = dateMatch && callDate <= new Date(deferredDateTo + 'T23:59:59')
      }
      return nameMatch && phoneMatch && dateMatch
    })
  }, [callLogs, deferredName, deferredPhone, deferredDateFrom, deferredDateTo])

  const clearAll = () => {
    setSearchName('')
    setSearchPhone('')
    setDateFrom('')
    setDateTo('')
  }

  const openTranscript = (call: CallLogRow) => {
    setTranscriptCall(call)
    setTranscriptOpen(true)
  }

  return (
    <>
      <div className="bg-[#0D0D11] border border-[#1A1A22] rounded-2xl overflow-hidden flex flex-col">

        {/* ── Header ── */}
        <div className="px-5 py-3.5 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-6 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/15 flex items-center justify-center">
              <Mic className="size-3 text-[#2DD4BF]/60" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/30">Voice Logs</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/15">
              {filteredLogs.length} / {callLogs.length}
            </span>
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border',
                hasActiveFilters
                  ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF]/80'
                  : 'bg-white/[0.03] border-white/[0.05] text-white/30 hover:text-white/50'
              )}
            >
              <Search className="size-3" />
              Filter
              {hasActiveFilters && (
                <span className="size-4 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] text-[9px] font-black flex items-center justify-center">
                  {[searchName, searchPhone, dateFrom || dateTo].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        {filtersOpen && (
          <div className="px-5 py-4 border-b border-white/[0.04] space-y-3 bg-[#0A0A0D]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-white/15 pointer-events-none" />
                <input
                  placeholder="Search name…"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  className="w-full pl-8 pr-8 h-8 bg-[#111115] border border-white/[0.06] rounded-lg text-white/70 placeholder:text-white/20 text-xs focus:outline-none focus:border-[#2DD4BF]/30 transition-colors"
                />
                {searchName && (
                  <button onClick={() => setSearchName('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="size-3 text-white/25 hover:text-white/50" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-white/15 pointer-events-none" />
                <input
                  placeholder="Search phone…"
                  value={searchPhone}
                  onChange={e => setSearchPhone(e.target.value)}
                  className="w-full pl-8 pr-8 h-8 bg-[#111115] border border-white/[0.06] rounded-lg text-white/70 placeholder:text-white/20 text-xs focus:outline-none focus:border-[#2DD4BF]/30 transition-colors"
                />
                {searchPhone && (
                  <button onClick={() => setSearchPhone('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="size-3 text-white/25 hover:text-white/50" />
                  </button>
                )}
              </div>

              <div className="relative">
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider text-white/15 pointer-events-none">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full pl-12 pr-3 h-8 bg-[#111115] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none focus:border-[#2DD4BF]/30 transition-colors"
                />
              </div>

              <div className="relative">
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider text-white/15 pointer-events-none">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full pl-12 pr-3 h-8 bg-[#111115] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none focus:border-[#2DD4BF]/30 transition-colors"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1"
              >
                <X className="size-2.5" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Log List ── */}
        <div className="flex-1 overflow-y-auto max-h-[600px] p-3 space-y-1.5">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                <Mic className="size-5 text-white/10" />
              </div>
              <p className="text-xs text-white/20 uppercase tracking-widest font-semibold">
                {callLogs.length === 0 ? 'No voice logs yet' : 'No results'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-[11px] text-[#2DD4BF]/50 hover:text-[#2DD4BF]/80 transition-colors">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredLogs.map(call => (
              <CallCard
                key={call.id}
                call={call}
                onSummary={c => setSummaryModal({ call: c })}
                onTranscript={openTranscript}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {hasActiveFilters && filteredLogs.length > 0 && (
          <div className="px-5 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-[10px] text-white/20">
              Showing {filteredLogs.length} of {callLogs.length} calls
            </p>
            <button onClick={clearAll} className="text-[10px] text-white/25 hover:text-[#2DD4BF]/60 transition-colors">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Summary Modal ── */}
      {summaryModal && (
        <SummaryModal state={summaryModal} onClose={() => setSummaryModal(null)} />
      )}

      {/* ── Transcript Drawer ── */}
      <TranscriptDrawer
        call={transcriptCall}
        open={transcriptOpen}
        onOpenChange={(open) => {
          setTranscriptOpen(open)
          if (!open) setTranscriptCall(null)
        }}
      />
    </>
  )
}