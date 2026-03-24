'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronRight, Download, Activity } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export type CallLogRow = {
  id: string
  client_name: string | null
  patient_phone: string | null
  duration_min: number | null
  minutes_saved: number | null
  is_after_hours: boolean
  appointment_id: string | null
  clinic_config_id?: string | null
  summary?: string | null
  created_at: string
  recording_url: string | null
}

type TranscriptMessage = {
  role: string
  content: string
}

async function logTranscriptError(message: string, payload?: unknown) {
  try {
    await fetch('/api/error-log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message, payload, source: 'CallsClient' }),
      keepalive: true,
    })
  } catch (error) {
    console.error('Failed to send transcript error log', error)
  }
}

function normalizeTranscript(raw: unknown): TranscriptMessage[] {
  if (typeof raw === 'string' && raw.trim()) {
    const lines = raw.split('\n').filter(Boolean)
    return lines.map((line) => {
      const agentMatch = line.match(/^(agent|aya):\s*(.+)/i)
      const userMatch = line.match(/^(user|patient|caller):\s*(.+)/i)
      if (agentMatch) return { role: 'agent', content: agentMatch[2] }
      if (userMatch) return { role: 'user', content: userMatch[2] }
      return { role: 'agent', content: line }
    })
  }

  let parsed: unknown = raw
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      console.error('Failed to parse transcript string', e)
      void logTranscriptError('Failed to parse transcript JSON', { raw })
      return []
    }
  }

  if (!Array.isArray(parsed)) return []

  return parsed
    .map((item) => {
      if (typeof item === 'string') {
        return { role: 'patient', content: item }
      }
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>
        const role = (record.role ?? record.speaker ?? 'patient')
        const content = (record.content ?? record.text ?? record.message ?? '').toString()
        return { role: String(role), content }
      }
      return null
    })
    .filter((msg): msg is TranscriptMessage => Boolean(msg && msg.content))
}

export function CallsClient({ initialCalls }: { initialCalls: CallLogRow[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CallLogRow | null>(null)
  const [detail, setDetail] = useState<{ transcript: TranscriptMessage[], summary: string | null } | null>(null)
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [filterAfterHours, setFilterAfterHours] = useState(false)

  const filtered = useMemo(() => {
    return initialCalls.filter((c) => {
      const nameMatch = (c.client_name?.toLowerCase() || '').includes(search.toLowerCase())
      const phoneMatch = (c.patient_phone || '').includes(search)
      const matchesSearch = nameMatch || phoneMatch
      const matchesFilter = filterAfterHours ? c.is_after_hours : true
      return matchesSearch && matchesFilter
    })
  }, [initialCalls, search, filterAfterHours])

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Phone", "Duration", "After Hours", "Impact"]
    const rows = filtered.map(c => [
      new Date(c.created_at).toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
      c.client_name || "Unknown",
      c.patient_phone || "N/A",
      `${c.duration_min?.toFixed(1)}m`,
      c.is_after_hours ? "YES" : "NO",
      `+${c.minutes_saved}m`
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Aya_Logs_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  async function handleOpen(call: CallLogRow) {
    setSelected(call)
    setOpen(true)
    setLoading(true)

    if (call.summary) {
      setDetail({
        transcript: [],
        summary: call.summary ?? null,
      })
    }

    const supabase = createClient()
    const { data } = await supabase
      .from('call_logs')
      .select('transcript, summary')
      .eq('clinic_config_id', call.clinic_config_id ?? null)
      .eq('id', call.id)
      .single()

    setDetail({
      transcript: normalizeTranscript(data?.transcript),
      summary: data?.summary || null
    })
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 glass-panel rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/20" />
          <Input
            placeholder="Search signals..."
            className="w-full bg-black/20 border-white/5 rounded-xl pl-10 h-11 text-white focus-visible:ring-[#40E0FF]/30 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-black/20 border border-white/5 flex-1 md:flex-none">
            <Switch checked={filterAfterHours} onCheckedChange={setFilterAfterHours} />
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer">After-Hours</Label>
          </div>

          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="h-11 px-4 bg-white/5 border-white/5 hover:bg-[#40E0FF]/10 hover:text-[#40E0FF] transition-all rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="size-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="glass-panel rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01] p-0">
        <CardHeader className="px-6 py-4 border-b border-white/5">
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 text-[10px] font-black uppercase text-white/20">
            <span>Caller / Timestamp</span>
            <span className="text-center">Duration</span>
            <span className="text-center">Saved</span>
            <span></span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="sr-only">
                <TableHead>Caller</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Saved</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-24">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse">
                        <Activity className="size-8 text-white/10" />
                      </div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">Monitoring Live Stream...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((call) => (
                  <TableRow
                    key={call.id}
                    onClick={() => handleOpen(call)}
                    className="group cursor-pointer hover:bg-[#40E0FF]/[0.03] transition-all"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="text-left flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#40E0FF] transition-colors">
                          {call.client_name || 'Anonymous Signal'}
                        </span>
                        <span className="text-[10px] font-mono text-white/30">
                          {new Date(call.created_at).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono text-white/60">
                      {call.duration_min?.toFixed(1)}m
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[9px] font-black">
                        +{call.minutes_saved}m
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <ChevronRight className="size-4 text-white/10 group-hover:translate-x-1 transition-transform" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="bg-[#0A0A0B] border-l border-white/10 text-white sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
            <SheetTitle className="text-2xl font-bold tracking-tighter text-white">Interaction Data</SheetTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-white/10 text-white/40">{selected?.patient_phone}</Badge>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {loading ? (
              <div className="h-40 animate-pulse bg-white/5 rounded-xl" />
            ) : (
              <>
                {/* Transcript FIRST */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Live Stream Transcript</h4>
                    <Badge className="bg-white/5 text-white/40 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                      Aya Voice Log
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {detail?.transcript && detail.transcript.length > 0 ? (
                      detail.transcript.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex flex-col max-w-[85%]',
                            msg.role === 'agent' ? 'mr-auto' : 'ml-auto items-end'
                          )}
                        >
                          <Badge
                            className={cn(
                              'mb-2 text-[9px] font-black uppercase tracking-widest',
                              msg.role === 'agent'
                                ? 'bg-white/5 text-white/40 border border-white/10'
                                : 'bg-[#40E0FF]/10 text-[#40E0FF] border border-[#40E0FF]/20'
                            )}
                          >
                            {msg.role === 'agent' ? 'Aya' : 'Patient'}
                          </Badge>
                          <div
                            className={cn(
                              'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
                              msg.role === 'agent'
                                ? 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'
                                : 'bg-[#40E0FF]/10 border border-[#40E0FF]/20 text-[#40E0FF] rounded-tr-none'
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-white/20 italic text-center py-4">No transcript available.</p>
                    )}
                  </div>
                </div>

                {/* Summary SECOND */}
                <Card className="glass-panel border border-white/10 bg-white/[0.03]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black uppercase text-[#40E0FF] tracking-widest">
                      Aya Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      {detail?.summary || 'Analyzing interaction...'}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}