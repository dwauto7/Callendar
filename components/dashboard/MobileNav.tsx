'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { label: 'Overview',    href: '/dashboard/overview',  icon: LayoutDashboard },
  { label: 'Operations',  href: '/dashboard/operations',icon: CalendarCheck },
  { label: 'Profiles',    href: '/dashboard/doctors',   icon: CalendarCheck },
  { label: 'Reports',     href: '/dashboard/reports',   icon: BarChart3 },
  { label: 'Settings',    href: '/dashboard/settings',  icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch bg-[#0D0F12] border-t border-[#1E2128]">
      {mobileNavItems.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3',
              'transition-colors duration-200',
              active ? 'text-[#10B981]' : 'text-[#64748B]',
            )}
          >
            <Icon className="size-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
