'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  PhoneCall,
  CalendarCheck,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Intelligence Overview', href: '/dashboard/overview',     icon: LayoutDashboard },
  { label: 'Voice Logs',          href: '/dashboard/calls',        icon: PhoneCall },
  { label: 'Clinical Calendar',   href: '/dashboard/appointments', icon: CalendarCheck },
  { label: 'Engine Credits',      href: '/dashboard/credits',      icon: Zap },
  { label: 'ROI Reports',         href: '/dashboard/reports',      icon: BarChart3 },
  { label: 'System Settings',     href: '/dashboard/settings',     icon: Settings },
]

interface SidebarProps {
  clinicName: string
  userEmail: string
}

export function Sidebar({ clinicName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = userEmail?.split('@')[0]?.slice(0, 2).toUpperCase() ?? 'AB'

  return (
    <>
      {/* Mobile top bar - AI Blizzard Branding */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-16 bg-[#0B0D10]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="size-7 bg-[#40E0FF] rounded flex items-center justify-center shadow-[0_0_15px_rgba(64,224,255,0.3)]">
            <Zap className="size-4 text-[#0B0D10] fill-current" />
          </div>
          <span
            className="text-lg font-black text-white tracking-tighter uppercase"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            AI Blizzard
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/40 hover:text-[#40E0FF]"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-6" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-[260px] flex flex-col',
          'bg-[#0B0D10] border-r border-white/5 shadow-2xl transition-all duration-500 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 shrink-0 bg-white/[0.02]">
          <Link href="/dashboard/overview" className="flex items-center gap-2.5 group">
            <div className="size-8 bg-[#40E0FF] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 shadow-[0_0_20px_rgba(64,224,255,0.4)]">
              <Zap className="size-5 text-[#0B0D10] fill-current" />
            </div>
            <span
              className="text-xl font-black text-white tracking-tighter uppercase"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              AI Blizzard
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/20 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Clinic Info Strip - High end feel */}
        <div className="px-6 py-5 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="size-3 text-[#40E0FF]/60" />
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">
              Verified Clinic
            </p>
          </div>
          <p className="text-[15px] text-white font-bold truncate leading-tight">
            {clinicName}
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight',
                  'transition-all duration-300 group relative',
                  active
                    ? 'bg-[#40E0FF]/10 text-[#40E0FF] shadow-[inset_0_0_20px_rgba(64,224,255,0.05)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5',
                )}
              >
                {/* Active left indicator - Cyan Glow */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-[#40E0FF] rounded-r-full shadow-[0_0_15px_rgba(64,224,255,0.8)]" />
                )}
                
                <Icon
                  className={cn(
                    'size-[18px] shrink-0 transition-all duration-300',
                    active
                      ? 'text-[#40E0FF] drop-shadow-[0_0_8px_rgba(64,224,255,0.5)]'
                      : 'text-white/30 group-hover:text-white',
                  )}
                />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User context footer */}
        <div className="mt-auto p-4 bg-white/[0.02] border-t border-white/5">
          <Card className="glass-panel border border-white/5 rounded-2xl">
            <CardContent className="p-3 flex items-center gap-3">
              <Avatar className="size-9 shrink-0 rounded-xl border border-white/10">
                <AvatarFallback className="bg-[#40E0FF]/10 text-[#40E0FF] text-[10px] font-black tracking-tighter">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mb-0.5">
                  Operator
                </p>
                <p className="text-sm text-white font-bold truncate tracking-tight">
                  {userEmail}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                onClick={handleLogout}
                title="Terminate Session"
              >
                <LogOut className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  )
}
