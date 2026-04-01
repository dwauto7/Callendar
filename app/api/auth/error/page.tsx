'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, HelpCircle } from 'lucide-react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const errorMessages: Record<string, { title: string; description: string; suggestion: string }> = {
    clinic_context_failed: {
      title: 'Failed to Load Clinic',
      description: "We couldn't retrieve your clinic information from our servers.",
      suggestion: 'Please try logging in again. If the problem persists, contact your clinic administrator.',
    },
    clinic_fetch_failed: {
      title: 'Access Error',
      description: "We couldn't verify your clinic access permissions.",
      suggestion: 'This might be a temporary server issue. Try logging in again or contact support.',
    },
    session_invalid: {
      title: 'Session Expired',
      description: 'Your session is no longer valid.',
      suggestion: 'Please log in again to continue.',
    },
    logout_failed: {
      title: 'Logout Error',
      description: 'Something went wrong while logging you out.',
      suggestion: 'Try clearing your browser cookies or use a private/incognito window.',
    },
    invalid_token: {
      title: 'Invalid Link',
      description: 'The link you used is invalid or has expired.',
      suggestion: 'Request a new invitation from your clinic administrator.',
    },
    oauth_error: {
      title: 'Sign-in Error',
      description: 'We encountered an error while signing you in with a third-party service.',
      suggestion: 'Try a different sign-in method or contact support if the issue persists.',
    },
  }

  const errorConfig = errorMessages[error as string] || {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred during authentication.',
    suggestion: 'Please try again or contact support if the problem continues.',
  }

  const displayMessage = message || errorConfig.description

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex gap-3 items-start">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-red-500">{errorConfig.title}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-slate-300">{displayMessage}</p>
            <p className="text-xs text-slate-400 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorConfig.suggestion}</span>
            </p>
          </div>

          {error && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Error code:</p>
              <p className="text-sm font-mono text-slate-400 break-all">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Back to Login
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-slate-600 hover:bg-slate-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">
              Still having trouble?{' '}
              <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 underline">
                Contact support
              </a>
              {' '}with the error code above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}