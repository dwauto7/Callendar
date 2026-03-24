'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      body: JSON.stringify({ message, payload, source: 'TranscriptDrawer' }),
      keepalive: true,
    })
  } catch (error) {
    console.error('Failed to send transcript error log', error)
  }
}

function normalizeTranscript(raw: unknown): TranscriptMessage[] {
  // If raw is null or undefined, return empty array
  if (!raw) return []
  
  // Handle string input
  if (typeof raw === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
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
    } catch (e) {
      // Not valid JSON, treat as plain text transcript
      console.log('Transcript is plain text, parsing as conversation format')
      
      // Handle plain text format like "Agent: Hi there\nPatient: Hello"
      const lines = raw.split('\n')
      const messages: TranscriptMessage[] = []
      
      for (const line of lines) {
        if (!line.trim()) continue
        
        // Check for common formats: "Agent: ..." or "Patient: ..."
        const agentMatch = line.match(/^Agent:\s*(.+)$/i)
        const patientMatch = line.match(/^Patient:\s*(.+)$/i)
        
        if (agentMatch) {
          messages.push({ role: 'agent', content: agentMatch[1].trim() })
        } else if (patientMatch) {
          messages.push({ role: 'patient', content: patientMatch[1].trim() })
        } else {
          // If no prefix found, treat as patient message
          messages.push({ role: 'patient', content: line.trim() })
        }
      }
      
      return messages.length > 0 ? messages : [{ role: 'patient', content: raw }]
    }
  }

  // Handle array input
  if (Array.isArray(raw)) {
    return raw
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

  return []
}

export function TranscriptDrawer({
  call,
  open,
  onOpenChange,
}: {
  call: CallLogRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [detail, setDetail] = useState<{ transcript: TranscriptMessage[]; summary: string | null } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !call) {
      setDetail(null)
      return
    }
    let active = true

    async function load() {
      setLoading(true)
      
      // If call already has summary, use it
      if (call?.summary) {
        setDetail({ transcript: [], summary: call.summary ?? null })
      }
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('call_logs')
        .select('transcript, summary')
        .eq('id', call?.id)
        .single()

      if (!active) return
      
      if (error) {
        console.error('Error loading transcript:', error)
        setDetail({
          transcript: [],
          summary: call?.summary || 'Failed to load transcript data',
        })
      } else {
        setDetail({
          transcript: normalizeTranscript(data?.transcript),
          summary: data?.summary || call?.summary || null,
        })
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [open, call])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#0A0A0B] border-l border-white/10 text-white sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
          <SheetTitle className="text-2xl font-bold tracking-tighter text-white">
            Interaction Data
          </SheetTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="border-white/10 text-white/40">
              {call?.patient_phone || 'Unknown'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="h-40 animate-pulse bg-white/5 rounded-xl" />
          ) : (
            <>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">
                    Live Stream Transcript
                  </h4>
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
                    <p className="text-xs text-white/20 italic text-center py-4">
                      No transcript available.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}