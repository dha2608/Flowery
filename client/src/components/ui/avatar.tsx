'use client';

import { type ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** Display name — used to derive initials when src is absent/broken */
  name?: string;
  size?: AvatarSize;
}

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',   // 32px
  md: 'h-10 w-10 text-sm', // 40px
  lg: 'h-14 w-14 text-lg', // 56px
  xl: 'h-20 w-20 text-2xl', // 80px
};

/** Derive up to two uppercase initials from a display name. */
function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generates a deterministic pastel background color for the initials fallback,
 * cycling through the primary (pink) palette shades.
 */
function getColorClass(name?: string): string {
  const palette = [
    'bg-primary-100 text-primary-700',
    'bg-primary-200 text-primary-800',
    'bg-accent-100 text-accent-700',
    'bg-accent-200 text-accent-800',
    'bg-rose-100 text-rose-700',
    'bg-fuchsia-100 text-fuchsia-700',
  ];
  if (!name) return palette[0];
  const code = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[code % palette.length];
}

function Avatar({ src, name, size = 'md', className, alt, ...props }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;
  const initials = getInitials(name);
  const colorClass = getColorClass(name);

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        sizes[size],
        showFallback && colorClass,
        className,
      )}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt ?? name ?? 'avatar'}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <span aria-label={name} className="font-semibold leading-none select-none">
          {initials}
        </span>
      )}
    </span>
  );
}

export { Avatar, type AvatarProps };
