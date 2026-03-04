'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2 } from 'lucide-react'

interface ClinicConfig {
  id: string
  clinic_name: string | null
  owner_phone: string | null
  whatsapp_number: string | null
  working_hours: string | null
  working_days: string | null
  timezone: string | null
  emergency_contact: string | null
  agent_id: string | null
  google_calendar_id: string | null
  is_active: boolean
}

interface SettingsFormProps {
  config: ClinicConfig
}

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

const fieldGroups = [
  {
    heading: 'Clinic Info',
    fields: [
      { key: 'clinic_name', label: 'Clinic Name', placeholder: 'Klinik Sejahtera Utama' },
      { key: 'owner_phone', label: 'Owner Phone', placeholder: '+6012-3456789' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+6012-3456789' },
    ],
  },
  {
    heading: 'Operations',
    fields: [
      { key: 'working_hours', label: 'Working Hours', placeholder: '9:00 AM – 5:00 PM' },
      { key: 'working_days', label: 'Working Days', placeholder: 'Mon – Fri' },
      { key: 'timezone', label: 'Timezone', placeholder: 'Asia/Kuala_Lumpur' },
      { key: 'emergency_contact', label: 'Emergency Contact', placeholder: '+6012-0000000' },
    ],
  },
  {
    heading: 'Integrations',
    fields: [
      { key: 'google_calendar_id', label: 'Google Calendar ID', placeholder: 'clinic@gmail.com' },
      { key: 'agent_id', label: 'Retell Agent ID', placeholder: 'agent_xxx', readonly: true },
    ],
  },
] as const

type FieldKey = 'clinic_name' | 'owner_phone' | 'whatsapp_number' | 'working_hours' | 'working_days' | 'timezone' | 'emergency_contact' | 'google_calendar_id' | 'agent_id'

export function SettingsForm({ config }: SettingsFormProps) {
  const [form, setForm] = useState<Record<string, string>>({
    clinic_name: config.clinic_name ?? '',
    owner_phone: config.owner_phone ?? '',
    whatsapp_number: config.whatsapp_number ?? '',
    working_hours: config.working_hours ?? '',
    working_days: config.working_days ?? '',
    timezone: config.timezone ?? 'Asia/Kuala_Lumpur',
    emergency_contact: config.emergency_contact ?? '',
    agent_id: config.agent_id ?? '',
    google_calendar_id: config.google_calendar_id ?? '',
  })
  const [isActive, setIsActive] = useState(config.is_active ?? false)
  const [saving, setSaving] = useState(false)

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('clinic_config')
      .update({
        clinic_name: form.clinic_name || null,
        owner_phone: form.owner_phone || null,
        whatsapp_number: form.whatsapp_number || null,
        working_hours: form.working_hours || null,
        working_days: form.working_days || null,
        timezone: form.timezone || 'Asia/Kuala_Lumpur',
        emergency_contact: form.emergency_contact || null,
        google_calendar_id: form.google_calendar_id || null,
        is_active: isActive,
      })
      .eq('id', config.id)

    setSaving(false)
    if (error) {
      toast.error('Failed to save — ' + error.message)
    } else {
      toast.success('Settings saved')
    }
  }

  return (
    <div className="space-y-8">
      {/* Agent active toggle */}
      <div className="flex items-center justify-between rounded-xl border border-[#1E2128] bg-[#111318] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#F1F5F9]">Aya Agent</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {isActive ? 'Active — Aya is answering calls' : 'Inactive — calls are not being answered'}
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-[#10B981]"
        />
      </div>

      {/* Field groups */}
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
                  readOnly={'readonly' in field}
                  className={inputCls + ('readonly' in field ? ' opacity-50 cursor-not-allowed' : '')}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold px-6"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
