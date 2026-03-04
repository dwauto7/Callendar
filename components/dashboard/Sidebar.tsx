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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Overview',      href: '/dashboard/overview',      icon: LayoutDashboard },
  { label: 'Call Logs',     href: '/dashboard/calls',         icon: PhoneCall },
  { label: 'Appointments',  href: '/dashboard/appointments',  icon: CalendarCheck },
  { label: 'Credits',       href: '/dashboard/credits',       icon: Zap },
  { label: 'Reports',       href: '/dashboard/reports',       icon: BarChart3 },
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings },
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

  const initials = userEmail?.split('@')[0]?.slice(0, 2).toUpperCase() ?? 'CL'

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#0D0F12] border-b border-[#1E2128]">
        <span
          className="text-lg font-bold text-[#F1F5F9] tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Callendar
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-[#64748B] hover:text-[#F1F5F9]"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-[240px] flex flex-col',
          'bg-[#0D0F12] border-r border-[#1E2128]',
          'transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#1E2128] shrink-0">
          <span
            className="text-xl font-bold text-[#F1F5F9] tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Callendar
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-[#64748B]"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Clinic name strip */}
        <div className="px-5 py-3 border-b border-[#1E2128]">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">
            Clinic
          </p>
          <p className="text-sm text-[#F1F5F9] font-medium truncate mt-0.5">
            {clinicName}
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium',
                  'transition-all duration-200 group relative',
                  active
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E2128]',
                )}
              >
                {/* Active left-border accent */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#10B981] rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    'size-4 shrink-0 transition-colors duration-200',
                    active
                      ? 'text-[#10B981]'
                      : 'text-[#64748B] group-hover:text-[#F1F5F9]',
                  )}
                />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User row + logout */}
        <div className="border-t border-[#1E2128] p-4 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-[#1E2128] text-[#F1F5F9] text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#F1F5F9] font-medium truncate">
                {userEmail}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 shrink-0 transition-colors duration-200"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
