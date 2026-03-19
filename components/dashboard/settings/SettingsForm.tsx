'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import { useClinicContext } from '@/components/providers/ClinicProvider'

interface ClinicSettingsConfig {
  clinic_config_id: string
  working_hours: Record<string, string> | string | null
  working_days: string | null
  timezone: string | null
  emergency_contact: string | null
}

interface SettingsFormProps {
  config: ClinicSettingsConfig
}

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

const fieldGroups = [
  {
    heading: 'Operations',
    fields: [
      { key: 'working_hours', label: 'Working Hours (JSON or Range)', placeholder: '09:00-18:00 or {"mon":"09:00-18:00"}' },
      { key: 'working_days', label: 'Working Days', placeholder: 'Mon - Fri' },
      { key: 'timezone', label: 'Timezone', placeholder: 'Asia/Kuala_Lumpur' },
      { key: 'emergency_contact', label: 'Emergency Contact', placeholder: '+6012-0000000' },
    ],
  },
] as const

type FieldKey = 'working_hours' | 'working_days' | 'timezone' | 'emergency_contact'

function stringifyWorkingHours(value: Record<string, string> | string | null) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

export function SettingsForm({ config }: SettingsFormProps) {
  const { role } = useClinicContext()
  const [form, setForm] = useState<Record<string, string>>({
    working_hours: stringifyWorkingHours(config.working_hours),
    working_days: config.working_days ?? '',
    timezone: config.timezone ?? 'Asia/Kuala_Lumpur',
    emergency_contact: config.emergency_contact ?? '',
  })
  const [saving, setSaving] = useState(false)

  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

  function normalizeTimePart(value: string) {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return null
    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (hours > 23 || minutes > 59) return null
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  function normalizeRange(value: string) {
    const parts = value.split('-').map((part) => part.trim())
    if (parts.length !== 2) return null
    const start = normalizeTimePart(parts[0])
    const end = normalizeTimePart(parts[1])
    if (!start || !end) return null
    return `${start}-${end}`
  }

  function parseWorkingDays(value: string) {
    const normalized = value.toLowerCase()
    const days: string[] = []
    if (/mon\s*-\s*fri|mon\s*to\s*fri/.test(normalized)) {
      days.push('mon', 'tue', 'wed', 'thu', 'fri')
    } else {
      if (normalized.includes('mon')) days.push('mon')
      if (normalized.includes('tue')) days.push('tue')
      if (normalized.includes('wed')) days.push('wed')
      if (normalized.includes('thu')) days.push('thu')
      if (normalized.includes('fri')) days.push('fri')
      if (normalized.includes('sat')) days.push('sat')
      if (normalized.includes('sun')) days.push('sun')
    }
    return days.length > 0 ? days : ['mon', 'tue', 'wed', 'thu', 'fri']
  }

  function normalizeWorkingHoursJson() {
    const raw = form.working_hours.trim()
    if (!raw) return null

    if (raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw) as Record<string, string>
        for (const key of Object.keys(parsed)) {
          const value = parsed[key]
          if (typeof value !== 'string' || !normalizeRange(value)) {
            return { error: `Invalid time range for ${key}. Use HH:MM-HH:MM.` }
          }
        }
        return { value: parsed }
      } catch {
        return { error: 'Working hours JSON is invalid.' }
      }
    }

    const range = normalizeRange(raw)
    if (!range) {
      return { error: 'Working hours must be JSON or a time range like 09:00-18:00.' }
    }

    const days = parseWorkingDays(form.working_days)
    const payload: Record<string, string> = {}
    for (const day of dayOrder) {
      if (days.includes(day)) payload[day] = range
    }
    return { value: payload }
  }

  function parseTimeString(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return null
    const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
    if (!match) return null
    let hours = Number(match[1])
    const minutes = Number(match[2] ?? '0')
    const meridiem = match[3]?.toUpperCase()
    if (meridiem === 'PM' && hours < 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
  }

  function formatWorkingHours(value: string) {
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value) as Record<string, string>
        const sample = parsed.mon || parsed.tue || parsed.wed || parsed.thu || parsed.fri
        if (!sample) return null
        return `Sample (Mon): ${sample}`
      } catch {
        return null
      }
    }

    const parts = value.split('-').map((part) => part.trim())
    if (parts.length !== 2) return null
    const start = parseTimeString(parts[0])
    const end = parseTimeString(parts[1])
    if (!start || !end) return null
    const base = new Date()
    const startDate = new Date(base)
    startDate.setHours(start.hours, start.minutes, 0, 0)
    const endDate = new Date(base)
    endDate.setHours(end.hours, end.minutes, 0, 0)
    const formatter = new Intl.DateTimeFormat('en-MY', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kuala_Lumpur',
    })
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
  }

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (role !== 'owner') {
      toast.error('Owner access required to update settings.')
      return
    }
    const workingHoursResult = normalizeWorkingHoursJson()
    if (workingHoursResult && 'error' in workingHoursResult) {
      toast.error(workingHoursResult.error)
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('clinic_settings')
      .upsert(
        {
          clinic_config_id: config.clinic_config_id,
          working_hours: workingHoursResult?.value ?? null,
          working_days: form.working_days || null,
          timezone: form.timezone || 'Asia/Kuala_Lumpur',
          emergency_contact: form.emergency_contact || null,
        },
        { onConflict: 'clinic_config_id' }
      )

    setSaving(false)
    if (error) {
      toast.error('Failed to save - ' + error.message)
    } else {
      toast.success('Settings saved')
    }
  }

  return (
    <div className="space-y-8">
      {fieldGroups.map((group) => (
        <div key={group.heading} className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1E2128]">
            <p
              className="text-sm font-semibold text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {group.heading}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
            {group.fields.map((field) => (
              <div key={field.key}>
                <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
                  {field.label}
                </Label>
                <input
                  type="text"
                  value={form[field.key as FieldKey]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputCls}
                />
                {field.key === 'working_hours' && form.working_hours ? (
                  <p className="mt-1 text-[11px] text-[#64748B]">
                    {formatWorkingHours(form.working_hours)
                      ? `Local time (en-MY): ${formatWorkingHours(form.working_hours)}`
                      : 'Provide JSON or a time range like 09:00-18:00.'}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || role !== 'owner'}
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold px-6"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}