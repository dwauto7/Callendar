'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface OverviewData {
  credits: any
  report: any
  allCalls: any[]
  appointments: any[]
  isLoading: boolean
  error: Error | null
}

export function useOverviewData(clinicConfigId: string) {
  const [data, setData] = useState<OverviewData>({
    credits: null,
    report: null,
    allCalls: [],
    appointments: [],
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    try {
      const supabase = await createClient()

      const [creditsRes, reportsRes, callsRes, appointmentsRes] =
        await Promise.all([
          supabase
            .from('credits')
            .select('*')
            .eq('clinic_config_id', clinicConfigId)
            .single(),

          supabase
            .from('monthly_reports')
            .select('*')
            .eq('clinic_config_id', clinicConfigId)
            .order('report_month', { ascending: false })
            .limit(1)
            .single(),

          supabase
            .from('call_logs')
            .select('id, client_name, patient_phone, duration_min, minutes_saved, is_after_hours, appointment_id, created_at, clinic_config_id, summary, recording_url')
            .eq('clinic_config_id', clinicConfigId)
            .order('created_at', { ascending: false }),

          supabase
            .from('appointments')
            .select('id, projected_revenue, status, clinic_id')
            .eq('clinic_id', clinicConfigId),
        ])

      console.log('📊 Appointments fetched:', appointmentsRes.data)
      
      setData({
        credits: creditsRes.data,
        report: reportsRes.data ?? null,
        allCalls: callsRes.data ?? [],
        appointments: appointmentsRes.data ?? [],
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }))
    }
  }, [clinicConfigId])

  // Initial fetch on mount
  useEffect(() => {
    fetchData()
  }, [clinicConfigId, fetchData])

  // Realtime subscriptions for call_logs, appointments, and credits
  useEffect(() => {
    const setupRealtime = async () => {
      const supabase = await createClient()
      const channels: RealtimeChannel[] = []

      // Subscribe to new call_logs
      const callLogsChannel = supabase
        .channel(`call_logs_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'call_logs',
            filter: `clinic_config_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('📞 New call received:', payload.new)
            setData((prev) => ({
              ...prev,
              allCalls: [payload.new, ...prev.allCalls],
            }))
          }
        )
        .subscribe()

      channels.push(callLogsChannel)

      // Subscribe to new appointments
      const appointmentsInsertChannel = supabase
        .channel(`appointments_insert_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('➕ New appointment:', payload.new)
            setData((prev) => ({
              ...prev,
              appointments: [...prev.appointments, payload.new],
            }))
          }
        )
        .subscribe()

      channels.push(appointmentsInsertChannel)

      // Subscribe to appointment UPDATES (cancellations, reschedules)
      const appointmentsUpdateChannel = supabase
        .channel(`appointments_update_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('🔄 Appointment UPDATED:', {
              old_id: payload.old.id,
              new_status: payload.new.status,
              old_status: payload.old.status,
              new_revenue: payload.new.projected_revenue,
              old_revenue: payload.old.projected_revenue,
            })
            
            setData((prev) => {
              const updated = prev.appointments.map((apt) =>
                apt.id === payload.new.id ? payload.new : apt
              )
              console.log('📋 Appointments after update:', updated)
              return {
                ...prev,
                appointments: updated,
              }
            })
          }
        )
        .subscribe()

      channels.push(appointmentsUpdateChannel)

      // Subscribe to credits updates
      const creditsChannel = supabase
        .channel(`credits_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'credits',
            filter: `clinic_config_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('⚡ Credits updated:', payload.new)
            setData((prev) => ({
              ...prev,
              credits: payload.new,
            }))
          }
        )
        .subscribe()

      channels.push(creditsChannel)

      return () => {
        channels.forEach((channel) => {
          supabase.removeChannel(channel)
        })
      }
    }

    const cleanup = setupRealtime()
    return () => {
      cleanup.then((fn) => fn?.())
    }
  }, [clinicConfigId])

  return data
}