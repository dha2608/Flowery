'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/cart-store';
import { SearchOverlay } from './search-overlay';
import { AppImage } from '@/components/ui/app-image';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/flowers', label: 'Hoa' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/shops', label: 'Cửa hàng' },
  { href: '/garden', label: 'Vườn kỷ niệm' },
  { href: '/blog', label: 'Tạp chí' },
];

const accountLinks = [
  { href: '/dashboard', label: 'Tổng quan' },
  { href: '/orders', label: 'Đơn hàng' },
  { href: '/relationships', label: 'Mối quan hệ' },
  { href: '/events', label: 'Sự kiện' },
  { href: '/subscriptions', label: 'Đăng ký hoa' },
  { href: '/notifications', label: 'Thông báo' },
  { href: '/profile', label: 'Cài đặt' },
  { href: '/profile/preferences', label: 'Sở thích' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/');
  }

  const avatarFallback = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-stone-200/50 bg-white/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="hover:text-primary-600 shrink-0 font-serif text-xl font-semibold text-stone-900 transition-colors"
            >
              <span className="inline-block">Flowery</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-stone-600 hover:bg-stone-100/60 hover:text-stone-900'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="bg-primary-50 absolute inset-0 -z-10 rounded-full"
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-1">
              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Tìm kiếm"
                className="rounded-full p-2.5 text-stone-500 transition-all duration-200 hover:bg-stone-100/60 hover:text-stone-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>

              {/* Notification bell */}
              {isAuthenticated && (
                <Link
                  href="/notifications"
                  aria-label="Thông báo"
                  className="relative block rounded-full p-2.5 text-stone-500 transition-all duration-200 hover:bg-stone-100/60 hover:text-stone-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                </Link>
              )}

              {/* Cart icon */}
              <Link
                href="/cart"
                aria-label="Giỏ hàng"
                className="relative block rounded-full p-2.5 text-stone-500 transition-all duration-200 hover:bg-stone-100/60 hover:text-stone-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-primary-500 absolute -top-0.5 -right-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-0.5 text-[10px] leading-none font-semibold text-white"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Desktop: authenticated avatar dropdown */}
              {isAuthenticated && user ? (
                <div className="relative ml-1 hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full p-1 transition-all duration-200 hover:bg-stone-100/60"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user.avatar?.url ? (
                      <div className="ring-primary-100 relative h-8 w-8 overflow-hidden rounded-full ring-2">
                        <AppImage src={user.avatar.url} alt={user.name} className="object-cover" />
                      </div>
                    ) : (
                      <span className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white select-none">
                        {avatarFallback}
                      </span>
                    )}
                    <svg
                      className={cn(
                        'h-3.5 w-3.5 text-stone-400 transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-200/50 bg-white/90 py-2 shadow-xl backdrop-blur-xl"
                      >
                        {/* User info */}
                        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
                          <p className="truncate text-sm font-medium text-stone-900">{user.name}</p>
                          <p className="mt-0.5 truncate text-xs text-stone-500">{user.email}</p>
                        </div>
                        {/* Role-specific portal links */}
                        {user.role === 'shop_owner' && (
                          <Link
                            href="/shop/dashboard"
                            className="text-primary-600 hover:bg-primary-50/50 flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Quản lý shop
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Admin
                          </Link>
                        )}
                        {/* Account links */}
                        <div className="max-h-48 overflow-y-auto">
                          {accountLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50/50 hover:text-stone-900"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                        {/* Logout */}
                        <div className="mt-1 border-t border-stone-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50/50"
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Desktop: unauthenticated actions */
                <div className="ml-2 hidden items-center gap-2 md:flex">
                  <Link
                    href="/login"
                    className="hover:text-primary-600 px-4 py-2 text-sm font-medium text-stone-700 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary-600 hover:bg-primary-700 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-full p-2.5 text-stone-600 transition-all duration-200 hover:bg-stone-100/60 hover:text-stone-900 md:hidden"
                aria-label="Mở menu"
                aria-expanded={mobileOpen}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in drawer (from right) */}

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <motion.div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className="fixed top-0 right-0 z-[56] flex h-full w-[300px] max-w-[85vw] flex-col bg-white/95 shadow-2xl backdrop-blur-xl md:hidden"
        initial={{ x: '100%' }}
        animate={{ x: mobileOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Drawer header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-stone-50 px-5">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="font-serif text-lg font-semibold text-stone-900"
          >
            Flowery
          </Link>
          <motion.button
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
            className="rounded-full p-2 text-stone-500 transition-all duration-200 hover:bg-stone-100/60 hover:text-stone-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Drawer body – scrollable */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Main nav links */}
          <nav aria-label="Điều hướng di động" className="space-y-1 px-3">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Quick links: cart + notifications */}
          <div className="mt-4 space-y-1 border-t border-stone-200/50 px-3 pt-4">
            <Link
              href="/cart"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
            >
              <span className="text-lg text-stone-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </span>
              Giỏ hàng
              {cartCount > 0 && (
                <span className="bg-primary-500 ml-auto flex h-5 min-w-[1.3rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
              >
                <span className="text-lg text-stone-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </span>
                Thông báo
              </Link>
            )}
          </div>

          {/* Auth section */}
          <div className="mt-4 space-y-1 border-t border-stone-200/50 px-3 pt-4">
            {isAuthenticated && user ? (
              <>
                {/* User identity */}
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
                  {user.avatar?.url ? (
                    <div className="ring-primary-100 relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2">
                      <AppImage src={user.avatar.url} alt={user.name} className="object-cover" />
                    </div>
                  ) : (
                    <span className="bg-primary-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                      {avatarFallback}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                </div>

                {/* Role-specific portal links */}
                {user.role === 'shop_owner' && (
                  <Link
                    href="/shop/dashboard"
                    className="text-primary-600 hover:bg-primary-50/50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    Quản lý shop
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Admin
                  </Link>
                )}

                {/* Account links */}
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block rounded-xl px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900',
                      pathname === link.href && 'text-primary-600 bg-primary-50/50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50/50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1 pt-1">
                <Link
                  href="/login"
                  className="block rounded-xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 block rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
