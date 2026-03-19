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
  const [aiName, setAiName] = useState('')
  const [aiTone, setAiTone] = useState('')
  const [answeringMode, setAnsweringMode] = useState<AnsweringMode>('always_on')

  useEffect(() => {
    if (!settings) return
    setAiName(String(settings.ai_name ?? 'Aya'))
    setAiTone(String(settings.ai_tone ?? 'Professional, warm, concise'))
    const mode = settings.answering_mode as AnsweringMode | undefined
    setAnsweringMode(mode ?? 'always_on')
  }, [settings])

  async function handleSave() {
    if (role !== 'owner') {
      toast.error('Owner access required to update settings.')
      return
    }
    setSaving(true)
    try {
      await updateSettings({
        ai_name: aiName || null,
        ai_tone: aiTone || null,
        answering_mode: answeringMode,
      })
      toast.success('System settings updated')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update settings'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
  }

  if (error) {
    return <div className="text-sm text-red-400">Failed to load settings: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5">
        <SystemModeToggle initialMode={answeringMode} onModeChange={setAnsweringMode} />
      </div>

      <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5 space-y-4">
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
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">
          {role === 'owner' ? 'Owner access granted' : 'Read-only access'}
        </p>
        <Button
          onClick={handleSave}
          disabled={saving || role !== 'owner'}
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold px-6"
        >
          {saving ? 'Saving...' : 'Save System Settings'}
        </Button>
      </div>
    </div>
  )
}
