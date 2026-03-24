'use client'

import { useState } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    clinicName: '',
    mobile: '',
    role: 'Owner',
  })

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!consent) {
      setError('Please provide consent before submitting.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          clinic_name: form.clinicName,
          phone: form.mobile,
          role: form.role,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden grain py-20">
        <div className="absolute inset-0 aurora-bg pointer-events-none" />
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
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#40E0FF]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6 fade-in-up">
            <span className="text-xs font-semibold text-[#40E0FF]">Talk to the team</span>
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

      {/* CTA Cards + Form Section */}
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* WhatsApp Card */}
            <div
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#40E0FF]/40 group fade-in-up-delay-1 glass-panel"
              style={{ background: 'linear-gradient(135deg, rgba(10,12,16,0.85) 70%, rgba(64,224,255,0.05) 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#40E0FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#40E0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#40E0FF]/15 border border-[#40E0FF]/20">
                  <MessageCircle className="size-8 text-[#40E0FF]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F1F5F9] mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
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
            <div
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#40E0FF]/40 group fade-in-up-delay-2 glass-panel"
              style={{ background: 'linear-gradient(135deg, rgba(10,12,16,0.85) 70%, rgba(14,165,233,0.05) 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              <div className="relative z-10">
                <div className="size-16 rounded-xl flex items-center justify-center mb-6 bg-[#0EA5E9]/15 border border-[#0EA5E9]/20">
                  <Calendar className="size-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F1F5F9] mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
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

          {/* Demo Request Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 glass-panel">
            <div className="max-w-2xl mx-auto">
              <h2
                className="text-3xl font-bold text-[#F1F5F9] mb-2 text-center"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Request an AI Demo Call
              </h2>
              <p className="text-white/60 text-center mb-8">
                Share a few details so Aya can personalize your demo.
              </p>

              {submitted ? (
                <div className="rounded-xl border border-[#40E0FF]/30 bg-[#40E0FF]/10 text-[#E0F7FF] text-sm px-6 py-6 text-center space-y-2">
                  <p className="text-lg font-bold text-white">You&apos;re all set! 🎉</p>
                  <p>Aya will be calling <span className="text-[#40E0FF] font-semibold">{form.mobile}</span> within 5 minutes.</p>
                  <p className="text-white/60 text-xs">Check <span className="text-white">{form.email}</span> for a confirmation email. Keep your phone nearby!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name + Clinic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your name"
                        className="w-full h-11 rounded-xl border border-white/10 bg-[#0B0E12] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#40E0FF] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-2 block">Clinic Name</label>
                      <input
                        type="text"
                        required
                        value={form.clinicName}
                        onChange={(e) => handleChange('clinicName', e.target.value)}
                        placeholder="Clinic name"
                        className="w-full h-11 rounded-xl border border-white/10 bg-[#0B0E12] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#40E0FF] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email (full width) */}
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@clinic.com"
                      className="w-full h-11 rounded-xl border border-white/10 bg-[#0B0E12] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#40E0FF] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Row 3: Mobile + Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-2 block">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={form.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="+60 12-345 6789"
                        className="w-full h-11 rounded-xl border border-white/10 bg-[#0B0E12] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#40E0FF] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-2 block">Role</label>
                      <select
                        value={form.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="w-full h-11 rounded-xl border border-white/10 bg-[#0B0E12] px-4 text-sm text-white focus:border-[#40E0FF] focus:outline-none transition-colors"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Manager">Manager</option>
                        <option value="Receptionist">Receptionist</option>
                      </select>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-[#F1F5F9] mb-2">Consent for AI Demo Call</p>
                    <p className="text-xs text-white/70 leading-relaxed mb-3">
                      By clicking &quot;Request Demo,&quot; I provide Express Consent for Beacon Horizons Solutions to:
                    </p>
                    <ul className="list-disc ml-5 text-xs text-white/70 space-y-1 mb-3">
                      <li>Place an automated AI voice call (Aya) to my provided number for demonstration purposes.</li>
                      <li>Process my voice data as Sensitive Personal Data under the PDPA 2024/2026.</li>
                      <li>Transfer my data to secure servers in Singapore/USA for processing.</li>
                    </ul>
                    <p className="text-xs text-white/70 mb-4">
                      I understand that I can opt-out or request data deletion at any time by emailing{' '}
                      <a href="mailto:demo@aiblizzard.work" className="text-[#40E0FF]">demo@aiblizzard.work</a>.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 accent-[#40E0FF]"
                      />
                      <span className="text-xs text-white/60">
                        I have read and agree to the above consent terms.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <p className="text-[#EF7E71] text-xs">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#40E0FF] hover:bg-[#40E0FF]/90 text-[#0A0A0A] font-bold text-base h-12 shadow-lg shadow-[#40E0FF]/20 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Request Demo'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className="text-center mt-12 fade-in-up-delay-3">
            <p className="text-white/40 mb-2">Or email us at</p>
            <a
              href="mailto:demo@aiblizzard.work"
              className="text-[#40E0FF] hover:text-[#40E0FF]/80 font-semibold text-lg transition-colors duration-200"
            >
              demo@aiblizzard.work
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
