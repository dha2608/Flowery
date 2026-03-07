'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Store,
  ChevronLeft,
  Flower2,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Spinner, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// ─── Nav Config ───────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/shop/dashboard',
    label: 'Tổng quan',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: '/shop/products',
    label: 'Sản phẩm',
    icon: <Package className="h-4 w-4" />,
  },
  {
    href: '/shop/orders',
    label: 'Đơn hàng',
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    href: '/shop/reviews',
    label: 'Đánh giá',
    icon: <Star className="h-4 w-4" />,
  },
  {
    href: '/shop/revenue',
    label: 'Doanh thu',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    href: '/shop/profile',
    label: 'Hồ sơ shop',
    icon: <Store className="h-4 w-4" />,
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/shop/dashboard': 'Tổng quan',
  '/shop/products': 'Sản phẩm',
  '/shop/products/new': 'Thêm sản phẩm mới',
  '/shop/orders': 'Đơn hàng',
  '/shop/reviews': 'Đánh giá',
  '/shop/revenue': 'Doanh thu',
  '/shop/profile': 'Hồ sơ shop',
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-white border-r border-stone-200">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-200">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600">
          <Flower2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-stone-900">Flowery</p>
          <p className="text-xs text-primary-600 font-medium">Quản lý cửa hàng</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 py-2.5 px-3 text-sm font-medium transition-all border-l-2',
                isActive
                  ? 'border-primary-600 bg-primary-50 text-primary-700 rounded-r-xl'
                  : 'border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl',
              )}
            >
              <span
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-primary-600' : 'text-stone-400',
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: back to home */}
      <div className="border-t border-stone-200 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại trang chính
        </Link>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, isAuthenticated, router, pathname]);

  // Redirect non-shop_owner users
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    if (user && user.role !== 'shop_owner') {
      router.replace('/');
    }
  }, [mounted, isAuthenticated, user, router]);

  // Loading gate — wait for Zustand hydration
  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  // Role gate
  if (!user || user.role !== 'shop_owner') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Spinner size="lg" label="Đang chuyển hướng..." />
      </div>
    );
  }

  const pageTitle = PAGE_TITLES[pathname] ?? 'Quản lý cửa hàng';
  const showAddBtn = pathname === '/shop/products';

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar pathname={pathname} />

      {/* Main area */}
      <div className="ml-64 flex flex-1 flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="heading-sm">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            {showAddBtn && (
              <Link href="/shop/products/new">
                <Button
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-400 text-white"
                >
                  Thêm sản phẩm
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-1.5 border border-primary-100">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
              <span className="label-text text-primary-700">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
