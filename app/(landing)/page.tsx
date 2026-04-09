import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { DemoClip } from '@/components/landing/DemoClip'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: '#0A0A0B',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,212,191,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 90%, rgba(45,212,191,0.04) 0%, transparent 50%)',
        isolation: 'isolate',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      <div className="hidden" />
      <div className="hidden" />
      <div className="hidden" />
      <div className="hidden" />
      <div className="hidden" />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <HowItWorks />
        <DemoClip />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
