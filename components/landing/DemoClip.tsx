import Link from 'next/link'

export function DemoClip() {
  return (
    <section id="demo" className="py-24 md:py-28 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Live Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            See AI In Action
          </h2>
          <p className="text-white/40 mt-2">
            Watch how our AI handles incoming clinic calls intelligently
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-3xl border border-white/10 bg-[#0B0D10] overflow-hidden shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-amber-500/10 pointer-events-none" />
          
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            controls
            className="w-full aspect-video object-cover relative z-10"
          >
            <source src="https://website.aiblizzard.work/demo%20website.mp4" />
            {/* Fallback for unsupported browsers */}
            <p className="text-white text-center p-8">
              Your browser does not support the video tag. 
              <Link href="/demo" className="text-amber-500 hover:underline"> Book a demo instead →</Link>
            </p>
          </video>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <p className="text-white/40 text-sm">
            Experience the AI agent handling patient inquiries, booking appointments, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-4 bg-amber-500 text-[#0B0D10] font-bold uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all text-sm"
            >
              Try It Live
            </Link>
            <Link
              href="/consultancy"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:border-amber-500/30 transition-all text-sm"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}