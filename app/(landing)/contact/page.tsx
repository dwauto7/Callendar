'use client'

import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { MessageCircle, Calendar, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden grain py-20">
        {/* Aurora background */}
        <div className="absolute inset-0 aurora-bg pointer-events-none" />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(#10B981 1px, transparent 1px),
              linear-gradient(90deg, #10B981 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full px-4 py-1.5 mb-6 fade-in-up">
            <span className="text-xs font-semibold text-[#10B981]">
              Get in touch
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F1F5F9] leading-[1.1] tracking-tight mb-6 fade-in-up-delay-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Let&apos;s Talk
          </h1>

          <p className="text-xl text-[#64748B] leading-relaxed mb-8 max-w-2xl mx-auto fade-in-up-delay-2">
            Have questions about Callendar? We usually respond within 1 business hour.
          </p>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* WhatsApp Card */}
            <div className="relative rounded-2xl border border-[#1E2128] bg-[#111318] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#10B981]/40 group fade-in-up-delay-1"
              style={{ background: 'linear-gradient(135deg, #111318 70%, #10B98106 100%)' }}
            >
              {/* Animated top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#10B981]/15">
                  <MessageCircle className="size-8 text-[#10B981]" />
                </div>

                <h3
                  className="text-2xl font-bold text-[#F1F5F9] mb-3"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Chat on WhatsApp
                </h3>

                <p className="text-[#64748B] mb-6 leading-relaxed">
                  Fastest way to reach us. Ask anything — demos, pricing, setup.
                </p>

                <Button
                  onClick={() => window.open('https://wa.me/601114399466', '_blank')}
                  className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-bold text-base h-12 shadow-lg shadow-[#10B981]/20"
                >
                  WhatsApp Us
                </Button>
              </div>
            </div>

            {/* Book a Demo Card */}
            <div className="relative rounded-2xl border border-[#1E2128] bg-[#111318] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#10B981]/40 group fade-in-up-delay-2"
              style={{ background: 'linear-gradient(135deg, #111318 70%, #14B8A606 100%)' }}
            >
              {/* Animated top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#14B8A6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#14B8A6]/15">
                  <Calendar className="size-8 text-[#14B8A6]" />
                </div>

                <h3
                  className="text-2xl font-bold text-[#F1F5F9] mb-3"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Book a Demo Call
                </h3>

                <p className="text-[#64748B] mb-6 leading-relaxed">
                  30-minute live walkthrough of Callendar for your clinic.
                </p>

                <Button
                  onClick={() => window.open('https://calendly.com/dwautomate7/30min', '_blank')}
                  className="w-full border border-[#1E2128] bg-transparent text-[#F1F5F9] hover:bg-[#1E2128] font-bold text-base h-12"
                >
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="text-center fade-in-up-delay-3">
            <p className="text-[#64748B] mb-2">Or email us at</p>
            <a
              href="mailto:hello@callendar.my"
              className="text-[#10B981] hover:text-[#10B981]/80 font-semibold text-lg transition-colors duration-200"
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
