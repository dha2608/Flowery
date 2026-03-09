'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  Gift,
  Heart,
  Inbox,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, ProductListSkeleton } from '@/components/ui';
import { AppImage } from '@/components/ui/app-image';
import {
  useProducts,
  getProductImageUrl,
  type Product,
  type ProductSortBy,
  type SortOrder,
} from '@/hooks/use-products';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: '', label: 'Tất cả', icon: '🌸' },
  { value: 'single_flower', label: 'Hoa đơn', icon: '🌷' },
  { value: 'bouquet', label: 'Bó hoa', icon: '💐' },
  { value: 'arrangement', label: 'Cắm hoa', icon: '🏺' },
  { value: 'basket', label: 'Giỏ hoa', icon: '🧺' },
  { value: 'box', label: 'Hộp hoa', icon: '🎁' },
  { value: 'subscription_pack', label: 'Gói đăng ký', icon: '📦' },
  { value: 'custom', label: 'Tuỳ chỉnh', icon: '✨' },
];

const OCCASIONS = [
  { value: '', label: 'Tất cả dịp', icon: '🎯' },
  { value: 'birthday', label: 'Sinh nhật', icon: '🎂' },
  { value: 'anniversary', label: 'Kỷ niệm', icon: '💑' },
  { value: 'wedding', label: 'Đám cưới', icon: '💒' },
  { value: 'graduation', label: 'Tốt nghiệp', icon: '🎓' },
  { value: 'valentines', label: 'Valentine', icon: '💝' },
  { value: 'mothers_day', label: 'Ngày của mẹ', icon: '👩' },
  { value: 'womens_day', label: 'Ngày phụ nữ', icon: '👠' },
  { value: 'teachers_day', label: 'Ngày nhà giáo', icon: '📚' },
  { value: 'congratulations', label: 'Chúc mừng', icon: '🎉' },
];

const PRICE_RANGES = [
  { min: undefined, max: undefined, label: 'Tất cả giá', color: 'stone' },
  { min: 0, max: 200000, label: 'Dưới 200K', color: 'emerald' },
  { min: 200000, max: 500000, label: '200K - 500K', color: 'blue' },
  { min: 500000, max: 1000000, label: '500K - 1 triệu', color: 'violet' },
  { min: 1000000, max: 2000000, label: '1 - 2 triệu', color: 'amber' },
  { min: 2000000, max: undefined, label: 'Trên 2 triệu', color: 'rose' },
];

const SORT_OPTIONS: { value: string; label: string; sort: ProductSortBy; order: SortOrder }[] = [
  { value: 'popular', label: 'Bán chạy nhất', sort: 'popularity', order: 'desc' },
  { value: 'newest', label: 'Mới nhất', sort: 'createdAt', order: 'desc' },
  { value: 'price-asc', label: 'Giá thấp → cao', sort: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Giá cao → thấp', sort: 'price', order: 'desc' },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="from-primary-50 text-primary-700 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r to-pink-50 px-3 py-1.5 text-sm font-medium shadow-sm"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.span>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const imageUrl = getProductImageUrl(product.images);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={`/products/${product.slug}`} className="group block">
        <motion.div
          className="glass overflow-hidden rounded-2xl"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {imageUrl ? (
              <AppImage
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-16 w-16 text-stone-200" />
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-0 rounded-r-full bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                -{discountPercent}%
              </div>
            )}

            {/* Wishlist button */}
            <button
              className="glass-button absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to wishlist
              }}
            >
              <Heart className="h-4 w-4 text-rose-500" />
            </button>

            {/* Quick add button */}
            <div className="absolute right-3 bottom-3 left-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="glass-button block rounded-xl px-4 py-2 text-center text-sm font-medium text-white">
                Xem chi tiết →
              </span>
            </div>

            {/* Out of stock overlay */}
            {!product.isAvailable && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <span className="glass rounded-full px-4 py-2 font-semibold text-white">
                  Hết hàng
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2 p-4">
            <h3 className="group-hover:text-primary-600 line-clamp-2 min-h-[48px] font-semibold text-stone-800 transition-colors">
              {product.name}
            </h3>

            {/* Shop name */}
            {typeof product.shopId === 'object' && product.shopId?.name && (
              <p className="flex items-center gap-1 truncate text-xs text-stone-500">
                <Gift className="h-3 w-3" />
                {product.shopId.name}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 pt-1">
              <motion.span
                key={product.salePrice ?? product.price}
                initial={{ scale: 1.2, color: '#ec4899' }}
                animate={{ scale: 1, color: '#db2777' }}
                className="from-primary-600 bg-gradient-to-r to-pink-600 bg-clip-text text-lg font-bold text-transparent"
              >
                {formatPrice(product.salePrice ?? product.price)}
              </motion.span>
              {hasDiscount && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stats */}
            {(product.totalSold ?? 0) > 0 && (
              <p className="flex items-center gap-1 text-xs text-stone-500">
                <Tag className="h-3 w-3" />
                Đã bán {product.totalSold}
              </p>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function CatalogPagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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
        disabled={!hasPrev}
        className="glass-button"
      >
        ← Trước
      </Button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum =
            page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
          if (pageNum < 1 || pageNum > totalPages) return null;
          return (
            <motion.button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'h-10 w-10 rounded-xl text-sm font-semibold transition-all',
                pageNum === page
                  ? 'from-primary-500 shadow-primary-500/25 bg-gradient-to-r to-pink-500 text-white shadow-lg'
                  : 'glass hover:text-primary-600 text-stone-600'
              )}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="glass-button"
      >
        Tiếp →
      </Button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [category, setCategory] = useState('');
  const [occasion, setOccasion] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const currentSort = SORT_OPTIONS.find((s) => s.value === sortOption) ?? SORT_OPTIONS[0];
  const currentPrice = PRICE_RANGES[priceRange];

  const { data, isLoading, isError } = useProducts({
    category: category || undefined,
    occasion: occasion || undefined,
    priceMin: currentPrice.min,
    priceMax: currentPrice.max,
    search: search || undefined,
    sort: currentSort.sort,
    order: currentSort.order,
    page,
    limit: 12,
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const hasActiveFilters = Boolean(category || occasion || priceRange > 0 || search);
  const activeFilterCount = [category, occasion, priceRange > 0 ? 'price' : '', search].filter(
    Boolean
  ).length;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory('');
    setOccasion('');
    setPriceRange(0);
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50" />
        <motion.div
          className="absolute top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-300/30 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-rose-200/30 to-pink-300/30 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <Container className="relative z-10 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Sản phẩm hoa' }]} className="mb-6" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              💐
            </motion.span>
            <h1 className="bg-gradient-to-r from-stone-800 via-amber-600 to-rose-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Sản phẩm hoa
            </h1>
          </div>
          <p className="text-lg text-stone-600">Khám phá các mẫu hoa đẹp từ các shop uy tín</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mb-4 rounded-2xl p-4"
        >
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex min-w-0 flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-xl border border-stone-200 bg-white/80 py-2.5 pr-4 pl-10 transition-all outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-amber-500/25 transition-shadow hover:shadow-xl hover:shadow-amber-500/30"
              >
                Tìm
              </motion.button>
            </div>

            {/* Sort */}
            <div className="relative">
              <label htmlFor="sort-products" className="sr-only">
                Sắp xếp theo
              </label>
              <select
                id="sort-products"
                aria-label="Sắp xếp sản phẩm"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="min-w-[160px] cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 pr-10 text-sm font-medium text-stone-700 transition-all hover:border-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all',
                showFilters
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'glass-button text-stone-700'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass mb-6 overflow-hidden rounded-2xl p-6"
            >
              {/* Active Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 flex flex-wrap items-center gap-2 border-b border-stone-200/50 pb-5"
                  >
                    <span className="flex items-center gap-1 text-sm text-stone-500">
                      <Sparkles className="h-4 w-4" />
                      Đang lọc:
                    </span>
                    {category && (
                      <FilterTag
                        label={`${CATEGORIES.find((c) => c.value === category)?.icon ?? ''} ${CATEGORIES.find((c) => c.value === category)?.label ?? category}`}
                        onRemove={() => {
                          setCategory('');
                          setPage(1);
                        }}
                      />
                    )}
                    {occasion && (
                      <FilterTag
                        label={`${OCCASIONS.find((o) => o.value === occasion)?.icon ?? ''} ${OCCASIONS.find((o) => o.value === occasion)?.label ?? occasion}`}
                        onRemove={() => {
                          setOccasion('');
                          setPage(1);
                        }}
                      />
                    )}
                    {priceRange > 0 && (
                      <FilterTag
                        label={currentPrice.label}
                        onRemove={() => {
                          setPriceRange(0);
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
                      className="ml-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
                    >
                      Xoá tất cả
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category */}
              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <Package className="h-4 w-4" /> Loại sản phẩm
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c, i) => (
                    <motion.button
                      key={c.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCategory(c.value);
                        setPage(1);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        category === c.value
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                          : 'glass-button text-stone-600 hover:text-amber-600'
                      )}
                    >
                      <span>{c.icon}</span>
                      {c.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <Gift className="h-4 w-4" /> Dịp tặng
                </p>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o, i) => (
                    <motion.button
                      key={o.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setOccasion(o.value);
                        setPage(1);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        occasion === o.value
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
                          : 'glass-button text-stone-600 hover:text-rose-600'
                      )}
                    >
                      <span>{o.icon}</span>
                      {o.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <Tag className="h-4 w-4" /> Khoảng giá
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((p, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setPriceRange(idx);
                        setPage(1);
                      }}
                      className={cn(
                        'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        priceRange === idx
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'glass-button text-stone-600 hover:text-emerald-600'
                      )}
                    >
                      {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {!isLoading && !isError && pagination.total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between px-1"
          >
            <p className="text-sm text-stone-600">
              Hiển thị <span className="font-semibold text-stone-800">{products.length}</span> /{' '}
              {pagination.total} sản phẩm
            </p>
            <p className="text-sm text-stone-400">
              Sắp xếp: <span className="text-stone-600">{currentSort.label}</span>
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
          <ProductListSkeleton count={12} columns={4} />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass space-y-4 rounded-2xl py-24 text-center"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Inbox className="mx-auto h-16 w-16 text-stone-300" />
            </motion.div>
            <p className="text-xl font-semibold text-stone-700">Không tìm thấy sản phẩm nào</p>
            <p className="text-stone-500">Hãy thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
            {hasActiveFilters && (
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
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
            >
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-12">
              <CatalogPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
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
