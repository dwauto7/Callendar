'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Systems', href: '/#how-it-works' },
  { label: 'Intelligence', href: '/#features' },
  { label: 'Investment', href: '/#pricing' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  async function handleAuth() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard/overview')
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

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
        {/* Logo - AI Blizzard Branding */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="size-8 bg-[#40E0FF] rounded-lg flex items-center justify-center cyan-glow transition-transform group-hover:rotate-12">
            <Zap className="size-5 text-[#0B0D10] fill-current" />
          </div>
          <span 
            className="text-xl font-black text-white tracking-tighter uppercase"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            AI Blizzard
          </span>
        </Link>

        {/* Desktop Nav - High-end wording */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-[#40E0FF] transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleAuth}
            className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5"
          >
            Portal
          </Button>
          <Button
            onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
            className="bg-[#40E0FF] hover:bg-[#40E0FF]/80 text-[#0B0D10] font-black text-xs uppercase tracking-widest px-6 h-10 rounded-lg cyan-glow transition-all"
          >
            Book Demo
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/60 hover:text-[#40E0FF] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-8 space-y-6 animate-fade-in-up">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-bold uppercase tracking-widest text-white/60 hover:text-[#40E0FF]"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Button variant="outline" onClick={handleAuth} className="border-white/10 text-white bg-white/5 h-12">
              Client Portal
            </Button>
            <Button onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')} className="bg-[#40E0FF] text-[#0B0D10] font-black h-12 cyan-glow">
              Book Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
