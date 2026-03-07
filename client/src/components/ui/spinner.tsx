import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}

const spinnerSizes: Record<SpinnerSize, { svg: string; text: string }> = {
  sm: { svg: 'h-4 w-4', text: 'text-xs' },
  md: { svg: 'h-6 w-6', text: 'text-sm' },
  lg: { svg: 'h-10 w-10', text: 'text-sm' },
};

function Spinner({ size = 'md', label, className, ...props }: SpinnerProps) {
  const { svg, text } = spinnerSizes[size];

  return (
    <div
      className={cn('inline-flex flex-col items-center gap-2', className)}
      role="status"
      aria-label={label ?? 'Đang tải…'}
      {...props}
    >
      <svg
        className={cn('animate-spin text-primary-500', svg)}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
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
      {label && <span className={cn('text-gray-500', text)}>{label}</span>}
    </div>
  );
}

export { Spinner, type SpinnerProps };
