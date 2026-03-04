'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, CalendarOff, Loader2 } from 'lucide-react'

interface Closure {
  id: string
  date: string | null
  reason: string | null
  is_closed: boolean
  setting_name: string | null
}

interface SpecialClosuresProps {
  closures: Closure[]
  clinicConfigId: string
}

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-MY', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function SpecialClosures({ closures: initial, clinicConfigId }: SpecialClosuresProps) {
  const [closures, setClosures] = useState<Closure[]>(initial)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [newIsClosed, setNewIsClosed] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleAdd() {
    if (!newDate) {
      toast.error('Please select a date')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clinic_settings')
      .insert({
        clinic_config_id: clinicConfigId,
        setting_name: 'special_closure',
        date: newDate,
        reason: newReason || null,
        is_closed: newIsClosed,
      })
      .select()
      .single()
    setSaving(false)

    if (error) {
      toast.error('Failed to add closure — ' + error.message)
    } else {
      setClosures((prev) => [...prev, data])
      setDialogOpen(false)
      setNewDate('')
      setNewReason('')
      setNewIsClosed(true)
      toast.success('Closure date added')
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('clinic_settings').delete().eq('id', id)
    setDeleting(null)
    if (error) {
      toast.error('Failed to delete — ' + error.message)
    } else {
      setClosures((prev) => prev.filter((c) => c.id !== id))
      toast.success('Closure removed')
    }
  }

  return (
    <>
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2128]">
          <div className="flex items-center gap-2">
            <CalendarOff className="size-4 text-[#F59E0B]" />
            <p
              className="text-sm font-semibold text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Special Closures
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="h-8 bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold text-xs"
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Date
          </Button>
        </div>

        {closures.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748B]">
            No special closures set
          </div>
        ) : (
          <div className="divide-y divide-[#1E2128]">
            {closures
              .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
              .map((closure) => (
                <div
                  key={closure.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#161B22] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-[#F1F5F9]">
                        {fmtDate(closure.date)}
                      </p>
                      {closure.reason && (
                        <p className="text-xs text-[#64748B] mt-0.5 truncate max-w-[260px]">
                          {closure.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={
                        closure.is_closed
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border-0 text-[10px] font-bold uppercase'
                          : 'bg-[#64748B]/15 text-[#64748B] border-0 text-[10px] font-bold uppercase'
                      }
                    >
                      {closure.is_closed ? 'Closed' : 'Modified'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(closure.id)}
                      disabled={deleting === closure.id}
                      className="text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                    >
                      {deleting === closure.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add closure dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#111318] border-[#1E2128] text-[#F1F5F9] max-w-sm">
          <DialogHeader>
            <DialogTitle
              className="text-base font-bold"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Add Special Closure
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
                Date
              </Label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={inputCls + ' [color-scheme:dark]'}
              />
            </div>
            <div>
              <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
                Reason
              </Label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Public holiday, staff training…"
                className={inputCls}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#F1F5F9]">Mark as Closed</Label>
              <Switch
                checked={newIsClosed}
                onCheckedChange={setNewIsClosed}
                className="data-[state=checked]:bg-[#10B981]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-[#64748B] hover:text-[#F1F5F9]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold"
            >
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {saving ? 'Adding…' : 'Add Closure'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
