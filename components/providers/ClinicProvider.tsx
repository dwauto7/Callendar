'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ClinicContextValue = {
  clinicConfigId: string | null
  role: 'owner' | 'staff' | null
  loading: boolean
}

const ClinicContext = createContext<ClinicContextValue>({
  clinicConfigId: null,
  role: null,
  loading: true,
})

export async function getUserClinicContext() {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { clinicConfigId: null, role: null }

  const { data, error } = await supabase
    .from('clinic_users')
    .select('clinic_config_id, role')
    .eq('user_id', user.id)
    .single()

  if (error || !data?.clinic_config_id) {
    return { clinicConfigId: null, role: null }
  }

  return {
    clinicConfigId: data.clinic_config_id as string,
    role: (data.role as 'owner' | 'staff') ?? null,
  }
}

export function ClinicProvider({
  children,
  initialClinicConfigId,
  initialRole,
}: {
  children: React.ReactNode
  initialClinicConfigId?: string | null
  initialRole?: 'owner' | 'staff' | null
}) {
  const hasInitial = initialClinicConfigId !== undefined || initialRole !== undefined
  const [clinicConfigId, setClinicConfigId] = useState<string | null>(initialClinicConfigId ?? null)
  const [role, setRole] = useState<'owner' | 'staff' | null>(initialRole ?? null)
  const [loading, setLoading] = useState(!hasInitial)
  const router = useRouter()

  useEffect(() => {
    if (hasInitial) {
      setLoading(false)
      return
    }

    let active = true

    async function load() {
      const ctx = await getUserClinicContext()
      if (!active) return
      setClinicConfigId(ctx.clinicConfigId)
      setRole(ctx.role)
      setLoading(false)
      if (!ctx.clinicConfigId) {
        router.push('/onboarding')
      }
    }

    load()
    return () => {
      active = false
    }
  }, [router, hasInitial])

  const value = useMemo(() => ({ clinicConfigId, role, loading }), [clinicConfigId, role, loading])

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

export function useClinicContext() {
  return useContext(ClinicContext)
}
