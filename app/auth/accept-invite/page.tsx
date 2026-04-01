'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'

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

      const responseEmail = (data as any)?.email
      if (!responseEmail) {
        setError('Server error: no email returned. Please contact support.')
        return
      }

      const { error: loginError, data: session } =
        await supabase.auth.signInWithPassword({
          email: responseEmail,
          password,
        })

      if (loginError) {
        console.error('Login error:', loginError)
        setError('Account created successfully! Please log in manually.')
        setTimeout(() => router.push('/auth/login'), 2000)
        return
      }

      if (!session?.user) {
        setError('Session not established. Please log in manually.')
        setTimeout(() => router.push('/auth/login'), 2000)
        return
      }

      if (session.user.email !== responseEmail) {
        setError('Session validation failed. Please log in manually.')
        setTimeout(() => router.push('/auth/login'), 2000)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/auth/post-auth'), 2000)

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

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!inviteValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Invalid Invite</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <p className="text-white ml-2">Account created! Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <Alert><AlertDescription>{error}</AlertDescription></Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}