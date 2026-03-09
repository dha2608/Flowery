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
}

/**
 * Optimized Image component with built-in error handling.
 * Uses Next.js Image for automatic optimization (WebP, lazy loading, responsive).
 * Shows a styled fallback when the image fails to load.
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
  containerClassName: _containerClassName,
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
}: AppImageProps) {
  const [error, setError] = useState(false);

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
      <Image
        src={src}
        alt={alt}
        className={cn(objectFitClass, className)}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        onError={() => setError(true)}
        loading={priority ? undefined : 'lazy'}
        unoptimized={unoptimized}
      />
    );
  }

  // Fill mode - image fills its container
  // Container must have position:relative and defined dimensions
  return (
    <Image
      src={src}
      alt={alt}
      className={cn(objectFitClass, className)}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      onError={() => setError(true)}
      loading={priority ? undefined : 'lazy'}
      unoptimized={unoptimized}
    />
  );
}
