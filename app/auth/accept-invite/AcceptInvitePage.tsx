'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface InviteValidationResponse {
  valid: boolean
  email?: string
  clinicId?: string
  role?: string
  expiresAt?: string
  error?: string
}

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [inviteValid, setInviteValid] = useState(false)
  const [prefilledEmail, setPrefilledEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setError('No invite token provided. Please check your invitation link.')
        setValidating(false)
        return
      }

      try {
        const response = await fetch('/api/auth/validate-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data: InviteValidationResponse = await response.json()

        if (response.ok && data.valid) {
          setPrefilledEmail(data.email || '')
          setInviteValid(true)
          setError(null)

          // Store token in a short-lived cookie so the OAuth callback can pick it up
          document.cookie = `invite_token=${token}; path=/; max-age=600; SameSite=Lax`
        } else {
          if (response.status === 410) {
            setError('This invite link has expired. Please contact your clinic admin for a new link.')
          } else {
            setError(data.error || 'This invite link is invalid. Please contact your clinic admin.')
          }
          setInviteValid(false)
        }
      } catch (err) {
        console.error('Invite validation error:', err)
        setError('Failed to validate invite link. Please check your connection and try again.')
        setInviteValid(false)
      } finally {
        setValidating(false)
      }
    }

    validateInvite()
  }, [token])

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    setError(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      console.error('OAuth error:', oauthError)
      setError('Failed to start Google sign-in. Please try again.')
      setSigningIn(false)
    }
    // If no error, browser redirects — no further action needed
  }

  // ── Loading state ──────────────────────────────────────────────
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    )
  }

  // ── Invalid / expired invite ───────────────────────────────────
  if (!inviteValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <CardTitle className="text-red-400">Invalid Invite</CardTitle>
            </div>
            <CardDescription className="text-slate-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-teal-600 hover:bg-teal-500"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Valid invite — show Google sign-in ─────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="max-w-md w-full bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">You're invited</CardTitle>
          <CardDescription className="text-slate-400">
            {prefilledEmail
              ? `Joining as ${prefilledEmail}`
              : 'Sign in with Google to accept your invite and access the clinic dashboard.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium flex items-center justify-center gap-3"
          >
            {signingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              // Google "G" icon inline SVG — no external dependency
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {signingIn ? 'Redirecting to Google...' : 'Continue with Google'}
          </Button>

          <p className="text-center text-xs text-slate-500">
            By continuing, you agree to Beacon Horizons's Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}