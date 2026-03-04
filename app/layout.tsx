import type { Metadata } from 'next'
import { Syne, Geist } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Callendar — AI Receptionist for Clinics',
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
        className={`${syne.variable} ${geistSans.variable} antialiased bg-[#0A0A0A] text-[#F1F5F9]`}
      >
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
