'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppImageProps {
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
  fallbackClassName?: string;
  unoptimized?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Show shimmer loading placeholder */
  showPlaceholder?: boolean;
}

/**
 * Optimized Image component with built-in error handling and loading states.
 * Uses Next.js Image for automatic optimization (WebP, lazy loading, responsive).
 * Shows a styled fallback when the image fails to load.
 * Supports shimmer placeholder during loading.
 *
 * Note: Unsplash images are loaded unoptimized to avoid CORS issues with Next.js optimizer.
 *
 * Usage patterns:
 * - For fill container: wrap in relative div with aspect-ratio or height, use fill={true}
 * - For fixed size: provide width and height props
 * - Default: uses fill={true} for responsive behavior
 *
 * IMPORTANT: When using fill mode (default), the parent element MUST have:
 * - position: relative (or absolute/fixed)
 * - defined dimensions (width/height or aspect-ratio)
 */
export function AppImage({
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
  fallbackClassName,
  unoptimized: unoptimizedProp = false,
  objectFit = 'cover',
  showPlaceholder = true,
}: AppImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-detect Unsplash URLs and bypass Next.js optimizer (CORS issues)
  const isUnsplash = src?.includes('images.unsplash.com');
  const unoptimized = unoptimizedProp || isUnsplash;

  // Object fit class mapping
  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  }[objectFit];

  // Shimmer placeholder component
  const ShimmerPlaceholder = () => (
    <div
      className={cn(
        'animate-shimmer absolute inset-0 bg-stone-100',
        'transition-opacity duration-300',
        isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden="true"
    />
  );

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-stone-100',
          fallbackClassName ?? className
        )}
        style={{ width: width ?? '100%', height: height ?? '100%' }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        {fallbackIcon ?? <ImageOff className="h-6 w-6 text-stone-300" />}
      </div>
    );
  }

  // If explicit width/height provided and fill is false, use fixed dimensions
  if (width && height && !fill) {
    return (
      <div className="relative inline-block" style={{ width, height }}>
        {showPlaceholder && <ShimmerPlaceholder />}
        <Image
          src={src}
          alt={alt}
          className={cn(
            objectFitClass,
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          onError={() => setError(true)}
          onLoad={() => setIsLoading(false)}
          loading={priority ? undefined : 'lazy'}
          unoptimized={unoptimized}
        />
      </div>
    );
  }

  // Fill mode - image fills its container
  // Wrapper ensures position:relative so Next.js Image fill works correctly
  return (
    <div className={cn('relative h-full w-full', containerClassName)}>
      {showPlaceholder && <ShimmerPlaceholder />}
      <Image
        src={src}
        alt={alt}
        className={cn(
          objectFitClass,
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        loading={priority ? undefined : 'lazy'}
        unoptimized={unoptimized}
      />
    </div>
  );
}
