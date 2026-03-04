import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/dashboard/settings/SettingsForm'
import { SpecialClosures } from '@/components/dashboard/settings/SpecialClosures'

export const metadata = { title: 'Settings — Callendar' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: clinicUser } = await supabase
    .from('clinic_users').select('clinic_config_id').eq('user_id', user.id).single()
  if (!clinicUser?.clinic_config_id) redirect('/onboarding')

  const id = clinicUser.clinic_config_id

  const [configRes, closuresRes] = await Promise.all([
    supabase.from('clinic_config').select('*').eq('id', id).single(),
    supabase
      .from('clinic_settings')
      .select('id, date, reason, is_closed, setting_name')
      .eq('clinic_config_id', id)
      .order('date', { ascending: true }),
  ])

  if (!configRes.data) redirect('/onboarding')

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="size-5 text-[#10B981]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
          Settings
        </h1>
      </div>

      <SettingsForm config={configRes.data} />
      <SpecialClosures
        closures={closuresRes.data ?? []}
        clinicConfigId={id}
      />
    </div>
  )
}
