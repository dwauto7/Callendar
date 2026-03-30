import { TrendingUp, Clock, Phone } from 'lucide-react'

const stats = [
  {
    label: 'Avg clinic saves',
    value: '18.5 staff hours / month',
    icon: Clock,
  },
  {
    label: 'Avg fewer missed calls',
    value: '31% reduction',
    icon: Phone,
  },
  {
    label: 'Avg appointments booked',
    value: '42 / month',
    icon: TrendingUp,
  },
]

export function ResultsBand() {
  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] glass-panel px-6 py-6 md:px-10 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-[#40E0FF]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    {label}
                  </p>
                  <p className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
