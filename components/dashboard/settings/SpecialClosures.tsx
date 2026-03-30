'use client'

import { useEffect, useState } from 'react'
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
  holiday_date: string | null
  description: string | null
  is_recurring  : boolean
  recurrence_weekday?: string | null
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
  const [newIsRecurring, setNewIsRecurring] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState('sun')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  async function refreshClosures() {
    const { data, error } = await supabase
      .from('clinic_holidays')
      .select('id, holiday_date, description, is_recurring, recurrence_weekday')
      .eq('clinic_config_id', clinicConfigId)
      .order('holiday_date', { ascending: true })

    if (!error) {
      setClosures(data ?? [])
    }
  }

  useEffect(() => {
    refreshClosures()
  }, [clinicConfigId])

  const daysOfWeek = [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' },
  ]

  function nextDateForWeekday(day: string) {
    const map: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
    const target = map[day] ?? 0
    const today = new Date()
    const todayIdx = today.getDay()
    let diff = target - todayIdx
    if (diff <= 0) diff += 7
    const next = new Date(today)
    next.setDate(today.getDate() + diff)
    return next.toISOString().slice(0, 10)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const visibleClosures = closures.filter((closure) => {
    if (closure.is_recurring) return true
    if (!closure.holiday_date) return false
    const date = new Date(closure.holiday_date + 'T00:00:00')
    return date >= today
  })

  async function handleAdd() {
    const dateToUse = newIsRecurring ? nextDateForWeekday(weeklyDay) : newDate
    if (!dateToUse) {
      toast.error('Please select a date')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('clinic_holidays')
      .insert({
        clinic_config_id: clinicConfigId,
        holiday_date: dateToUse,
        description: newReason || null,
        is_recurring: newIsRecurring,
        recurrence_weekday: newIsRecurring ? weeklyDay : null,
      })
    setSaving(false)

    if (error) {
      toast.error('Failed to add closure')
    } else {
      await refreshClosures()
      setDialogOpen(false)
      setNewDate('')
      setNewReason('')
      setNewIsRecurring(false)
      setWeeklyDay('sun')
      toast.success('Closure inserted successfully')
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const { error } = await supabase
      .from('clinic_holidays')
      .delete()
      .eq('id', id)
      .eq('clinic_config_id', clinicConfigId)
    setDeleting(null)
    if (error) {
      toast.error('Failed to delete')
    } else {
      await refreshClosures()
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
            {visibleClosures
              .sort((a, b) => (a.holiday_date ?? '').localeCompare(b.holiday_date ?? ''))
              .map((closure) => (
                <div
                  key={closure.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#161B22] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-[#F1F5F9]">
                        {fmtDate(closure.holiday_date)}
                      </p>
                      {closure.description && (
                        <p className="text-xs text-[#64748B] mt-0.5 truncate max-w-[260px]">
                          {closure.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={
                        closure.is_recurring
                          ? 'bg-[#10B981]/15 text-[#F59E0B] border-0 text-[10px] font-bold uppercase'
                          : 'bg-[#64748B]/15 text-[#64748B] border-0 text-[10px] font-bold uppercase'
                      }
                    >
                      {closure.is_recurring
                        ? `Weekly: ${(closure.recurrence_weekday ?? 'sun').toUpperCase()}`
                        : 'One-off'}
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
              <Label className="text-sm text-[#F1F5F9]">Weekly recurrence</Label>
              <Switch
                checked={newIsRecurring}
                onCheckedChange={setNewIsRecurring}
                className="data-[state=checked]:bg-[#10B981]"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/40 uppercase tracking-widest">Quick shortcut</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewIsRecurring(true)
                  setWeeklyDay('sun')
                }}
                className="h-8 border-white/10 bg-white/5 text-white text-xs"
              >
                Close Every Sunday
              </Button>
            </div>
            {newIsRecurring ? (
              <div>
                <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-2 block">
                  Repeat every
                </Label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => setWeeklyDay(day.value)}
                      className={
                        weeklyDay === day.value
                          ? 'h-9 rounded-lg bg-[#40E0FF]/10 border border-[#40E0FF]/40 text-[#40E0FF] text-[11px] font-bold uppercase'
                          : 'h-9 rounded-lg bg-white/5 border border-white/10 text-white/30 text-[11px] font-bold uppercase hover:border-white/30'
                      }
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/40 mt-2">
                  We will close every {weeklyDay.toUpperCase()}.
                </p>
              </div>
            ) : null}
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
