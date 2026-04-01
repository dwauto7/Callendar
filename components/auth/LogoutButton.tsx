// components/auth/LogoutButton.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, AlertCircle, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  showIcon?: boolean
  onClick?: () => void
}

export function LogoutButton({
  variant = 'ghost',
  size = 'sm',
  fullWidth = true,
  showIcon = true,
  onClick,
}: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      setLoading(true)
      setError(null)

      // Call logout endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Logout failed')
      }

      // Clear any local storage/session data if needed
      // Example: localStorage.removeItem('clinic-id')

      // Redirect to login page
      router.push('/auth/login')

      // Optional callback
      onClick?.()

    } catch (err) {
      console.error('Logout error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to logout. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200 text-xs">{error}</AlertDescription>
        </Alert>
      )}
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={loading}
        className={fullWidth ? 'w-full justify-start' : ''}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            {showIcon && <LogOut className="w-4 h-4 mr-2" />}
            Logout
          </>
        )}
      </Button>
    </div>
  )
}
