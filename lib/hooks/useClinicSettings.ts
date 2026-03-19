'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useClinicContext } from '@/components/providers/ClinicProvider'

type ClinicSettings = Record<string, unknown> | null
type CreditsRow = Record<string, unknown> | null

export function useClinicSettings() {
  const { clinicConfigId, role, loading: contextLoading } = useClinicContext()
  const [settings, setSettings] = useState<ClinicSettings>(null)
  const [credits, setCredits] = useState<CreditsRow>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Single stable instance — prevents realtime channel from being recreated
  const supabase = useMemo(() => createClient(), [])

  const fetchData = useCallback(async () => {
    if (!clinicConfigId) return
    setLoading(true)
    setError(null)

    const { data: settingsData, error: settingsError } = await supabase
      .from('clinic_settings')
      .select('*')
      .eq('clinic_config_id', clinicConfigId)

    if (settingsError) {
      setError(settingsError.message)
      setLoading(false)
      return
    }

    if (!settingsData || settingsData.length === 0) {
      router.push('/onboarding')
      setLoading(false)
      return
    }

    const { data: creditsData } = await supabase
      .from('credits')
      .select('*')
      .eq('clinic_config_id', clinicConfigId)
      .single()

    setSettings(settingsData[0] ?? null)
    setCredits(creditsData ?? null)
    setLoading(false)
  }, [clinicConfigId, router, supabase])

  useEffect(() => {
    if (!clinicConfigId) return
    fetchData()
  }, [clinicConfigId, fetchData])

  useEffect(() => {
    if (!clinicConfigId) return

    const channel = supabase
      .channel(`clinic-sync-${clinicConfigId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clinic_settings', filter: `clinic_config_id=eq.${clinicConfigId}` },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'call_logs', filter: `clinic_config_id=eq.${clinicConfigId}` },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'credits', filter: `clinic_config_id=eq.${clinicConfigId}` },
        () => fetchData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clinicConfigId, fetchData, supabase])

  const updateSettings = useCallback(
    async (changes: Record<string, unknown>) => {
      if (!clinicConfigId) throw new Error('No clinic context')
      if (role !== 'owner') throw new Error('Owner access required')

      const { error: updateError } = await supabase
        .from('clinic_settings')
        .update(changes)
        .eq('clinic_config_id', clinicConfigId)

      if (updateError) throw updateError
      await fetchData()
    },
    [clinicConfigId, fetchData, role, supabase]
  )

  return {
    clinicConfigId,
    role,
    loading: contextLoading || loading,
    error,
    settings,
    credits,
    updateSettings,
    refresh: fetchData,
  }
}