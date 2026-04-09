'use client'

import { useMemo, useState } from 'react'
import { Search, PhoneCall } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import type { CallLogRow } from '@/components/dashboard/operations/TranscriptDrawer'

interface CreditsLogsClientProps {
  calls: CallLogRow[]
  onSelectCall: (call: CallLogRow) => void
}

export function CreditsLogsClient({ calls, onSelectCall }: CreditsLogsClientProps) {
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(20)

  const filtered = useMemo(() => {
    if (!search) return calls
    const query = search.toLowerCase()
    return calls.filter(
      (c) =>
        (c.client_name || '').toLowerCase().includes(query) ||
        (c.patient_phone || '').includes(query)
    )
  }, [calls, search])

  return (
    <div className="glass-panel rounded-3xl border border-[#212129] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#212129] bg-black/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="size-4 text-[#2DD4BF]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Voice Logs
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Badge className="bg-black/20 text-white/50 border border-[#212129]">
            {filtered.length} logs
          </Badge>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-[#212129]">
        <div className="flex items-center gap-3">
          <Search className="size-4 text-white/30" />
          <Input
            placeholder="Search calls..."
            className="bg-black/20 border-[#212129] rounded-xl h-10 text-white focus-visible:ring-[#2DD4BF]/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center text-xs text-white/30">
            No voice logs found.
          </div>
        ) : (
          filtered.slice(0, visible).map((call) => (
            <button
              key={call.id}
              onClick={() => onSelectCall(call)}
              className="w-full text-left px-6 py-4 hover:bg-[#121216] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {call.client_name || 'Anonymous Signal'}
                  </p>
                  <p className="text-[10px] text-white/30 truncate">
                    {call.patient_phone || '—'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-white/30">
                    {formatDateTime(call.created_at)}
                  </p>
                  <p className="text-xs text-white/60">
                    {call.duration_min?.toFixed(1)}m
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {filtered.length > visible && (
        <div className="px-6 py-3 border-t border-[#212129] bg-black/20 flex justify-center">
          <button
            className="text-[10px] uppercase tracking-widest font-black text-[#2DD4BF] hover:text-white transition-colors"
            onClick={() => setVisible((prev) => prev + 60)}
          >
            Load more logs
          </button>
        </div>
      )}
    </div>
  )
}

