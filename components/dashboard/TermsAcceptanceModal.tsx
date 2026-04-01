'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const CURRENT_TERMS_VERSION = '1.0.0'

interface Props {
  clinicConfigId: string
  onAccepted: () => void
}

export function TermsAcceptanceModal({ clinicConfigId, onAccepted }: Props) {
  const [agreedToS, setAgreedToS] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAccept = agreedToS && agreedPrivacy

  async function handleAccept() {
    if (!canAccept) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('clinic_configs')
      .update({
        accepted_terms_at: new Date().toISOString(),
        accepted_terms_version: CURRENT_TERMS_VERSION,
      })
      .eq('id', clinicConfigId)

    if (updateError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    onAccepted()
  }

  function handleExit() {
    const supabase = createClient()
    supabase.auth.signOut().then(() => {
      window.location.href = '/'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0F1117] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">

        <h2 className="text-xl font-semibold text-white mb-1">
          Before you continue
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Please review and accept the following to access your dashboard.
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToS}
              onChange={e => setAgreedToS(e.target.checked)}
              className="mt-0.5 accent-[#40E0FF] w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-300">
              I agree to the{' '}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#40E0FF] underline underline-offset-2 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedPrivacy}
              onChange={e => setAgreedPrivacy(e.target.checked)}
              className="mt-0.5 accent-[#40E0FF] w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-slate-300">
              I acknowledge the{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#40E0FF] underline underline-offset-2 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>{' '}
              and consent to voice data processing
            </span>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={!canAccept || loading}
            className="flex-1 bg-[#40E0FF] text-[#0B0D10] font-semibold py-2.5 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
          >
            {loading ? 'Saving…' : 'Accept & Continue'}
          </button>
          <button
            onClick={handleExit}
            className="px-4 py-2.5 rounded-lg text-sm text-slate-400 border border-white/10 hover:border-white/30 hover:text-white transition-colors"
          >
            Exit
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Version {CURRENT_TERMS_VERSION} · Acceptance is recorded with a timestamp
        </p>
      </div>
    </div>
  )
}