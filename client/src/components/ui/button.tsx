import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Professional hover: gentle shadow lift with cubic-bezier easing.
    // No translate-y bounce — shadows alone create the depth illusion.
    const variants: Record<ButtonVariant, string> = {
      primary: [
        'bg-primary-600 text-white',
        'shadow-sm shadow-primary-600/10',
        'hover:bg-primary-700 hover:shadow-md hover:shadow-primary-600/20',
        'active:bg-primary-800 active:shadow-sm',
        'focus-visible:ring-primary-500',
      ].join(' '),
      secondary: [
        'bg-accent-600 text-white',
        'shadow-sm shadow-accent-600/10',
        'hover:bg-accent-700 hover:shadow-md hover:shadow-accent-600/20',
        'active:bg-accent-800 active:shadow-sm',
        'focus-visible:ring-accent-500',
      ].join(' '),
      outline: [
        'border border-stone-200 bg-white text-stone-700',
        'hover:bg-stone-50 hover:border-stone-300 hover:shadow-sm',
        'active:bg-stone-100',
        'focus-visible:ring-primary-500',
      ].join(' '),
      ghost: [
        'text-stone-600',
        'hover:bg-stone-100 hover:text-stone-900',
        'active:bg-stone-200',
        'focus-visible:ring-stone-500',
      ].join(' '),
      danger: [
        'bg-red-600 text-white',
        'shadow-sm shadow-red-600/10',
        'hover:bg-red-700 hover:shadow-md hover:shadow-red-600/20',
        'active:bg-red-800 active:shadow-sm',
        'focus-visible:ring-red-500',
      ].join(' '),
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          // Professional transition: 200ms with ease-out for instant response feel
          'transition-[color,background-color,border-color,box-shadow] duration-200 ease-out',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
          // Reduced motion: disable transitions
          'motion-reduce:transition-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
