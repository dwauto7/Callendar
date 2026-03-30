import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ResultsBand } from '@/components/landing/ResultsBand'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { DemoClip } from '@/components/landing/DemoClip'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col aurora-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(64,224,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,255,0.25) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#40E0FF]/10 via-transparent to-[#40E0FF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#40E0FF]/5 blur-[100px] pointer-events-none" />
      <div
        className="absolute -bottom-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] pointer-events-none landing-fog-animate"
        style={{
          background:
            'linear-gradient(90deg, rgba(64,224,255,0.35), rgba(16,185,129,0.15), rgba(64,224,255,0.35))',
          backgroundSize: '200% 200%',
        }}
      />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <ResultsBand />
        <HowItWorks />
        <DemoClip />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}