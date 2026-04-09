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
  recurrence_weekday: number | null
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const clinicContext = await getClinicContext(supabase, user.id)

  if (!clinicContext?.clinicConfigId) redirect('/onboarding')

  const id = clinicContext.clinicConfigId

  const [clinicConfigRes, closuresRes] = await Promise.all([
    supabase
      .from('clinic_configs')
      .select('clinic_name, owner_phone, clinic_whatsapp, is_active, agent_id, google_calendar_id')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('clinic_holidays')
      .select('id, holiday_date, description, is_recurring, recurrence_weekday')
      .eq('clinic_config_id', id)
      .order('is_recurring', { ascending: false })
      .order('holiday_date', { ascending: true }),
  ])

  const clinicConfig = clinicConfigRes.data
  const clinicConfigError = clinicConfigRes.error

  const closures = (closuresRes.data ?? []) as HolidayClosure[]

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto space-y-8">
      <div className="relative rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden flex items-center gap-3">
        <div className="p-3 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
          <Settings className="size-5 text-[#2DD4BF]" />
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold tracking-tight leading-none text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Settings
        </h1>
        {clinicConfig
          ? <span className="ml-auto text-[10px] font-black uppercase tracking-widest rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF] px-3 py-1.5">Clinic Config: Loaded</span>
          : <span className="ml-auto text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20 bg-red-500/10 text-red-400 px-3 py-1.5">Clinic Config: Not Found</span>
        }
      </div>

      {clinicConfig ? (
        <div className="rounded-2xl border border-[#212129] bg-[#121216] p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Clinic Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Clinic Name</p>
              <p className="text-sm text-white">{clinicConfig.clinic_name || '—'}</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Owner Phone</p>
              <p className="text-sm text-white">{clinicConfig.owner_phone || '—'}</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">WhatsApp Number</p>
              <p className="text-sm text-white">{clinicConfig.clinic_whatsapp || '—'}</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Agent ID</p>
              <p className="text-sm text-white font-mono text-xs">{clinicConfig.agent_id || '—'}</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Google Calendar ID</p>
              <p className="text-sm text-white font-mono text-xs truncate">{clinicConfig.google_calendar_id || '—'}</p>
            </div>
            <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">System Status</p>
              <p className={`text-sm font-semibold ${clinicConfig.is_active ? 'text-[#2DD4BF]' : 'text-red-400'}`}>
                {clinicConfig.is_active ? '● Active' : '● Inactive'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-500/20 bg-[#121216] p-6 space-y-2">
          <p className="text-red-400 text-sm">Clinic configuration not found. Please refresh the page.</p>
          <p className="text-amber-400 text-xs font-mono">Clinic ID: {id}</p>
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