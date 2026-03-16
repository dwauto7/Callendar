'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client' // Ensure this path is correct
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)  

    const formData = new FormData(e.currentTarget)
    const clinicName = formData.get('clinic_name') as string

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Session expired. Please log in again.")

      // 2. Insert into clinic_configs
      const { data: config, error: configError } = await supabase
        .from('clinic_configs')
        .insert({ clinic_name: clinicName, user_id: user.id })
        .select()
        .single()

       if (configError) throw new Error(`Config Error: ${configError.message}`);

      // 3. Link user to this clinic in clinic_users
      const { error: linkError } = await supabase
        .from('clinic_users')
        .insert({
          user_id: user.id,
          clinic_config_id: config.id
        })

      if (linkError) throw new Error(`Link Error: ${linkError.message}`);

      // 4. Success! Redirect to dashboard
      router.push('/dashboard/overview')
      router.refresh()
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Initialization error. Please try again.'
      console.error('Initialization error. Please try again.', err)
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] aurora-bg grain flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-[#40E0FF]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-white/10 fade-in-up z-10">
        <div className="mb-8">
          <div className="size-12 bg-[#40E0FF]/20 rounded-xl flex items-center justify-center mb-4 cyan-glow">
            <div className="size-3 bg-[#40E0FF] rounded-full animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            System <span className="text-[#40E0FF]">Initialization</span>
          </h1>
          <p className="text-[#8B949E] mt-2 text-sm">
            Welcome to the AI Blizzard network. Let&apos;s configure your clinic&apos;s intelligence node.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#40E0FF] font-black">
              Clinic Identification
            </label>
            <input 
              required
              name="clinic_name"
              type="text" 
              placeholder="e.g. Insight Chiropractic PJ"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#40E0FF]/50 transition-all"
            />
          </div>

          {error && (
            <p className="text-[#EF7E71] text-xs font-mono uppercase tracking-tight">{error}</p>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-[#40E0FF] text-[#0B0D10] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cyan-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SYNCING DATA...' : 'INITIALIZE AYA AI'}
          </button>
        </form>
        
        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Node: MY-KUL-01</span>
          <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Status: {loading ? 'SYNCING' : 'AUTH_OK'}</span>
        </div>
      </div>
    </div>
  )
}
