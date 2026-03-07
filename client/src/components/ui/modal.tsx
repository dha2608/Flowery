'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  /** Prevent closing when clicking the backdrop (default: false) */
  disableBackdropClose?: boolean;
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  disableBackdropClose = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Focus trap
  const trapFocus = useCallback((e: globalThis.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', trapFocus);
    document.body.style.overflow = 'hidden';

    // Move focus into the panel
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, trapFocus]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!disableBackdropClose) onClose();
  };

  return createPortal(
    // Backdrop
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/40 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-xl outline-none',
          'animate-in zoom-in-95 fade-in duration-200',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 id="modal-title" className="text-base font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'rounded-lg p-1.5 text-gray-400 transition-colors',
                'hover:bg-gray-100 hover:text-gray-600',
                'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring-2'
              )}
              aria-label="Đóng"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export type { ModalProps };
