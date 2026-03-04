'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1E2128]'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[#F1F5F9] tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Callendar
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleAuth}
            className="text-sm text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E2128]"
          >
            Login
          </Button>
          <Button
            onClick={handleAuth}
            className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold text-sm px-5"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#64748B] hover:text-[#F1F5F9]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D0F12] border-b border-[#1E2128] px-5 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[#64748B] hover:text-[#F1F5F9] py-1.5 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" onClick={handleAuth} className="border-[#1E2128] text-[#F1F5F9] hover:bg-[#1E2128] w-full">
              Login
            </Button>
            <Button onClick={handleAuth} className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
