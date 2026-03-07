'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

/**
 * Client-side auth guard. Redirect unauthenticated users to /login.
 * Waits for Zustand store hydration before redirecting to prevent
 * a flash-redirect on page load for authenticated users.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Wait one tick so Zustand can hydrate from localStorage before checking.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isAuthenticated, router, pathname]);

  return { isAuthenticated, isLoading: !mounted };
}
