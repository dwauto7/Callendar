import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/dashboard/settings/SettingsForm'
import { SpecialClosures } from '@/components/dashboard/settings/SpecialClosures'
import { ClinicSettingsPanel } from '@/components/dashboard/settings/ClinicSettingsPanel'
import { timeAsync } from '@/lib/perf'

export const metadata = { title: 'Settings - Callendar' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users')
    .select('clinic_config_id')
    .eq('user_id', user.id)
    .single()

  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const id = clinicUser.clinic_config_id

  const { data: clinicConfig, error: clinicConfigError } = await supabase
    .from('clinic_configs')
    .select('clinic_name, owner_phone, clinic_whatsapp, is_active, agent_id, google_calendar_id')
    .eq('id', id)
    .maybeSingle()

  const [settingsRes, closuresRes] = await Promise.all([
    timeAsync('settings:clinic_settings', async () =>
      supabase
        .from('clinic_settings')
        .select('*')
        .eq('clinic_config_id', id)
        .maybeSingle()
    ),
    timeAsync('settings:special_closures', async () =>
      supabase
        .from('clinic_settings')
        .select('id, date, reason, is_closed, setting_name')
        .eq('clinic_config_id', id)
        .order('date', { ascending: true })
    ),
  ])

  const settingsConfig = settingsRes?.data ?? {
    clinic_config_id: id,
    working_hours: null,
    working_days: null,
    timezone: 'Asia/Kuala_Lumpur',
    emergency_contact: null,
  }

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="size-5 text-[#10B981]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
          Settings
        </h1>
        {clinicConfig
          ? <span className="text-xs text-emerald-400 ml-auto">Clinic Config: Loaded ✓</span>
          : <span className="text-xs text-red-400 ml-auto">Clinic Config: Not Found ✗</span>
        }
      </div>

      {clinicConfig ? (
        <div className="rounded-xl border border-[#1E2128] bg-[#111318] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[#F1F5F9] uppercase tracking-widest">Clinic Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">Clinic Name</p>
              <p className="text-sm text-[#F1F5F9]">{clinicConfig.clinic_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">Owner Phone</p>
              <p className="text-sm text-[#F1F5F9]">{clinicConfig.owner_phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">WhatsApp Number</p>
              <p className="text-sm text-[#F1F5F9]">{clinicConfig.clinic_whatsapp || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">Agent ID</p>
              <p className="text-sm text-[#F1F5F9] font-mono text-xs">{clinicConfig.agent_id || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">Google Calendar ID</p>
              <p className="text-sm text-[#F1F5F9] font-mono text-xs truncate">{clinicConfig.google_calendar_id || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5">System Status</p>
              <p className={`text-sm font-semibold ${clinicConfig.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                {clinicConfig.is_active ? '● Active' : '● Inactive'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5 space-y-2">
          <p className="text-red-400 text-sm">Clinic configuration not found. Please refresh the page.</p>
          <p className="text-yellow-400 text-xs font-mono">Clinic ID: {id}</p>
          {clinicConfigError && (
            <p className="text-red-400 text-xs">Error: {JSON.stringify(clinicConfigError)}</p>
          )}
        </div>
      )}

      <SettingsForm config={settingsConfig} />
      <ClinicSettingsPanel />
      <SpecialClosures
        closures={closuresRes?.data ?? []}
        clinicConfigId={id}
      />
    </div>
  )
}
