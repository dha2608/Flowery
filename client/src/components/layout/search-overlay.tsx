'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flower2, Store } from 'lucide-react';
import { api } from '@/lib/api';
import { AppImage } from '@/components/ui/app-image';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlowerResult {
  _id: string;
  slug: string;
  name: { vi: string; en: string };
  images: { url: string; isPrimary?: boolean }[];
}

interface ShopResult {
  _id: string;
  slug: string;
  name: string;
  logo?: { url: string };
}

interface SearchResults {
  flowers: FlowerResult[];
  shops: ShopResult[];
}

// ---------------------------------------------------------------------------
// Hook – debounce
// ---------------------------------------------------------------------------

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Hook – focus trap
// ---------------------------------------------------------------------------

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}

// ---------------------------------------------------------------------------
// SearchOverlay
// ---------------------------------------------------------------------------

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ flowers: [], shops: [] });
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Enable focus trap when overlay is open
  useFocusTrap(panelRef, isOpen);

  // Autofocus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setResults({ flowers: [], shops: [] });
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch results whenever debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ flowers: [], shops: [] });
      return;
    }

    let cancelled = false;
    setLoading(true);

    const encoded = encodeURIComponent(debouncedQuery.trim());
    Promise.all([
      api
        .get<FlowerResult[]>(`/flowers?search=${encoded}`)
        .catch(() => ({ data: [] as FlowerResult[] })),
      api.get<ShopResult[]>(`/shops?search=${encoded}`).catch(() => ({ data: [] as ShopResult[] })),
    ]).then(([flowersRes, shopsRes]) => {
      if (!cancelled) {
        setResults({
          flowers: (flowersRes.data ?? []).slice(0, 5),
          shops: (shopsRes.data ?? []).slice(0, 4),
        });
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const hasResults = results.flowers.length > 0 || results.shops.length > 0;
  const showEmpty = !loading && debouncedQuery.trim() && !hasResults;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/flowers?search=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    },
    [query, router, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm"
        className="fixed inset-x-0 top-0 z-[61] bg-white shadow-xl"
      >
        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="flex h-16 items-center gap-3 border-b border-gray-100 px-4 sm:px-6"
        >
          {/* Search icon */}
          <svg
            className="h-5 w-5 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm hoa, cửa hàng..."
            className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
            autoComplete="off"
          />

          {/* Loading spinner */}
          {loading && (
            <svg
              className="h-4 w-4 shrink-0 animate-spin text-gray-400"
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
          )}

          {/* Clear */}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Xóa tìm kiếm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Đóng
          </button>
        </form>

        {/* Results panel */}
        {(hasResults || showEmpty) && (
          <div className="mx-auto max-h-[70vh] max-w-2xl space-y-5 overflow-y-auto px-4 py-4 sm:px-6">
            {/* Hoa */}
            {results.flowers.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Hoa
                </h3>
                <ul className="space-y-1">
                  {results.flowers.map((flower) => {
                    const primaryImg = flower.images.find((i) => i.isPrimary) ?? flower.images[0];
                    return (
                      <li key={flower._id}>
                        <Link
                          href={`/flowers/${flower.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
                        >
                          {primaryImg?.url ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                              <AppImage
                                src={primaryImg.url}
                                alt={flower.name.vi}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <span className="bg-primary-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                              <Flower2 className="text-primary-400 h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="group-hover:text-primary-700 truncate text-sm font-medium text-gray-900 transition-colors">
                              {flower.name.vi}
                            </p>
                            <p className="truncate text-xs text-gray-400">{flower.name.en}</p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Cửa hàng */}
            {results.shops.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Cửa hàng
                </h3>
                <ul className="space-y-1">
                  {results.shops.map((shop) => (
                    <li key={shop._id}>
                      <Link
                        href={`/shops/${shop.slug}`}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
                      >
                        {shop.logo?.url ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                            <AppImage
                              src={shop.logo.url}
                              alt={shop.name}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="bg-accent-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <Store className="text-accent-400 h-4 w-4" />
                          </span>
                        )}
                        <p className="group-hover:text-primary-700 truncate text-sm font-medium text-gray-900 transition-colors">
                          {shop.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* No results */}
            {showEmpty && (
              <div className="py-6 text-center text-sm text-gray-400">
                Không tìm thấy kết quả cho &ldquo;{debouncedQuery}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* Hint when empty query */}
        {!query && (
          <div className="mx-auto max-w-2xl px-4 py-6 text-center text-sm text-gray-400 sm:px-6">
            Nhập tên hoa hoặc cửa hàng bạn muốn tìm
          </div>
        )}
      </div>
    </>
  );
}
