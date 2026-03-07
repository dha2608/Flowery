import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Skeleton – base animated shimmer block
// ---------------------------------------------------------------------------

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-surface-secondary',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_1.5s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className
      )}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// SkeletonCard – image area + 3 text lines
// ---------------------------------------------------------------------------

function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface-elevated overflow-hidden', className)}>
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-none" />
      {/* Text lines */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonList – grid of SkeletonCards
// ---------------------------------------------------------------------------

interface SkeletonListProps {
  count?: number;
  className?: string;
  columns?: 2 | 3 | 4;
}

function SkeletonList({ count = 8, className, columns = 4 }: SkeletonListProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4 md:gap-6', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonText – paragraph of lines
// ---------------------------------------------------------------------------

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-4/6' : 'w-full')}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonHero – full hero section
// ---------------------------------------------------------------------------

function SkeletonHero() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-b from-surface-secondary to-surface">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl px-4">
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-36 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonText, SkeletonHero };
export type { SkeletonProps, SkeletonListProps, SkeletonTextProps };
