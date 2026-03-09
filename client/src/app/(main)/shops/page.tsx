'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Verified,
  X,
} from 'lucide-react';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { useShops, type Shop } from '@/hooks/use-shops';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';
import { PetalAccent } from '@/components/ui/botanicals';

// ─── Constants ────────────────────────────────────────────────────────────────

const CITY_OPTIONS = [
  { value: '', label: 'Tất cả thành phố' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Huế', label: 'Huế' },
  { value: 'Nha Trang', label: 'Nha Trang' },
  { value: 'Đà Lạt', label: 'Đà Lạt' },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedStarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const stars = Math.round(rating);
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 500 }}
        >
          <Star
            className={cn(
              iconSize,
              i < stars ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-primary-50 text-primary-700 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm"
    >
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-violet-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.span>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="animate-shimmer h-40 bg-stone-100" />
      <div className="space-y-3 p-5">
        <div className="flex items-start gap-3">
          <div className="animate-shimmer h-12 w-12 rounded-full bg-stone-100" />
          <div className="flex-1 space-y-2">
            <div className="animate-shimmer h-5 w-3/4 rounded-lg bg-stone-100" />
            <div className="animate-shimmer h-4 w-1/2 rounded-lg bg-stone-100" />
          </div>
        </div>
        <div className="animate-shimmer h-4 w-full rounded-lg bg-stone-100" />
        <div className="animate-shimmer h-4 w-2/3 rounded-lg bg-stone-100" />
      </div>
    </div>
  );
}

function ShopCard({ shop, index }: { shop: Shop; index: number }) {
  const fullAddress = [
    shop.address.street,
    shop.address.ward,
    shop.address.district,
    shop.address.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={`/shops/${shop.slug}`} className="group block">
        <motion.div
          className="glass overflow-hidden rounded-2xl"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Cover Image */}
          <div className="relative h-40 overflow-hidden bg-stone-100">
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {shop.coverImage?.url ? (
              <AppImage
                src={shop.coverImage.url}
                alt={shop.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Store className="h-12 w-12 text-violet-200" />
              </div>
            )}

            {/* Verified badge */}
            {shop.isVerified && (
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  <Verified className="h-3.5 w-3.5" />
                  Đã xác thực
                </span>
              </div>
            )}

            {/* Bottom stats overlay */}
            <div className="absolute right-0 bottom-0 left-0 z-20 p-3">
              <div className="flex items-center justify-between text-xs text-white">
                <span className="glass-dark flex items-center gap-1 rounded-full px-2 py-1">
                  <Package className="h-3 w-3" />
                  {shop.stats.totalProducts} sản phẩm
                </span>
                <span className="glass-dark flex items-center gap-1 rounded-full px-2 py-1">
                  <ShoppingBag className="h-3 w-3" />
                  {shop.stats.totalOrders} đơn hàng
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-stone-100 shadow-lg transition-transform duration-300 group-hover:scale-105">
                {shop.logo?.url ? (
                  <AppImage src={shop.logo.url} alt="" className="object-cover" />
                ) : (
                  <span className="text-primary-600 text-xl font-bold">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-lg font-bold text-stone-800 transition-colors group-hover:text-violet-600">
                  {shop.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <AnimatedStarRating rating={shop.stats.rating} />
                  <span className="text-sm text-stone-500">
                    {shop.stats.rating.toFixed(1)} ({shop.stats.totalReviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 rounded-xl bg-stone-50 p-3">
              <p className="line-clamp-2 flex items-start gap-2 text-sm text-stone-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                {fullAddress}
              </p>
            </div>

            {/* View button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="mt-4 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="bg-primary-600 block w-full rounded-xl py-2.5 text-center font-medium text-white">
                Xem cửa hàng →
              </span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function ShopPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-3"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="glass-button"
      >
        ← Trước
      </Button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
          if (p > totalPages) return null;
          return (
            <motion.button
              key={p}
              onClick={() => onPageChange(p)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'h-10 w-10 rounded-xl text-sm font-semibold transition-all',
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'glass text-stone-600 hover:text-violet-600'
              )}
            >
              {p}
            </motion.button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="glass-button"
      >
        Tiếp →
      </Button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useShops({
    city: city || undefined,
    page,
    limit: 12,
  });

  const shops = data?.shops ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 };

  const hasFilters = Boolean(search || city);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCity('');
    setPage(1);
  };

  return (
    <div className="bg-stone-50">
      <Container className="py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-2">
            <PetalAccent className="text-primary-400 h-5 w-5" />
            <span className="text-primary-500 text-xs font-semibold tracking-[0.15em] uppercase">
              Đối tác
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">Cửa hàng hoa</h1>
          <p className="mt-2 text-lg text-stone-500">Tìm cửa hàng hoa uy tín gần bạn</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mb-6 rounded-2xl p-4"
        >
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {/* City select */}
            <div className="relative">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="min-w-[180px] cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 pr-10 text-sm font-medium text-stone-700 transition-all hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none"
              >
                {CITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>

            {/* Search */}
            <div className="flex min-w-0 flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm tên cửa hàng…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-xl border border-stone-200 bg-white/80 py-2.5 pr-4 pl-10 transition-all outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="bg-primary-600 hover:bg-primary-700 rounded-xl px-5 py-2.5 font-medium text-white transition-colors"
              >
                Tìm
              </motion.button>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-200/50 pt-4"
              >
                <span className="flex items-center gap-1 text-sm text-stone-500">
                  <Sparkles className="h-4 w-4" />
                  Đang lọc:
                </span>
                {city && (
                  <FilterTag
                    label={CITY_OPTIONS.find((c) => c.value === city)?.label ?? city}
                    onRemove={() => {
                      setCity('');
                      setPage(1);
                    }}
                  />
                )}
                {search && (
                  <FilterTag
                    label={`"${search}"`}
                    onRemove={() => {
                      setSearch('');
                      setSearchInput('');
                      setPage(1);
                    }}
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFilters}
                  className="ml-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  Xoá tất cả
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        {!isLoading && !isError && pagination.total > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 px-1">
            <p className="text-sm text-stone-600">
              Tìm thấy <span className="font-semibold text-stone-800">{pagination.total}</span> cửa
              hàng
            </p>
          </motion.div>
        )}

        {/* Content */}
        {isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass space-y-4 rounded-2xl py-20 text-center"
          >
            <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
            <p className="text-lg font-semibold text-stone-700">Đã xảy ra lỗi khi tải dữ liệu</p>
            <p className="text-stone-500">Vui lòng thử lại sau</p>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass space-y-4 rounded-2xl py-24 text-center"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Store className="mx-auto h-16 w-16 text-stone-300" />
            </motion.div>
            <p className="text-xl font-semibold text-stone-700">Không tìm thấy cửa hàng nào</p>
            <p className="text-stone-500">Hãy thử thay đổi thành phố hoặc từ khoá tìm kiếm</p>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <Button variant="outline" onClick={handleClearFilters} className="glass-button">
                  Xoá bộ lọc
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {shops.map((shop, index) => (
                <ShopCard key={shop._id} shop={shop} index={index} />
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-12">
              <ShopPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
