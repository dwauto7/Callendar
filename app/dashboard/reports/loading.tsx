export default function Loading() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto space-y-6">
      <div className="h-12 w-48 bg-white/5 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-8 w-full bg-white/5 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
      </div>
      <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
    </div>
  )
}
