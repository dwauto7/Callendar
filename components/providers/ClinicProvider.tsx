'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getClinicContext } from '@/lib/clinic/getClinicContext'

type ClinicContextValue = {
  clinicConfigId: string | null
  role: 'admin' | 'doctor' | 'receptionist' | 'owner' | null
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

  const context = await getClinicContext(supabase, user.id)

  if (!context?.clinicConfigId) {
    return { clinicConfigId: null, role: null }
  }

  return {
    clinicConfigId: context.clinicConfigId as string,
    role: (context.role as 'admin' | 'doctor' | 'receptionist' | 'owner') ?? null,
  }
}

export function ClinicProvider({
  children,
  initialClinicConfigId,
  initialRole,
}: {
  children: React.ReactNode
  initialClinicConfigId?: string | null
  initialRole?: 'admin' | 'doctor' | 'receptionist' | 'owner' | null
}) {
  const hasInitial = initialClinicConfigId !== undefined || initialRole !== undefined
  const [clinicConfigId, setClinicConfigId] = useState<string | null>(initialClinicConfigId ?? null)
  const [role, setRole] = useState<'admin' | 'doctor' | 'receptionist' | 'owner' | null>(initialRole ?? null)
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
