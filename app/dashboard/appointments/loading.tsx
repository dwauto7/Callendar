export default function Loading() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto space-y-6">
      <div className="h-12 w-48 bg-black/20 rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-black/20 rounded-2xl animate-pulse" />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-black/20 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

