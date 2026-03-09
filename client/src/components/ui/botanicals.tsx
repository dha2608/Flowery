'use client';

import { cn } from '@/lib/utils';

// ─── Inline SVG Botanical Decorations ─────────────────────────────────────────
// These replace emoji with elegant SVG flower/plant motifs that feel organic

/** Simple petal cluster — used as section accents */
export function PetalAccent({ className }: { className?: string }) {
  return (
    <svg
      className={cn('text-primary-400 h-6 w-6', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 14.5 6 14.5 9.5C14.5 11.5 13.4 13 12 13C10.6 13 9.5 11.5 9.5 9.5C9.5 6 12 2 12 2Z"
        opacity="0.9"
      />
      <path
        d="M12 2C12 2 17 5 18.5 8C19.5 10 19 12 17.5 12.5C16 13 14.5 11.5 13.5 9.5C12 6.5 12 2 12 2Z"
        opacity="0.6"
      />
      <path
        d="M12 2C12 2 7 5 5.5 8C4.5 10 5 12 6.5 12.5C8 13 9.5 11.5 10.5 9.5C12 6.5 12 2 12 2Z"
        opacity="0.6"
      />
      <circle cx="12" cy="13" r="1.5" opacity="0.8" />
      <path d="M12 14.5V22" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path
        d="M12 18C10 17 8.5 18 8 19"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

/** Rose outline — brand icon for headers and logos */
export function RoseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('text-primary-500 h-5 w-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3C12 3 8 7 8 11C8 14 10 16 12 16C14 16 16 14 16 11C16 7 12 3 12 3Z" />
      <path d="M12 7C13 8.5 14.5 9 15 11" opacity="0.5" />
      <path d="M12 7C11 8.5 9.5 9 9 11" opacity="0.5" />
      <path d="M12 16V21" />
      <path d="M12 18C10.5 17 9 17.5 8.5 18.5" />
      <path d="M12 19C13.5 18 15 18.5 15.5 19.5" />
    </svg>
  );
}

/** Leaf pair — for section dividers or bullet points */
export function LeafPair({ className }: { className?: string }) {
  return (
    <svg
      className={cn('text-accent-400 h-5 w-5', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 22V8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 8C12 8 6 4 4 6C2 8 5 12 12 12" opacity="0.6" />
      <path d="M12 12C12 12 18 8 20 10C22 12 19 16 12 16" opacity="0.5" />
    </svg>
  );
}

/** Decorative vine border — use as section separator */
export function VineDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-4', className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
      <PetalAccent className="text-primary-300 h-4 w-4" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
    </div>
  );
}

/** Floating petal decoration for backgrounds */
export function FloatingPetals({ count = 6, className }: { count?: number; className?: string }) {
  // Deterministic positions to avoid hydration mismatch
  const petals = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 17 + 5) % 100}%`,
    top: `${(i * 23 + 10) % 100}%`,
    delay: i * 0.8,
    size: 8 + (i % 3) * 4,
    rotation: i * 60,
    opacity: 0.08 + (i % 3) * 0.04,
  }));

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {petals.map((petal, i) => (
        <svg
          key={i}
          className="animate-float text-primary-300 absolute"
          style={{
            left: petal.left,
            top: petal.top,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${6 + (i % 3) * 2}s`,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
          }}
          width={petal.size}
          height={petal.size}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <ellipse cx="6" cy="4" rx="3" ry="5" />
        </svg>
      ))}
    </div>
  );
}

/** Background pattern - subtle dot grid */
export function DotPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(232,77,110,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}

/** Warm gradient blob for section backgrounds */
export function GradientBlob({
  className,
  color = 'primary',
}: {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
}) {
  const colors = {
    primary: 'from-primary-100/40 via-rose-50/30 to-transparent',
    secondary: 'from-secondary-100/40 via-amber-50/30 to-transparent',
    accent: 'from-accent-100/40 via-emerald-50/30 to-transparent',
  };

  return (
    <div
      className={cn(
        'bg-gradient-radial pointer-events-none absolute rounded-full blur-3xl',
        colors[color],
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Section heading with decorative accent */
export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      <div className={cn('mb-3 flex items-center gap-2', align === 'center' && 'justify-center')}>
        <LeafPair className="h-4 w-4" />
        <span className="text-primary-500 text-xs font-semibold tracking-[0.2em] uppercase">
          Flowery
        </span>
        <LeafPair className="h-4 w-4 -scale-x-100" />
      </div>
      <h2 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-stone-500">{subtitle}</p>}
    </div>
  );
}

/** Color swatch for filter chips */
export function ColorSwatch({
  color,
  size = 'sm',
  selected,
  className,
}: {
  color: string;
  size?: 'sm' | 'md';
  selected?: boolean;
  className?: string;
}) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5' };
  return (
    <span
      className={cn(
        'inline-block rounded-full border-2 transition-transform',
        sizes[size],
        selected ? 'scale-110 border-stone-900 ring-2 ring-stone-900/20' : 'border-white shadow-sm',
        className
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

/** Warm card wrapper with subtle gradient background */
export function WarmCard({
  children,
  className,
  hoverEffect = true,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-stone-100 bg-white p-6',
        'shadow-sm',
        hoverEffect &&
          'transition-[box-shadow,border-color] duration-300 ease-out hover:border-stone-200 hover:shadow-md',
        className
      )}
    >
      {/* Subtle corner decoration */}
      <div
        className="from-primary-50 pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
