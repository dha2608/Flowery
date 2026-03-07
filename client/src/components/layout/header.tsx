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
    state.items.reduce((sum, item) => sum + item.quantity, 0),
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
            ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className="font-serif font-semibold text-xl text-stone-900 shrink-0 hover:text-primary-600 transition-colors"
            >
              <span className="inline-block">
                🌸 Flowery
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors rounded-full',
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60',
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute inset-0 bg-primary-50 rounded-full -z-10"
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
                className="p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Notification bell */}
              {isAuthenticated && (
                <Link
                  href="/notifications"
                  aria-label="Thông báo"
                  className="relative p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 rounded-full transition-all duration-200 block"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                className="relative p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 rounded-full transition-all duration-200 block"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                      className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] leading-none rounded-full flex items-center justify-center font-semibold px-0.5 shadow-lg shadow-primary-500/30"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Desktop: authenticated avatar dropdown */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:block ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-stone-100/60 transition-all duration-200"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user.avatar?.url ? (
                      <AppImage
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm select-none shadow-lg shadow-primary-500/30">
                        {avatarFallback}
                      </span>
                    )}
                    <svg
                      className={cn('w-3.5 h-3.5 text-stone-400 transition-transform duration-200', dropdownOpen && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/50 py-2 z-50 overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-stone-100 bg-gradient-to-r from-primary-50/50 to-transparent">
                          <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        {/* Role-specific portal links */}
                        {user.role === 'shop_owner' && (
                          <Link
                            href="/shop/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50/50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="mr-2">🏪</span>
                            Quản lý shop
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="mr-2">⚙️</span>
                            Admin
                          </Link>
                        )}
                        {/* Account links */}
                        <div className="max-h-48 overflow-y-auto">
                          {accountLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50/50 hover:text-stone-900 transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                        {/* Logout */}
                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
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
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-primary-600 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full hover:shadow-lg hover:shadow-primary-500/25 hover:brightness-105 transition-all duration-200"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 rounded-full transition-all duration-200"
                aria-label="Mở menu"
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
        className="fixed top-0 right-0 z-[56] h-full w-[300px] max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col md:hidden"
        initial={{ x: '100%' }}
        animate={{ x: mobileOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-200/50 shrink-0 bg-gradient-to-r from-primary-50/30 to-transparent">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="font-serif font-semibold text-lg text-stone-900"
          >
            🌸 Flowery
          </Link>
          <motion.button
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 rounded-full transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Drawer body – scrollable */}
        <div className="flex-1 overflow-y-auto py-4">

          {/* Main nav links */}
          <nav aria-label="Điều hướng di động" className="px-3 space-y-1">
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
                    'flex items-center px-4 py-3 text-sm font-medium transition-all rounded-xl',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50',
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Quick links: cart + notifications */}
          <div className="mt-4 px-3 space-y-1 border-t border-stone-200/50 pt-4">
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-xl"
            >
              <span className="text-lg">🛒</span>
              Giỏ hàng
              {cartCount > 0 && (
                <span className="ml-auto min-w-[1.3rem] h-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-xl"
              >
                <span className="text-lg">🔔</span>
                Thông báo
              </Link>
            )}
          </div>

          {/* Auth section */}
          <div className="mt-4 px-3 border-t border-stone-200/50 pt-4 space-y-1">
            {isAuthenticated && user ? (
              <>
                {/* User identity */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gradient-to-r from-primary-50/50 to-transparent rounded-xl">
                  {user.avatar?.url ? (
                    <AppImage src={user.avatar.url} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 shrink-0" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {avatarFallback}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role-specific portal links */}
                {user.role === 'shop_owner' && (
                  <Link
                    href="/shop/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50/50 transition-colors rounded-xl"
                  >
                    <span>🏪</span>
                    Quản lý shop
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors rounded-xl"
                  >
                    <span>⚙️</span>
                    Admin
                  </Link>
                )}

                {/* Account links */}
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-xl',
                      pathname === link.href && 'text-primary-600 bg-primary-50/50',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors mt-2 rounded-xl"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1 pt-1">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-center rounded-xl text-sm font-medium border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-center rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
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
