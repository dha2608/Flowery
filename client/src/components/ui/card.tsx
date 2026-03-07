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
        'rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow',
        hoverable && 'hover:shadow-md',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 px-6 py-5 border-b border-gray-100', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// ---------------------------------------------------------------------------
// CardTitle  (optional convenience)
// ---------------------------------------------------------------------------

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-semibold leading-tight text-gray-900', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

// ---------------------------------------------------------------------------
// CardDescription  (optional convenience)
// ---------------------------------------------------------------------------

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

// ---------------------------------------------------------------------------
// CardContent
// ---------------------------------------------------------------------------

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-5', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl',
      className,
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
