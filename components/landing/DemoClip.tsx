import Link from 'next/link'

export function DemoClip() {
  return (
    <section id="demo" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-[#40E0FF]/20 bg-[#40E0FF]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] font-black text-[#40E0FF] uppercase tracking-[0.25em]">Live Demo</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            See AI <span className="text-[#40E0FF]">In Action</span>
          </h2>
          <p className="text-[#D9E4E6]/65 mt-4 text-sm">
            Watch how our AI handles incoming clinic calls intelligently
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-lg border border-[#40E0FF]/20 bg-[#0E1517] overflow-hidden shadow-2xl shadow-[#40E0FF]/10 mb-8">
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
              <Link href="/demo" className="text-[#40E0FF] hover:underline"> Book a demo instead &rarr;</Link>
            </p>
          </video>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="bg-[#40E0FF] text-[#0A0A0B] font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:bg-[#79EBFF] transition-colors"
            >
              Try It Live
            </Link>
            <Link
              href="/consultancy"
              className="border border-white/18 text-white/72 font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-full hover:border-[#40E0FF]/50 hover:text-white transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
