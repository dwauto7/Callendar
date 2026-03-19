export default function Loading() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto space-y-6">
      <div className="h-12 w-48 bg-white/5 rounded-xl animate-pulse" />
      <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
