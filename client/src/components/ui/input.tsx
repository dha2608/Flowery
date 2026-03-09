import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={errorId ?? helperId}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors',
              'placeholder:text-gray-400',
              'focus:ring-2 focus:ring-offset-0 focus:outline-none',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'focus:border-primary-500 focus:ring-primary-200 border-gray-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };
