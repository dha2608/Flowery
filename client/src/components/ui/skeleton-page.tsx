export function SkeletonPage() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[40vh] bg-gradient-to-b from-primary-50/60 to-transparent" />

      <div className="container-wide px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Title skeleton */}
        <div className="h-10 w-72 bg-stone-200/60 rounded-xl mb-4" />
        <div className="h-5 w-96 bg-stone-200/40 rounded-lg mb-8" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-100 overflow-hidden"
            >
              <div className="aspect-square bg-stone-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-stone-200/60 rounded-lg" />
                <div className="h-3 w-1/2 bg-stone-200/40 rounded-lg" />
                <div className="h-5 w-1/3 bg-primary-100/60 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="p-6 animate-pulse space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-stone-100 p-5"
          >
            <div className="h-3 w-20 bg-stone-200/60 rounded mb-3" />
            <div className="h-8 w-24 bg-stone-200/40 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="h-5 w-40 bg-stone-200/60 rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-stone-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 bg-stone-200/40 rounded" />
                <div className="h-3 w-1/3 bg-stone-200/30 rounded" />
              </div>
              <div className="h-6 w-16 bg-primary-100/40 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonAuth() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="text-center space-y-2">
        <div className="h-7 w-48 bg-stone-200/60 rounded-lg mx-auto" />
        <div className="h-4 w-64 bg-stone-200/40 rounded mx-auto" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 bg-stone-200/50 rounded mb-2" />
            <div className="h-11 bg-stone-100 rounded-xl" />
          </div>
        ))}
        <div className="h-11 bg-primary-200/50 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="container-wide px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-stone-200/40 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square bg-stone-100 rounded-2xl" />

          {/* Info */}
          <div className="space-y-6">
            <div className="h-4 w-24 bg-primary-100/60 rounded-full" />
            <div className="h-9 w-3/4 bg-stone-200/60 rounded-xl" />
            <div className="h-5 w-1/3 bg-stone-200/40 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-stone-200/30 rounded" />
              <div className="h-4 w-5/6 bg-stone-200/30 rounded" />
              <div className="h-4 w-2/3 bg-stone-200/30 rounded" />
            </div>
            <div className="h-12 w-full bg-primary-200/50 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
