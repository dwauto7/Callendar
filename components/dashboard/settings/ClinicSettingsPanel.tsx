'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SystemModeToggle } from '@/components/dashboard/settings/SystemModeToggle'
import { useClinicSettings } from '@/lib/hooks/useClinicSettings'

type AnsweringMode = 'always_on' | 'after_hours' | 'disabled'

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

export function ClinicSettingsPanel() {
  const { settings, role, updateSettings, loading, error } = useClinicSettings()
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [aiName, setAiName] = useState('')
  const [aiTone, setAiTone] = useState('')
  const [answeringMode, setAnsweringMode] = useState<AnsweringMode>('always_on')
  const [openTime, setOpenTime] = useState('09:00')
  const [closeTime, setCloseTime] = useState('18:00')
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri'])
  const [timezone, setTimezone] = useState('Asia/Kuala_Lumpur')
  const [emergencyContact, setEmergencyContact] = useState('')

  useEffect(() => {
    if (!settings) return
    setAiName(String(settings.ai_name ?? 'Aya'))
    setAiTone(String(settings.ai_tone ?? 'Professional, warm, concise'))
    const mode = settings.answering_mode as AnsweringMode | undefined
    setAnsweringMode(mode ?? 'always_on')
    const rawHours = typeof settings.working_hours === 'string' ? settings.working_hours : ''
    if (rawHours.includes('-')) {
      const [start, end] = rawHours.split('-').map((s) => s.trim())
      if (start) setOpenTime(start)
      if (end) setCloseTime(end)
    }
    const rawDays = String(settings.working_days ?? '')
    if (rawDays) {
      const parsed = rawDays.split(',').map((d) => d.trim().toLowerCase()).filter(Boolean)
      if (parsed.length > 0) setSelectedDays(parsed)
    }
    setTimezone(String(settings.timezone ?? 'Asia/Kuala_Lumpur'))
    setEmergencyContact(String(settings.emergency_contact ?? ''))
  }, [settings])

  const daysOfWeek = [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' },
  ]

  function toggleDay(value: string) {
    setSelectedDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    )
  }

  async function handleSave() {
    if (role !== 'admin' && role !== 'owner') {
      toast.error('Admin access required to update settings.')
      return
    }
    if (!openTime || !closeTime) {
      toast.error('Please set opening and closing times.')
      return
    }
    if (selectedDays.length === 0) {
      toast.error('Please select at least one working day.')
      return
    }
    setSaving(true)
    try {
      await updateSettings({
        ai_name: aiName || null,
        ai_tone: aiTone || null,
        answering_mode: answeringMode,
        working_hours: `${openTime}-${closeTime}`,
        working_days: selectedDays.join(','),
        timezone: timezone || 'Asia/Kuala_Lumpur',
        emergency_contact: emergencyContact || null,
      })
      toast.success('System settings updated')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update settings'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSyncReports() {
    if (role !== 'admin' && role !== 'owner') {
      toast.error('Admin access required to sync reports.')
      return
    }
    setSyncing(true)
    try {
      const res = await fetch('/api/reports/backfill', {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync reports')
      }
      if (data.monthsProcessed === 0) {
        toast.info('No historical data to backfill')
      } else {
        toast.success(`Synced ${data.monthsProcessed} month(s) of report data`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync reports'
      toast.error(message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
  }

  if (error) {
    return <div className="text-sm text-red-400">Failed to load settings: {error}</div>
  }

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5 space-y-6">
      <SystemModeToggle initialMode={answeringMode} onModeChange={setAnsweringMode} aiName={aiName || 'Your AI'} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            AI Name
          </Label>
          <input
            type="text"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            placeholder="Aya"
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            AI Tone
          </Label>
          <input
            type="text"
            value={aiTone}
            onChange={(e) => setAiTone(e.target.value)}
            placeholder="Professional, warm, concise"
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Opening Time
          </Label>
          <input
            type="time"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className={inputCls + ' [color-scheme:dark]'}
          />
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Closing Time
          </Label>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className={inputCls + ' [color-scheme:dark]'}
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-2 block">
            Working Days
          </Label>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={
                  selectedDays.includes(day.value)
                    ? 'h-9 rounded-lg bg-[#40E0FF]/10 border border-[#40E0FF]/40 text-[#40E0FF] text-[11px] font-bold uppercase'
                    : 'h-9 rounded-lg bg-white/5 border border-white/10 text-white/30 text-[11px] font-bold uppercase hover:border-white/30'
                }
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Timezone
          </Label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Asia/Kuala_Lumpur"
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Emergency Contact
          </Label>
          <input
            type="text"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            placeholder="+6012-0000000"
            className={inputCls}
          />
        </div>
      </div>

      {/* Sync Reports Section */}
      <div className="border-t border-white/10 pt-6">
        <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-3">
          Data Management
        </p>
        <p className="text-xs text-white/50 mb-4">
          Sync historical call logs and appointments to populate monthly reports. Useful for initial setup or recovery.
        </p>
        <Button
          onClick={handleSyncReports}
          disabled={syncing || (role !== 'admin' && role !== 'owner')}
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 px-4"
        >
          {syncing ? 'Syncing...' : 'Sync Report Data'}
        </Button>
      </div>

      {/* Save Settings */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <p className="text-xs text-white/40">
          {role === 'admin' || role === 'owner' ? 'Admin access granted' : 'Read-only access'}
        </p>
        <Button
          onClick={handleSave}
          disabled={saving || role !== 'admin' && role !== 'owner'}
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold px-6"
        >
          {saving ? 'Saving...' : 'Save System Settings'}
        </Button>
      </div>
    </div>
  )
}
