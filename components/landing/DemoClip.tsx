import Link from 'next/link'

export function DemoClip() {
  return (
    <section id="demo" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.25em]">Live Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            See AI In Action
          </h2>
          <p className="text-white/40 mt-2 text-sm">
            Watch how our AI handles incoming clinic calls intelligently
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden shadow-2xl mb-8">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full aspect-video object-cover relative z-10"
          >
            <source src="https://website.beaconhorizons.io/demo%20website.mp4" />
            {/* Fallback for unsupported browsers */}
            <p className="text-white text-center p-8">
              Your browser does not support the video tag.
              <Link href="/demo" className="text-[#2DD4BF] hover:underline"> Book a demo instead &rarr;</Link>
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
              className="bg-[#2DD4BF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#2DD4BF]/90 transition-colors"
            >
              Try It Live
            </Link>
            <Link
              href="/consultancy"
              className="border border-[#212129] text-white/60 font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:border-[#2DD4BF]/40 hover:text-white transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
