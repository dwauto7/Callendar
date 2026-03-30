'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

export function DoctorProfileNewForm({
  clinicConfigId,
}: {
  clinicConfigId: string
}) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('doctor')
  const [calendarId, setCalendarId] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!displayName.trim()) {
      toast.error('Display name is required')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('clinic_profiles')
      .insert({
        clinic_config_id: clinicConfigId,
        display_name: displayName.trim(),
        role,
        google_calendar_id: calendarId || null,
      })
      .select('id')
      .single()

    setSaving(false)
    if (error || !data?.id) {
      toast.error('Failed to create profile')
      return
    }
    toast.success('Profile created')
    router.push(`/dashboard/doctors/${data.id}`)
  }

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5 space-y-4">
      <div>
        <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
          Display Name
        </Label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={inputCls}
          placeholder="Dr. Aisyah Karim"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Role
          </Label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls}
          >
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
        <div>
          <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
            Google Calendar ID
          </Label>
          <input
            type="text"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            className={inputCls}
            placeholder="calendar@group.calendar.google.com"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleCreate}
          disabled={saving}
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold px-6"
        >
          {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
          {saving ? 'Creating…' : 'Create Profile'}
        </Button>
      </div>
    </div>
  )
}
