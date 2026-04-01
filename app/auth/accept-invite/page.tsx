'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface InviteValidationResponse {
  valid: boolean
  email?: string
  clinicId?: string
  role?: string
  expiresAt?: string
}

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const token = searchParams.get('token')

  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [validating, setValidating] = useState(true)
  const [inviteValid, setInviteValid] = useState(false)
  const [prefilledEmail, setPrefilledEmail] = useState<string>('')
  const [inviteExpired, setInviteExpired] = useState(false)

  // Password validation helper
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8
  }

  const passwordStrength = (password: string): number => {
    if (password.length === 0) return 0
    let strength = 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[^a-zA-Z\d]/.test(password)) strength += 1
    return Math.min(strength, 4)
  }

  // Validate invite token on component mount
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
        } else {
          if (response.status === 410) {
            setInviteExpired(true)
            setError('This invite link has expired. Please contact your clinic admin for a new link.')
          } else {
            setError(
              (data as any)?.error || 
              'This invite link is invalid. Please contact your clinic admin.'
            )
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validation checks
    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters')
      return
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Step 1: Create account via API
      const response = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_token: token,
          password,
          full_name: fullName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError((data as any)?.error || 'Something went wrong. Please try again.')
        return
      }

      // Step 2: Verify email from response
      const responseEmail = (data as any)?.email
      if (!responseEmail) {
        setError('Server error: no email returned. Please contact support.')
        return
      }

      // Step 3: Auto login with session verification
      const { error: loginError, data: session } = await supabase.auth.signInWithPassword({
        email: responseEmail,
        password,
      })

      if (loginError) {
        console.error('Login error:', loginError)
        setError('Account created successfully! Please log in manually with your email and password.')
        // Let user see success before redirecting to login
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
        return
      }

      // Step 4: Verify session exists and email matches
      if (!session?.user) {
        setError('Session not established. Please log in manually.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
        return
      }

      // Safety check: verify email matches
      if (session.user.email !== responseEmail) {
        console.error('Session email mismatch:', {
          returned: responseEmail,
          session: session.user.email,
        })
        setError('Session validation failed. Please log in manually.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
        return
      }

      // Success! Show confirmation
      setSuccess(true)

      // Wait for user to see success message, then redirect
      // Increased timeout to ensure session is fully persisted
      setTimeout(() => {
        router.push('/auth/post-auth')
      }, 2000)

    } catch (err) {
      console.error('Accept invite error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Network error. Please check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-300">Validating your invite...</p>
        </div>
      </div>
    )
  }

  // Invalid invite state
  if (!inviteValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <CardTitle className="text-red-500">Invalid Invite</CardTitle>
                <CardDescription className="text-slate-400">
                  {inviteExpired ? 'Invite link expired' : 'This invite link is not valid'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              {error}
            </p>
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="w-full"
            >
              Back to Login
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Contact your clinic admin if you need a new invitation.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-white">Account created!</h2>
          <p className="text-slate-300">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Complete your setup</CardTitle>
          <CardDescription className="text-slate-400">
            Create your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-950 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                autoComplete="name"
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Email Display (read-only) */}
            {prefilledEmail && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-400">
                  {prefilledEmail}
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < passwordStrength(password)
                          ? 'bg-green-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-400">Passwords match ✓</p>
              )}
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400">Passwords don't match</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-300 mb-2">Password requirements:</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className={password.length >= 8 ? 'text-green-400' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-400' : ''}>
                  ✓ Mix of uppercase and lowercase letters
                </li>
                <li className={/\d/.test(password) ? 'text-green-400' : ''}>
                  ✓ At least one number
                </li>
                <li className={/[^a-zA-Z\d]/.test(password) ? 'text-green-400' : ''}>
                  ✓ At least one special character
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !fullName.trim() || !isValidPassword(password) || password !== confirmPassword}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-4">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
