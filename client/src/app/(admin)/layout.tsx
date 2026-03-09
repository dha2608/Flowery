'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  BarChart3,
  Settings,
  ChevronLeft,
  ShieldCheck,
  Flower2,
  ShoppingCart,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Nav Config ───────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/admin/dashboard',
    label: 'Tổng quan',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: '/admin/users',
    label: 'Người dùng',
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: '/admin/shops',
    label: 'Cửa hàng',
    icon: <Store className="h-4 w-4" />,
  },
  {
    href: '/admin/orders',
    label: 'Đơn hàng',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    href: '/admin/flowers',
    label: 'Hoa',
    icon: <Flower2 className="h-4 w-4" />,
  },
  {
    href: '/admin/reviews',
    label: 'Đánh giá',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    href: '/admin/analytics',
    label: 'Phân tích',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    href: '/admin/settings',
    label: 'Cài đặt',
    icon: <Settings className="h-4 w-4" />,
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Tổng quan hệ thống',
  '/admin/users': 'Quản lý người dùng',
  '/admin/shops': 'Quản lý cửa hàng',
  '/admin/flowers': 'Quản lý hoa',
  '/admin/analytics': 'Phân tích & Báo cáo',
  '/admin/settings': 'Cài đặt hệ thống',
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-stone-900">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-stone-700/50 px-5 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-700">
          <ShieldCheck className="h-4 w-4 text-stone-200" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Flowery</p>
          <p className="text-xs font-medium text-stone-400">Quản trị hệ thống</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-stone-800 text-stone-100'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              )}
            >
              <span className={cn('shrink-0', isActive ? 'text-stone-200' : 'text-stone-500')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-700/50 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-stone-500 transition-colors hover:bg-stone-800 hover:text-stone-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang chính
        </Link>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration then redirect unauthenticated
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isAuthenticated, router, pathname]);

  // Redirect non-admin users
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    if (user && user.role !== 'admin') {
      router.replace('/');
    }
  }, [mounted, isAuthenticated, user, router]);

  // Hydration gate
  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  // Role gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <Spinner size="lg" label="Đang chuyển hướng..." />
      </div>
    );
  }

  const pageTitle =
    Object.entries(PAGE_TITLES).find(
      ([key]) => pathname === key || pathname.startsWith(key + '/')
    )?.[1] ?? 'Quản trị hệ thống';

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar pathname={pathname} />

      {/* Main area */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-0.5 rounded-full bg-stone-400" />
            <h1 className="heading-sm">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-stone-500" />
              <span className="label-text text-stone-600">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
