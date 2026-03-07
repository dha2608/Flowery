'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: 'square' | '4/3' | '3/4' | '16/9' | 'auto';
  showSkeleton?: boolean;
}

// Tiny blur placeholder SVG (10x10 gray)
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U3ZTVlNCIvPjwvc3ZnPg==';

const aspectRatioClasses = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  auto: '',
};

/**
 * Progressive Image component with blur-up loading effect.
 *
 * Features:
 * - Blur placeholder while loading
 * - Smooth fade-in transition when loaded
 * - Built-in error handling with fallback
 * - Skeleton shimmer effect option
 * - Responsive by default
 */
export function ProgressiveImage({
  src,
  alt = '',
  className,
  containerClassName,
  width,
  height,
  fill = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 80,
  fallbackIcon,
  aspectRatio = 'square',
  showSkeleton = true,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoading(false);
  }, []);

  // Auto-detect Unsplash URLs and bypass Next.js optimizer
  const isUnsplash = src?.includes('images.unsplash.com');
  const unoptimized = isUnsplash;

  // Error or no src - show fallback
  if (error || !src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-stone-100',
          aspectRatioClasses[aspectRatio],
          containerClassName
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {fallbackIcon ?? <ImageOff className="h-8 w-8 text-stone-300" />}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-stone-100',
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Skeleton shimmer while loading */}
      {isLoading && showSkeleton && (
        <div
          className={cn(
            'absolute inset-0 bg-stone-200',
            'before:absolute before:inset-0 before:-translate-x-full',
            'before:animate-[shimmer_1.5s_infinite]',
            'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'
          )}
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className={cn(
            'object-cover transition-opacity duration-500',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? undefined : 'lazy'}
          unoptimized={unoptimized}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 400}
          height={height ?? 400}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className={cn(
            'object-cover transition-opacity duration-500',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? undefined : 'lazy'}
          unoptimized={unoptimized}
        />
      )}
    </div>
  );
}
