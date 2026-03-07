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

// ─── Constants ────────────────────────────────────────────────────────────────

const CITY_OPTIONS = [
  { value: '', label: 'Tất cả thành phố', icon: '🌍' },
  { value: 'Hà Nội', label: 'Hà Nội', icon: '🏛️' },
  { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh', icon: '🌆' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng', icon: '🏖️' },
  { value: 'Cần Thơ', label: 'Cần Thơ', icon: '🌾' },
  { value: 'Hải Phòng', label: 'Hải Phòng', icon: '⚓' },
  { value: 'Huế', label: 'Huế', icon: '🏯' },
  { value: 'Nha Trang', label: 'Nha Trang', icon: '🌊' },
  { value: 'Đà Lạt', label: 'Đà Lạt', icon: '🌸' },
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
              i < stars ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200',
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 rounded-full text-sm font-medium shadow-sm"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-violet-100 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-stone-100 to-stone-50 animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-stone-100 rounded-lg w-3/4 animate-shimmer" />
            <div className="h-4 bg-stone-100 rounded-lg w-1/2 animate-shimmer" />
          </div>
        </div>
        <div className="h-4 bg-stone-100 rounded-lg w-full animate-shimmer" />
        <div className="h-4 bg-stone-100 rounded-lg w-2/3 animate-shimmer" />
      </div>
    </div>
  );
}

function ShopCard({ shop, index }: { shop: Shop; index: number }) {
  const fullAddress = [shop.address.street, shop.address.ward, shop.address.district, shop.address.city]
    .filter(Boolean)
    .join(', ');

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={`/shops/${shop.slug}`} className="block group">
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Cover Image */}
          <div className="h-40 relative overflow-hidden bg-gradient-to-br from-violet-100 to-purple-50">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            {shop.coverImage?.url ? (
              <AppImage
                src={shop.coverImage.url}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-12 h-12 text-violet-200" />
              </div>
            )}

            {/* Verified badge */}
            {shop.isVerified && (
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  <Verified className="w-3.5 h-3.5" />
                  Đã xác thực
                </span>
              </div>
            )}

            {/* Bottom stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
              <div className="flex items-center justify-between text-white text-xs">
                <span className="flex items-center gap-1 glass-dark px-2 py-1 rounded-full">
                  <Package className="w-3 h-3" />
                  {shop.stats.totalProducts} sản phẩm
                </span>
                <span className="flex items-center gap-1 glass-dark px-2 py-1 rounded-full">
                  <ShoppingBag className="w-3 h-3" />
                  {shop.stats.totalOrders} đơn hàng
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg shrink-0 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {shop.logo?.url ? (
                  <AppImage src={shop.logo.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-stone-800 group-hover:text-violet-600 transition-colors line-clamp-1 text-lg">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <AnimatedStarRating rating={shop.stats.rating} />
                  <span className="text-sm text-stone-500">
                    {shop.stats.rating.toFixed(1)} ({shop.stats.totalReviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100/50">
              <p className="text-sm text-stone-600 line-clamp-2 flex gap-2 items-start">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-violet-500" />
                {fullAddress}
              </p>
            </div>

            {/* View button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="block w-full text-center py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25">
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
                'w-10 h-10 rounded-xl text-sm font-semibold transition-all',
                p === page
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                  : 'glass text-stone-600 hover:text-violet-600',
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <Container className="py-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🏪
            </motion.span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-stone-800 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Cửa hàng Hoa
            </h1>
          </div>
          <p className="text-stone-600 text-lg">Tìm cửa hàng hoa uy tín gần bạn</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* City select */}
            <div className="relative">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-white/80 border border-stone-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-stone-700 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 cursor-pointer min-w-[180px] transition-all"
              >
                {CITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="flex-1 flex gap-2 min-w-0">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm tên cửa hàng…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-stone-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-shadow"
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
                className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-stone-200/50"
              >
                <span className="text-sm text-stone-500 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Đang lọc:
                </span>
                {city && (
                  <FilterTag
                    label={`${CITY_OPTIONS.find((c) => c.value === city)?.icon ?? ''} ${CITY_OPTIONS.find((c) => c.value === city)?.label ?? city}`}
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
                  className="text-sm text-violet-600 hover:text-violet-700 font-semibold ml-2"
                >
                  Xoá tất cả
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        {!isLoading && !isError && pagination.total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 px-1"
          >
            <p className="text-sm text-stone-600">
              Tìm thấy <span className="font-semibold text-stone-800">{pagination.total}</span> cửa hàng
            </p>
          </motion.div>
        )}

        {/* Content */}
        {isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl text-center py-20 space-y-4"
          >
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <p className="text-lg font-semibold text-stone-700">Đã xảy ra lỗi khi tải dữ liệu</p>
            <p className="text-stone-500">Vui lòng thử lại sau</p>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl text-center py-24 space-y-4"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Store className="w-16 h-16 text-stone-300 mx-auto" />
            </motion.div>
            <p className="text-xl font-semibold text-stone-700">Không tìm thấy cửa hàng nào</p>
            <p className="text-stone-500">Hãy thử thay đổi thành phố hoặc từ khoá tìm kiếm</p>
            {hasFilters && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
