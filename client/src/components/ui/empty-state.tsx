import Link from 'next/link';
import { Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  /** Custom icon node. Defaults to a Flower2 icon */
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

function EmptyState({
  icon,
  title = 'Không có dữ liệu',
  description = 'Chưa có nội dung nào ở đây',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className,
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        {icon ?? <Flower2 className="h-8 w-8 text-stone-300" />}
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-sm">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Optional action */}
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="mt-1 inline-flex items-center px-5 py-2 rounded-full bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-1 inline-flex items-center px-5 py-2 rounded-full bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps, EmptyStateAction };
