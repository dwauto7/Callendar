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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-[#212129]'
          : 'py-5 bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-9 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 flex items-center justify-center transition-transform group-hover:-rotate-3">
            <Zap className="size-5 text-[#2DD4BF]" />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-[#2DD4BF] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {authed === null ? (
            <div className="w-28 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : authed ? (
            <Button
              onClick={handleDashboard}
              className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors h-auto"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleOAuth}
                className="border border-[#212129] text-white/60 font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:border-[#2DD4BF]/40 hover:text-white transition-colors h-auto"
              >
                Log In
              </Button>
              <Button
                onClick={handleOAuth}
                className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors h-auto"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-[#2DD4BF] transition-colors"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0B]/95 border-b border-[#212129] px-6 py-8 space-y-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              className="block text-sm font-black uppercase tracking-widest text-white/60 hover:text-[#2DD4BF]"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {authed ? (
              <Button
                onClick={() => { handleDashboard(); closeMobile() }}
                className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors h-auto"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => { handleOAuth(); closeMobile() }}
                  className="border border-[#212129] text-white/60 font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:border-[#2DD4BF]/40 hover:text-white transition-colors h-auto"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => { handleOAuth(); closeMobile() }}
                  className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors h-auto"
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
