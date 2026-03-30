'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface OperationsData {
  credits: any
  appointments: any[]
  callLogs: any[]
  isLoading: boolean
  error: Error | null
}

export function useOperationsData(clinicConfigId: string) {
  const [data, setData] = useState<OperationsData>({
    credits: null,
    appointments: [],
    callLogs: [],
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    try {
      const supabase = await createClient()

      const [creditsRes, appointmentsRes, callLogsRes] = await Promise.all([
        supabase
          .from('credits')
          .select('*')
          .eq('clinic_config_id', clinicConfigId)
          .single(),

        supabase
          .from('appointments')
          .select('id, patient_name, phone, email, appointment_date, appointment_time, appointment_type, patient_status, status, projected_revenue, reminder_sent, created_at, clinic_id')
          .eq('clinic_id', clinicConfigId)
          .order('appointment_date', { ascending: false })
          .limit(400), // Match original limit

        supabase
          .from('call_logs')
          .select('*')
          .eq('clinic_config_id', clinicConfigId)
          .order('created_at', { ascending: false })
          .limit(100),
      ])

      setData({
        credits: creditsRes.data,
        appointments: appointmentsRes.data ?? [],
        callLogs: callLogsRes.data ?? [],
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('❌ Operations fetch error:', err)
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

  // Realtime subscriptions for appointments and call_logs
  useEffect(() => {
    const setupRealtime = async () => {
      const supabase = await createClient()
      const channels: RealtimeChannel[] = []

      // Subscribe to new appointments (INSERT)
      const appointmentsInsertChannel = supabase
        .channel(`operations_appointments_insert_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('➕ New appointment created:', payload.new)
            setData((prev) => ({
              ...prev,
              appointments: [payload.new, ...prev.appointments].slice(0, 400), // Keep 400 max
            }))
          }
        )
        .subscribe()

      channels.push(appointmentsInsertChannel)

      // Subscribe to appointment UPDATES (status changes, rescheduling, revenue changes)
      const appointmentsUpdateChannel = supabase
        .channel(`operations_appointments_update_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `clinic_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('🔄 Appointment updated:', payload.new)
            setData((prev) => ({
              ...prev,
              appointments: prev.appointments.map((apt) =>
                apt.id === payload.new.id ? payload.new : apt
              ),
            }))
          }
        )
        .subscribe()

      channels.push(appointmentsUpdateChannel)

      // Subscribe to new call_logs (INSERT)
      const callLogsChannel = supabase
        .channel(`operations_call_logs_${clinicConfigId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'call_logs',
            filter: `clinic_config_id=eq.${clinicConfigId}`,
          },
          (payload) => {
            console.log('📞 New call logged:', payload.new)
            setData((prev) => ({
              ...prev,
              callLogs: [payload.new, ...prev.callLogs],
            }))
          }
        )
        .subscribe()

      channels.push(callLogsChannel)

      // Subscribe to credits updates (minutes_used changes)
      const creditsChannel = supabase
        .channel(`operations_credits_${clinicConfigId}`)
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