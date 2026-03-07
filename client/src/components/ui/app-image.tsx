'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface AppImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fallbackIcon?: React.ReactNode;
  fallbackClassName?: string;
  unoptimized?: boolean;
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
 */
export function AppImage({
  src,
  alt = '',
  className,
  width,
  height,
  fill = true, // Default to fill for most use cases in the app
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 80,
  fallbackIcon,
  fallbackClassName,
  unoptimized: unoptimizedProp = false,
}: AppImageProps) {
  const [error, setError] = useState(false);

  // Auto-detect Unsplash URLs and bypass Next.js optimizer (CORS issues)
  const isUnsplash = src?.includes('images.unsplash.com');
  const unoptimized = unoptimizedProp || isUnsplash;

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-100 ${fallbackClassName ?? className ?? ''}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        {fallbackIcon ?? <ImageOff className="w-6 h-6 text-stone-300" />}
      </div>
    );
  }

  // If explicit width/height provided, use those instead of fill
  if (width && height && !fill) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
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

  // Default fill mode for responsive images
  // Note: Parent element MUST have position: relative/absolute/fixed for fill to work
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        className={className}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        onError={() => setError(true)}
        loading={priority ? undefined : 'lazy'}
        unoptimized={unoptimized}
      />
    </div>
  );
}
