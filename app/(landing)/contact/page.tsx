'use client'

import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden grain py-20">
        {/* Aurora background */}
        <div className="absolute inset-0 aurora-bg pointer-events-none" />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(#40E0FF 1px, transparent 1px),
              linear-gradient(90deg, #40E0FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#40E0FF]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6 fade-in-up">
            <span className="text-xs font-semibold text-[#40E0FF]">
              Talk to the team
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F1F5F9] leading-[1.1] tracking-tight mb-6 fade-in-up-delay-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Let&apos;s Build Your Patient Engine
          </h1>

          <p className="text-xl text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto fade-in-up-delay-2">
            Get a live walkthrough, integration guidance, and a launch plan for your clinic. We reply within 1 business hour.
          </p>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* WhatsApp Card */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#40E0FF]/40 group fade-in-up-delay-1 glass-panel"
              style={{ background: 'linear-gradient(135deg, rgba(10,12,16,0.85) 70%, rgba(64,224,255,0.05) 100%)' }}
            >
              {/* Animated top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#40E0FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#40E0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#40E0FF]/15 border border-[#40E0FF]/20">
                  <MessageCircle className="size-8 text-[#40E0FF]" />
                </div>

                <h3
                  className="text-2xl font-bold text-[#F1F5F9] mb-3"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  WhatsApp Concierge
                </h3>

                <p className="text-white/60 mb-6 leading-relaxed">
                  Fastest way to reach us. Ask about pricing, integration, or live call examples.
                </p>

                <Button
                  onClick={() => window.open('https://wa.me/601114399466', '_blank')}
                  className="w-full bg-[#40E0FF] hover:bg-[#40E0FF]/90 text-[#0A0A0A] font-bold text-base h-12 shadow-lg shadow-[#40E0FF]/20"
                >
                  Start WhatsApp
                </Button>
              </div>
            </div>

            {/* Book a Demo Card */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#40E0FF]/40 group fade-in-up-delay-2 glass-panel"
              style={{ background: 'linear-gradient(135deg, rgba(10,12,16,0.85) 70%, rgba(14,165,233,0.05) 100%)' }}
            >
              {/* Animated top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#0EA5E9]/15 border border-[#0EA5E9]/20">
                  <Calendar className="size-8 text-[#0EA5E9]" />
                </div>

                <h3
                  className="text-2xl font-bold text-[#F1F5F9] mb-3"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Book a Live Demo
                </h3>

                <p className="text-white/60 mb-6 leading-relaxed">
                  30-minute walkthrough tailored to your clinic workflows.
                </p>

                <Button
                  onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
                  className="w-full border border-white/10 bg-transparent text-white hover:bg-white/5 font-bold text-base h-12"
                >
                  Book Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="text-center fade-in-up-delay-3">
            <p className="text-white/40 mb-2">Or email us at</p>
            <a
              href="mailto:hello@callendar.my"
              className="text-[#40E0FF] hover:text-[#40E0FF]/80 font-semibold text-lg transition-colors duration-200"
            >
              hello@callendar.my
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
