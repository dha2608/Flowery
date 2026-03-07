import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-gray-100 text-gray-700 ring-gray-200',
      primary: 'bg-primary-100 text-primary-700 ring-primary-200',
      success: 'bg-accent-100 text-accent-700 ring-accent-200',
      warning: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
      danger: 'bg-red-100 text-red-700 ring-red-200',
      info: 'bg-blue-100 text-blue-700 ring-blue-200',
    };

    const sizes: Record<BadgeSize, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = 'Badge';

export { Badge, type BadgeProps };
