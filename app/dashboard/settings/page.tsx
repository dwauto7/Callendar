import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SpecialClosures } from '@/components/dashboard/settings/SpecialClosures'
import { ClinicSettingsPanel } from '@/components/dashboard/settings/ClinicSettingsPanel'
import { ServicesSettingsPanel } from '@/components/dashboard/settings/ServicesSettingsPanel'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

export const metadata = { title: 'Settings - Callendar' }

type HolidayClosure = {
  id: string
  holiday_date: string | null
  description: string | null
  is_recurring: boolean
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const id = clinicContext.clinicConfigId

  // All 3 queries fire in parallel — no waterfall, no duplicate table hits
  const [clinicConfigRes, closuresRes] = await Promise.all([
    supabase
      .from('clinic_configs')
      .select('clinic_name, owner_phone, clinic_whatsapp, is_active, agent_id, google_calendar_id')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('clinic_holidays')
      .select('id, holiday_date, description, is_recurring')
      .eq('clinic_config_id', id)
      .order('holiday_date', { ascending: true }),
  ])

  const clinicConfig = clinicConfigRes.data
  const clinicConfigError = clinicConfigRes.error

  const closures = (closuresRes.data ?? []) as HolidayClosure[]

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

      <ClinicSettingsPanel />
      <ServicesSettingsPanel />
      <SpecialClosures
        closures={closures}
        clinicConfigId={id}
      />
    </div>
  )
}
