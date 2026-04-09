export default function Loading() {
  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto space-y-6">
      <div className="h-10 w-32 bg-black/20 rounded-xl animate-pulse" />
      <div className="h-48 bg-black/20 rounded-2xl animate-pulse" />
      <div className="h-48 bg-black/20 rounded-2xl animate-pulse" />
      <div className="h-32 bg-black/20 rounded-2xl animate-pulse" />
    </div>
  )
}

