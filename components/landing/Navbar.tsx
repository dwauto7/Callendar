'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing',  href: '/#pricing'  },
  { label: 'Contact',  href: '/contact'   },
]

// Single shared supabase client — not recreated on every call
const supabase = createClient()

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authed,     setAuthed]     = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Single OAuth handler — Sign In and Sign Up are identical with Google OAuth
  const handleOAuth = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [])

  const handleDashboard = useCallback(() => {
    router.push('/dashboard/overview')
  }, [router])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'py-5 bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 bg-[#40E0FF] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Zap className="size-5 text-[#0B0D10] fill-current" />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-[#40E0FF] transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {authed === null ? (
            <div className="w-28 h-9 rounded-lg bg-white/5 animate-pulse" />
          ) : authed ? (
            <Button
              onClick={handleDashboard}
              className="bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] font-black text-xs uppercase tracking-widest px-6 h-9 rounded-lg transition-all hover:scale-105"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleOAuth}
                className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 h-9"
              >
                Log In
              </Button>
              <Button
                onClick={handleOAuth}
                className="bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] font-black text-xs uppercase tracking-widest px-5 h-9 rounded-lg transition-all hover:scale-105"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-[#40E0FF] transition-colors"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-8 space-y-6 animate-fade-in-up">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              className="block text-sm font-bold uppercase tracking-widest text-white/60 hover:text-[#40E0FF]"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {authed ? (
              <Button
                onClick={() => { handleDashboard(); closeMobile() }}
                className="bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] font-black h-12"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => { handleOAuth(); closeMobile() }}
                  className="border-white/10 text-white bg-white/5 h-12"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => { handleOAuth(); closeMobile() }}
                  className="bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] font-black h-12"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}