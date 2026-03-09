import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Lift the card on hover (default: false) */
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-gray-100 bg-white shadow-sm',
        // Professional transition: shadow + border only, no translate.
        // Shadow depth change creates subtle lift illusion without jarring movement.
        'transition-[box-shadow,border-color] duration-300 ease-out',
        'motion-reduce:transition-none',
        hoverable && ['hover:shadow-md hover:shadow-gray-200/60', 'hover:border-gray-200'],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 border-b border-gray-100 px-6 py-5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// ---------------------------------------------------------------------------
// CardTitle  (optional convenience)
// ---------------------------------------------------------------------------

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base leading-tight font-semibold text-gray-900', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// ---------------------------------------------------------------------------
// CardDescription  (optional convenience)
// ---------------------------------------------------------------------------

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

// ---------------------------------------------------------------------------
// CardContent
// ---------------------------------------------------------------------------

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-5', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 rounded-b-xl border-t border-gray-100 bg-gray-50/50 px-6 py-4',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
};
