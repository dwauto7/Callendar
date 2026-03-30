'use client'

import React from 'react'
import { submitOnboarding } from './actions'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2, Bot, Clock, Settings2, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2,
} from 'lucide-react'

type FormData = {
  clinic_name: string
  clinic_whatsapp: string
  ai_name: string
  ai_tone: string
  answering_mode: 'always_on' | 'after_hours' | 'disabled'
  working_hours_start: string
  working_hours_end: string
  working_days: string[]
  timezone: string
  whatsapp_reminders_enabled: boolean
  emergency_contact: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMEZONES = ['Asia/Kuala_Lumpur', 'Asia/Singapore', 'Asia/Bangkok', 'Asia/Jakarta']
const TONES = ['Professional', 'Friendly', 'Concise', 'Empathetic']

const STEPS = [
  { id: 1, label: 'Clinic Identity', icon: Building2 },
  { id: 2, label: 'Agent Config',    icon: Bot },
  { id: 3, label: 'Working Hours',   icon: Clock },
  { id: 4, label: 'Extras',         icon: Settings2 },
  { id: 5, label: 'Complete',       icon: CheckCircle2 },
]

const DEFAULT: FormData = {
  clinic_name: '',
  clinic_whatsapp: '',
  ai_name: 'Aya',
  ai_tone: 'Professional',
  answering_mode: 'always_on',
  working_hours_start: '09:00',
  working_hours_end: '18:00',
  working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timezone: 'Asia/Kuala_Lumpur',
  whatsapp_reminders_enabled: true,
  emergency_contact: '',
}

export default function OnboardingPage() {
  const [step, setStep]       = React.useState(1)
  const [form, setForm]       = React.useState<FormData>(DEFAULT)
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState<string | null>(null)
  const router                = useRouter()
  const supabase              = createClient()

  // Check if user already completed onboarding
  React.useEffect(() => {
    async function checkOnboardingStatus() {

      if (step === 5) return // Already completed, no need to check again

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: clinic, error } = await supabase
        .from('clinic_configs')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      // If clinic exists, user already completed onboarding
      if (clinic) {
        router.push('/dashboard/overview')
      }
    }

    checkOnboardingStatus()
  }, [ step])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleDay(day: string) {
    setForm(f => ({
      ...f,
      working_days: f.working_days.includes(day)
        ? f.working_days.filter(d => d !== day)
        : [...f.working_days, day],
    }))
  }

  function canProceed() {
    if (step === 1) return form.clinic_name.trim().length > 0
    if (step === 2) return form.ai_name.trim().length > 0
    if (step === 3) return form.working_days.length > 0
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    try {
      const { error } = await submitOnboarding({
        clinic_name:             form.clinic_name,
        clinic_whatsapp:         form.clinic_whatsapp,
        ai_name:                 form.ai_name,
        ai_tone:                 form.ai_tone,
        answering_mode:          form.answering_mode,
        working_hours_start:     form.working_hours_start,
        working_hours_end:       form.working_hours_end,
        working_days:            form.working_days,
        timezone:                form.timezone,
        whatsapp_reminders_enabled: form.whatsapp_reminders_enabled,
        emergency_contact:       form.emergency_contact,
      })

      if (error) {
        setError(error)
      } else {
        setStep(5)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#40E0FF]/50 transition-all text-sm'
  const labelCls = 'block text-[10px] uppercase tracking-[0.2em] text-[#40E0FF] font-black mb-2'

  return (
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-[#40E0FF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[400px] bg-[#40E0FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg z-10">

        {/* Step indicator */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.slice(0, 4).map((s, i) => {
              const Icon = s.icon
              const active = s.id === step
              const done   = s.id < step
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      'size-9 rounded-xl flex items-center justify-center border transition-all duration-300',
                      done   ? 'bg-[#40E0FF]/20 border-[#40E0FF]/40 text-[#40E0FF]' :
                      active ? 'bg-[#40E0FF]/10 border-[#40E0FF]/30 text-[#40E0FF]' :
                               'bg-white/5 border-white/10 text-white/20',
                    )}>
                      <Icon className="size-4" />
                    </div>
                    <span className={cn(
                      'text-[9px] font-black uppercase tracking-widest hidden sm:block',
                      active ? 'text-[#40E0FF]' : done ? 'text-white/40' : 'text-white/20',
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className={cn('h-px w-8 mb-4 transition-all duration-300', s.id < step ? 'bg-[#40E0FF]/40' : 'bg-white/10')} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}

        <div className="glass-panel rounded-3xl border border-white/10 p-8">

          {/* STEP 1 — Clinic Identity */}
          {step === 1 && (
            <StepShell icon={<Building2 className="size-5 text-[#40E0FF]" />} title="Clinic Identity" subtitle="Basic clinic information for the intelligence node.">
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Clinic Name</label>
                  <input className={inputCls} placeholder="e.g. Insight Chiropractic PJ" value={form.clinic_name} onChange={e => set('clinic_name', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp Number <span className="text-white/20 normal-case tracking-normal font-medium">(optional)</span></label>
                  <input className={inputCls} placeholder="e.g. +60123456789" value={form.clinic_whatsapp} onChange={e => set('clinic_whatsapp', e.target.value)} />
                </div>
              </div>
            </StepShell>
          )}

          {/* STEP 2 — Agent Configuration */}
          {step === 2 && (
            <StepShell icon={<Bot className="size-5 text-[#40E0FF]" />} title="Agent Configuration" subtitle="Configure the AI agent's identity and behaviour.">
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>AI Agent Name</label>
                  <input className={inputCls} placeholder="e.g. Aya" value={form.ai_name} onChange={e => set('ai_name', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Conversation Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map(tone => (
                      <button key={tone} type="button" onClick={() => set('ai_tone', tone)}
                        className={cn('px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all',
                          form.ai_tone === tone ? 'bg-[#40E0FF]/10 border-[#40E0FF]/40 text-[#40E0FF]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20')}>
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Answering Mode</label>
                  <div className="space-y-2">
                    {[
                      { value: 'always_on',   label: '24/7 Availability',  desc: 'Agent answers all calls anytime' },
                      { value: 'after_hours', label: 'After Working Hours', desc: 'Agent answers outside working hours only' },
                      { value: 'disabled',    label: 'Offline',             desc: 'Agent disabled' },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => set('answering_mode', opt.value as FormData['answering_mode'])}
                        className={cn('w-full px-4 py-3 rounded-xl border text-left transition-all',
                          form.answering_mode === opt.value ? 'bg-[#40E0FF]/10 border-[#40E0FF]/40' : 'bg-white/5 border-white/10 hover:border-white/20')}>
                        <p className={cn('text-xs font-black uppercase tracking-widest', form.answering_mode === opt.value ? 'text-[#40E0FF]' : 'text-white/50')}>{opt.label}</p>
                        <p className="text-[10px] text-white/20 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepShell>
          )}

          {/* STEP 3 — Working Hours */}
          {step === 3 && (
            <StepShell icon={<Clock className="size-5 text-[#40E0FF]" />} title="Working Hours" subtitle="Define when the clinic operates.">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Opens</label>
                    <input type="time" className={inputCls} value={form.working_hours_start} onChange={e => set('working_hours_start', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Closes</label>
                    <input type="time" className={inputCls} value={form.working_hours_end} onChange={e => set('working_hours_end', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Working Days</label>
                  <div className="grid grid-cols-4 gap-2">
                    {DAYS.map(day => (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className={cn('py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all',
                          form.working_days.includes(day) ? 'bg-[#40E0FF]/10 border-[#40E0FF]/40 text-[#40E0FF]' : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20')}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Timezone</label>
                  <select className={inputCls} value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                    {TIMEZONES.map(tz => <option key={tz} value={tz} className="bg-[#0B0D10]">{tz}</option>)}
                  </select>
                </div>
              </div>
            </StepShell>
          )}

          {/* STEP 4 — Extras */}
          {step === 4 && (
            <StepShell icon={<Settings2 className="size-5 text-[#40E0FF]" />} title="Additional Settings" subtitle="Final configuration before launch.">
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Emergency Contact <span className="text-white/20 normal-case tracking-normal font-medium">(optional)</span></label>
                  <input className={inputCls} placeholder="e.g. +60123456789" value={form.emergency_contact} onChange={e => set('emergency_contact', e.target.value)} />
                  <p className="text-[10px] text-white/20 mt-1.5">Number to escalate urgent calls to</p>
                </div>
                <div>
                  <label className={labelCls}>WhatsApp Reminders</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: true, label: 'Enabled' }, { value: false, label: 'Disabled' }].map(opt => (
                      <button key={String(opt.value)} type="button" onClick={() => set('whatsapp_reminders_enabled', opt.value)}
                        className={cn('px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all',
                          form.whatsapp_reminders_enabled === opt.value ? 'bg-[#40E0FF]/10 border-[#40E0FF]/40 text-[#40E0FF]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20')}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Configuration Summary</p>
                  {[
                    ['Clinic',       form.clinic_name],
                    ['Agent',        `${form.ai_name} · ${form.ai_tone}`],
                    ['Mode',         form.answering_mode === 'always_on' ? '24/7 Availability' : form.answering_mode === 'after_hours' ? 'After Working Hours' : 'Offline'],
                    ['Hours',        `${form.working_hours_start} – ${form.working_hours_end}`],
                    ['Days',         form.working_days.map(d => d.slice(0, 3)).join(', ')],
                    ['Timezone',     form.timezone],
                    ['WA Reminders', form.whatsapp_reminders_enabled ? 'On' : 'Off'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">{k}</span>
                      <span className="text-[11px] font-bold text-white/60 text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </StepShell>
          )}

          {/* STEP 5 — Success */}
          {step === 5 && (
            <div className="text-center py-4">
              <div className="size-16 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="size-8 text-[#40E0FF]" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tighter mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                Node Activated
              </h2>
              <p className="text-sm text-white/40 mb-2">
                <span className="text-[#40E0FF] font-bold">{form.clinic_name}</span> is now live on the Callendar network.
              </p>
              <p className="text-xs text-white/20 mb-8">
                Agent <span className="text-white/40">{form.ai_name}</span> is standing by.
              </p>
              <button
                onClick={() => { router.push('/dashboard/overview')}}
                className="w-full py-4 bg-[#40E0FF] text-[#0B0D10] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Enter Dashboard
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-[#EF7E71] text-xs font-mono uppercase tracking-tight">{error}</p>
          )}

          {step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 disabled:opacity-0 transition-all">
                <ChevronLeft className="size-4" /> Back
              </button>
              {step < 4 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#40E0FF]/10 border border-[#40E0FF]/30 text-[#40E0FF] text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#40E0FF]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  Next <ChevronRight className="size-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#40E0FF] text-[#0B0D10] text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {loading
                    ? <><Loader2 className="size-4 animate-spin" /> Initializing...</>
                    : <>Launch Node <ChevronRight className="size-4" /></>
                  }
                </button>
              )}
            </div>
          )}
        </div>

        {step < 5 && (
          <div className="mt-4 flex items-center justify-between px-2">
            <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Step {step} of 4</span>
            <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Node: MY-KUL-01</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StepShell({ icon, title, subtitle, children }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-xl flex items-center justify-center">{icon}</div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h2>
          <p className="text-[11px] text-white/30 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}