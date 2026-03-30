'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface ReportsData {
  allReports: any[]
  liveRevenue: number
  isLoading: boolean
  error: Error | null
}

export function useReportsData(clinicConfigId: string) {
  const [data, setData] = useState<ReportsData>({
    allReports: [],
    liveRevenue: 0,
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient()

      const [reportsRes, revenueRes] = await Promise.all([
        supabase
          .from('monthly_reports')
          .select('*')
          .eq('clinic_config_id', clinicConfigId)
          .order('report_month', { ascending: false })
          .limit(6),

        supabase.rpc('get_live_revenue', { p_clinic_id: clinicConfigId }),
      ])

      setData({
        allReports: reportsRes.data ?? [],
        liveRevenue: (revenueRes.data as number) ?? 0,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }))
    }
  }, [clinicConfigId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Realtime: re-fetch live revenue whenever appointments change
  useEffect(() => {
    const setupRealtime = async () => {
      const supabase = createClient()
      const channels: RealtimeChannel[] = []

      const refetchRevenue = async () => {
        const { data } = await supabase.rpc('get_live_revenue', {
          p_clinic_id: clinicConfigId,
        })
        setData((prev) => ({
          ...prev,
          liveRevenue: (data as number) ?? 0,
        }))
      }

      // INSERT — new appointment booked
      const insertChannel = supabase
        .channel(`reports_apt_insert_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          () => refetchRevenue()
        )
        .subscribe()

      channels.push(insertChannel)

      // UPDATE — appointment status changed (e.g. cancelled)
      const updateChannel = supabase
        .channel(`reports_apt_update_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          () => refetchRevenue()
        )
        .subscribe()

      channels.push(updateChannel)

      // DELETE — appointment hard-deleted from DB
      const deleteChannel = supabase
        .channel(`reports_apt_delete_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          () => refetchRevenue()
        )
        .subscribe()

      channels.push(deleteChannel)

      return () => {
        channels.forEach((ch) => supabase.removeChannel(ch))
      }
    }

    const cleanup = setupRealtime()
    return () => {
      cleanup.then((fn) => fn?.())
    }
  }, [clinicConfigId])

  return data
}