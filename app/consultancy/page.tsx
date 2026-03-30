'use client'

import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormData = {
  clinic_name: string
  contact_name: string
  email: string
  phone: string
  service_type: 'custom_integration' | 'advanced_analytics' | 'custom_voice' | 'other'
  message: string
}

const DEFAULT: FormData = {
  clinic_name: '',
  contact_name: '',
  email: '',
  phone: '',
  service_type: 'custom_integration',
  message: '',
}

// Amber color matching landing page theme
const ACCENT_COLOR = '#FFA500'
const ACCENT_LIGHT = 'rgba(255, 165, 0, 0.1)'
const ACCENT_BORDER = 'rgba(255, 165, 0, 0.2)'

export default function ConsultancyPage() {
  const [form, setForm] = React.useState<FormData>(DEFAULT)
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/send-consultancy-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to send consultancy request')
      }

      setSubmitted(true)
      setForm(DEFAULT)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-sm'
  const labelCls = 'block text-[11px] uppercase tracking-[0.2em] text-amber-500 font-bold mb-2'

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
            'linear-gradient(rgba(255,165,0,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.25) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10">
        <section className="py-24 md:py-32 bg-background relative">
          <div className="max-w-4xl mx-auto px-6">
            {/* Hero */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Expert Guidance</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                Let's Discuss Your Clinic's Needs
              </h1>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Schedule a free consultancy with our team to explore custom AI solutions tailored to your workflow.
              </p>
            </div>

            {!submitted ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Contact Name</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Dr. Sarah Johnson"
                        value={form.contact_name}
                        onChange={e => set('contact_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="e.g. sarah@clinic.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Clinic Name & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Clinic Name</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Insight Chiropractic"
                        value={form.clinic_name}
                        onChange={e => set('clinic_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="e.g. +60123456789"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className={labelCls}>Service Interest</label>
                    <select
                      className={cn(inputCls, 'cursor-pointer')}
                      value={form.service_type}
                      onChange={e => set('service_type', e.target.value as FormData['service_type'])}
                    >
                      <option value="custom_integration" className="bg-[#0B0D10]">Custom Integration with Existing Systems</option>
                      <option value="advanced_analytics" className="bg-[#0B0D10]">Advanced Analytics & Dashboards</option>
                      <option value="custom_voice" className="bg-[#0B0D10]">Custom AI Voice & Training</option>
                      <option value="other" className="bg-[#0B0D10]">Other / Not Sure</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>Tell Us About Your Clinic</label>
                    <textarea
                      className={cn(inputCls, 'resize-none h-32')}
                      placeholder="Describe your clinic, current pain points, and what you hope to achieve with automation..."
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm font-mono uppercase tracking-tight">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-amber-500 text-[#0B0D10] font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Consultancy Request
                        <ChevronRight className="size-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-white/30">
                    We'll review your request and respond within 24 hours.
                  </p>
                </form>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 backdrop-blur p-12 text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <CheckCircle2 className="size-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Request Sent Successfully
                </h2>
                <p className="text-white/40 mb-6">
                  Thank you, <span className="text-amber-500 font-semibold">{form.contact_name}</span>! We've received your consultancy request and will be in touch shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold rounded-xl hover:bg-amber-500/20 transition-all"
                >
                  Send Another Request
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}