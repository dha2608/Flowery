'use client';

import { cn } from '@/lib/utils';

interface ProductSkeletonProps {
  className?: string;
}

interface ProductListSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

// Base shimmer animation class
const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

/**
 * Skeleton for product detail page
 */
export function ProductDetailSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn('min-h-screen py-8', className)}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-2">
          {[80, 60, 100, 120].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn('h-4 rounded bg-stone-200', shimmer)} style={{ width: w }} />
              {i < 3 && <span className="text-stone-300">/</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image gallery skeleton */}
          <div>
            {/* Main image */}
            <div className={cn('mb-4 aspect-square rounded-2xl bg-stone-200', shimmer)} />

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={cn('h-20 w-20 rounded-xl bg-stone-200', shimmer)} />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            {/* Badge */}
            <div className={cn('h-6 w-20 rounded-full bg-stone-200', shimmer)} />

            {/* Title */}
            <div className={cn('h-8 w-3/4 rounded bg-stone-200', shimmer)} />

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className={cn('h-10 w-32 rounded bg-stone-200', shimmer)} />
              <div className={cn('h-6 w-24 rounded bg-stone-200', shimmer)} />
            </div>

            {/* Shop info */}
            <div className="flex items-center gap-3 rounded-xl bg-stone-100 p-4">
              <div className={cn('h-12 w-12 rounded-full bg-stone-200', shimmer)} />
              <div className="space-y-2">
                <div className={cn('h-4 w-24 rounded bg-stone-200', shimmer)} />
                <div className={cn('h-3 w-32 rounded bg-stone-200', shimmer)} />
              </div>
            </div>

            {/* Quantity and Add to cart */}
            <div className="flex items-center gap-4">
              <div className={cn('h-12 w-32 rounded-xl bg-stone-200', shimmer)} />
              <div className={cn('h-12 flex-1 rounded-xl bg-stone-200', shimmer)} />
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <div className={cn('h-5 w-24 rounded bg-stone-200', shimmer)} />
              <div className={cn('h-4 w-full rounded bg-stone-200', shimmer)} />
              <div className={cn('h-4 w-5/6 rounded bg-stone-200', shimmer)} />
              <div className={cn('h-4 w-4/5 rounded bg-stone-200', shimmer)} />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn('h-6 w-16 rounded-full bg-stone-200', shimmer)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for single product card
 */
export function ProductCardSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-stone-100 bg-white', className)}>
      {/* Image */}
      <div className={cn('aspect-square bg-stone-200', shimmer)} />

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Shop name */}
        <div className={cn('h-3 w-20 rounded bg-stone-200', shimmer)} />

        {/* Product name */}
        <div className={cn('h-5 w-3/4 rounded bg-stone-200', shimmer)} />

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className={cn('h-5 w-24 rounded bg-stone-200', shimmer)} />
          <div className={cn('h-4 w-16 rounded bg-stone-200', shimmer)} />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className={cn('h-5 w-12 rounded-full bg-stone-200', shimmer)} />
          <div className={cn('h-5 w-14 rounded-full bg-stone-200', shimmer)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for product grid/list
 */
export function ProductListSkeleton({
  count = 8,
  columns = 4,
  className,
}: ProductListSkeletonProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for flower card (similar to product but with meaning badge)
 */
export function FlowerCardSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-stone-100 bg-white', className)}>
      {/* Image with badge */}
      <div className="relative">
        <div className={cn('aspect-[4/5] bg-stone-200', shimmer)} />
        <div className={cn('absolute top-3 left-3 h-6 w-20 rounded-full bg-stone-200', shimmer)} />
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        {/* Flower name */}
        <div className={cn('h-5 w-2/3 rounded bg-stone-200', shimmer)} />

        {/* Meaning */}
        <div className={cn('h-4 w-full rounded bg-stone-200', shimmer)} />
        <div className={cn('h-4 w-3/4 rounded bg-stone-200', shimmer)} />
      </div>
    </div>
  );
}

/**
 * Skeleton for flower grid/list
 */
export function FlowerListSkeleton({
  count = 8,
  columns = 4,
  className,
}: ProductListSkeletonProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <FlowerCardSkeleton key={i} />
      ))}
    </div>
  );
}
