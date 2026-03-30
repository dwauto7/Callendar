import { Zap, BarChart3, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function AutomationServices() {
  return (
    <section id="automation" className="py-24 md:py-28 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Automation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            Enterprise Automation Services
          </h2>
          <p className="text-white/40 mt-2">
            Custom AI solutions tailored to your clinic's unique workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Service 1 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap className="size-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Integration</h3>
              <p className="text-sm text-white/40 mb-4">
                Integrate Callendar with your existing systems (EMR, CRM, booking platforms)
              </p>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest">Seamless workflow</p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <BarChart3 className="size-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Advanced Analytics</h3>
              <p className="text-sm text-white/40 mb-4">
                Real-time dashboards, predictive insights, and performance metrics
              </p>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest">Data-driven decisions</p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <MessageSquare className="size-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom AI Voice</h3>
              <p className="text-sm text-white/40 mb-4">
                Train AI agents with your clinic's brand voice and protocols
              </p>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest">Brand consistency</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/40 text-sm mb-6">
            Ready to transform your clinic? Let's talk about your specific needs.
          </p>
          <Link
            href="/consultancy"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-[#0B0D10] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}