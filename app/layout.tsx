import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import { PerfOverlay } from '@/components/PerfOverlay'
import './globals.css'

const geist = localFont({
  src: '../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

const syne = localFont({
  src: '../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2',
  variable: '--font-syne',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'Callendar - AI Receptionist for Clinics',
  description:
    'Never miss a call. Book appointments 24/7. Let Aya handle it.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${geist.variable} antialiased bg-[#0A0A0A] text-[#F1F5F9]`}
      >
        {children}
        <PerfOverlay />
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
