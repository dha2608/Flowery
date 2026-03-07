'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, Filter, Inbox, Search, Sparkles, X } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, FlowerListSkeleton } from '@/components/ui';
import { AppImage } from '@/components/ui/app-image';
import {
  useFlowers,
  getFlowerImageUrl,
  type Flower,
  type FlowerSortBy,
  type SortOrder,
} from '@/hooks/use-flowers';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const EMOTIONS = [
  { key: 'romantic', label: 'Lãng mạn', emoji: '💕' },
  { key: 'grateful', label: 'Biết ơn', emoji: '🙏' },
  { key: 'joyful', label: 'Vui vẻ', emoji: '😊' },
  { key: 'sympathetic', label: 'Chia sẻ', emoji: '🤝' },
  { key: 'respectful', label: 'Kính trọng', emoji: '🎩' },
  { key: 'apologetic', label: 'Xin lỗi', emoji: '💔' },
  { key: 'celebratory', label: 'Chúc mừng', emoji: '🎉' },
  { key: 'passionate', label: 'Đam mê', emoji: '🔥' },
  { key: 'hopeful', label: 'Hy vọng', emoji: '🌟' },
  { key: 'peaceful', label: 'Bình yên', emoji: '☮️' },
];

const COLOR_FILTERS = [
  { value: '', label: 'Tất cả', gradient: 'from-stone-200 to-stone-300' },
  { value: 'đỏ', label: 'Đỏ', gradient: 'from-red-400 to-rose-500' },
  { value: 'hồng', label: 'Hồng', gradient: 'from-pink-300 to-pink-500' },
  { value: 'trắng', label: 'Trắng', gradient: 'from-white to-stone-100' },
  { value: 'vàng', label: 'Vàng', gradient: 'from-yellow-300 to-amber-400' },
  { value: 'tím', label: 'Tím', gradient: 'from-purple-400 to-violet-500' },
  { value: 'cam', label: 'Cam', gradient: 'from-orange-400 to-orange-500' },
  { value: 'xanh', label: 'Xanh', gradient: 'from-blue-400 to-cyan-500' },
];

const SEASONS = [
  { value: '', label: 'Tất cả mùa', icon: '🌍' },
  { value: 'spring', label: 'Xuân', icon: '🌸' },
  { value: 'summer', label: 'Hạ', icon: '☀️' },
  { value: 'autumn', label: 'Thu', icon: '🍂' },
  { value: 'winter', label: 'Đông', icon: '❄️' },
];

const SORT_OPTIONS: { value: string; label: string; sortBy: FlowerSortBy; order: SortOrder }[] = [
  { value: 'popular', label: 'Phổ biến nhất', sortBy: 'popularityScore', order: 'desc' },
  { value: 'newest', label: 'Mới nhất', sortBy: 'createdAt', order: 'desc' },
  { value: 'oldest', label: 'Cũ nhất', sortBy: 'createdAt', order: 'asc' },
  { value: 'name-asc', label: 'Tên A → Z', sortBy: 'name', order: 'asc' },
  { value: 'name-desc', label: 'Tên Z → A', sortBy: 'name', order: 'desc' },
];

const COLOR_HEX: Record<string, string> = {
  red: '#ef4444',
  đỏ: '#ef4444',
  pink: '#ec4899',
  hồng: '#ec4899',
  white: '#f5f5f4',
  trắng: '#f5f5f4',
  yellow: '#eab308',
  vàng: '#eab308',
  purple: '#a855f7',
  tím: '#a855f7',
  orange: '#f97316',
  cam: '#f97316',
  blue: '#3b82f6',
  'xanh dương': '#3b82f6',
  green: '#22c55e',
  'xanh lá': '#22c55e',
  xanh: '#3b82f6',
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

const filterPanelVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginBottom: 24,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

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

function FlowerCard({ flower, index }: { flower: Flower; index: number }) {
  const imageUrl = getFlowerImageUrl(flower.images);

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={`/flowers/${flower.slug}`} className="group block">
        <motion.div
          className="glass overflow-hidden rounded-2xl"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Quick view badge */}
            <div className="absolute right-3 bottom-3 left-3 z-20">
              <span className="glass-button px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Xem chi tiết →
              </span>
            </div>

            {imageUrl ? (
              <AppImage
                src={imageUrl}
                alt={flower.name.vi}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-rose-50">
                <span className="text-4xl">🌸</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2.5 p-4">
            <h3 className="group-hover:text-primary-600 line-clamp-1 font-semibold text-stone-800 transition-colors">
              {flower.name.vi}
            </h3>
            <p className="line-clamp-1 text-sm text-stone-500 italic">{flower.name.en}</p>

            {/* Color dots with tooltip effect */}
            {flower.colors.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {flower.colors.slice(0, 5).map((colorName, i) => (
                  <motion.span
                    key={colorName}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    title={colorName}
                    className="h-5 w-5 shrink-0 rounded-full shadow-sm ring-2 ring-white"
                    style={{
                      backgroundColor: COLOR_HEX[colorName.toLowerCase()] ?? '#d1d5db',
                    }}
                  />
                ))}
                {flower.colors.length > 5 && (
                  <span className="text-xs font-medium text-stone-400">
                    +{flower.colors.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Meanings as gradient pills */}
            {flower.meanings.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {flower.meanings.slice(0, 2).map((meaning) => (
                  <span
                    key={meaning}
                    className="inline-block rounded-full border border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100 px-2.5 py-1 text-xs text-stone-600"
                  >
                    {meaning}
                  </span>
                ))}
                {flower.meanings.length > 2 && (
                  <span className="inline-block px-2 py-1 text-xs text-stone-400">
                    +{flower.meanings.length - 2}
                  </span>
                )}
              </div>
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

  const getPages = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2"
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

      <div className="flex items-center gap-1">
        {getPages().map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-stone-400">
              …
            </span>
          ) : (
            <motion.button
              key={p}
              onClick={() => onPageChange(p)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'h-10 w-10 rounded-xl text-sm font-semibold transition-all',
                p === page
                  ? 'from-primary-500 shadow-primary-500/25 bg-gradient-to-r to-pink-500 text-white shadow-lg'
                  : 'glass hover:text-primary-600 text-stone-600'
              )}
            >
              {p}
            </motion.button>
          )
        )}
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

export default function FlowersPage() {
  const searchParams = useSearchParams();

  const [emotion, setEmotion] = useState(searchParams.get('emotion') ?? '');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const currentSort = SORT_OPTIONS.find((s) => s.value === sortOption) ?? SORT_OPTIONS[0];

  const { data, isLoading, isError } = useFlowers({
    emotion: emotion || undefined,
    color: color || undefined,
    season: season || undefined,
    search: search || undefined,
    sortBy: currentSort.sortBy,
    order: currentSort.order,
    page,
    limit: 12,
  });

  const flowers = data?.flowers ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const hasActiveFilters = Boolean(emotion || color || season || search);
  const activeFilterCount = [emotion, color, season, search].filter(Boolean).length;

  const handleEmotionClick = (em: string) => {
    setEmotion((prev) => (prev === em ? '' : em));
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setEmotion('');
    setColor('');
    setSeason('');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
        <motion.div
          className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-pink-200/30 to-rose-300/30 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-300/30 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <Container className="relative z-10 py-10">
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
              🌸
            </motion.span>
            <h1 className="via-primary-600 bg-gradient-to-r from-stone-800 to-pink-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Bộ sưu tập hoa
            </h1>
          </div>
          <p className="text-lg text-stone-600">Khám phá ý nghĩa và vẻ đẹp của từng loài hoa</p>
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
                  placeholder="Tìm kiếm tên hoa…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="focus:border-primary-400 focus:ring-primary-100 w-full rounded-xl border border-stone-200 bg-white/80 py-2.5 pr-4 pl-10 transition-all outline-none focus:ring-2"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="from-primary-500 shadow-primary-500/25 hover:shadow-primary-500/30 rounded-xl bg-gradient-to-r to-pink-500 px-5 py-2.5 font-medium text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                Tìm
              </motion.button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <label htmlFor="sort-flowers" className="sr-only">
                Sắp xếp theo
              </label>
              <select
                id="sort-flowers"
                aria-label="Sắp xếp sản phẩm"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="hover:border-primary-300 focus:ring-primary-100 focus:border-primary-400 min-w-[160px] cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 pr-10 text-sm font-medium text-stone-700 transition-all focus:ring-2 focus:outline-none"
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
                  ? 'from-primary-500 bg-gradient-to-r to-pink-500 text-white shadow-lg'
                  : 'glass-button text-stone-700'
              )}
            >
              <Filter className="h-4 w-4" />
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
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass overflow-hidden rounded-2xl p-6"
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
                    {emotion && (
                      <FilterTag
                        label={`${EMOTIONS.find((e) => e.key === emotion)?.emoji ?? ''} ${EMOTIONS.find((e) => e.key === emotion)?.label ?? emotion}`}
                        onRemove={() => {
                          setEmotion('');
                          setPage(1);
                        }}
                      />
                    )}
                    {color && (
                      <FilterTag
                        label={COLOR_FILTERS.find((c) => c.value === color)?.label ?? color}
                        onRemove={() => {
                          setColor('');
                          setPage(1);
                        }}
                      />
                    )}
                    {season && (
                      <FilterTag
                        label={`${SEASONS.find((s) => s.value === season)?.icon ?? ''} ${SEASONS.find((s) => s.value === season)?.label ?? season}`}
                        onRemove={() => {
                          setSeason('');
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
                      className="text-primary-600 hover:text-primary-700 ml-2 text-sm font-semibold"
                    >
                      Xoá tất cả
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Emotion filters */}
              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <span>💝</span> Cảm xúc
                </p>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((em, i) => (
                    <motion.button
                      key={em.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEmotionClick(em.key)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        emotion === em.key
                          ? 'from-primary-500 shadow-primary-500/25 bg-gradient-to-r to-pink-500 text-white shadow-lg'
                          : 'glass-button hover:text-primary-600 text-stone-600'
                      )}
                    >
                      <span>{em.emoji}</span>
                      {em.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Color filters */}
              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <span>🎨</span> Màu sắc
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {COLOR_FILTERS.map((c, i) => (
                    <motion.button
                      key={c.value}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setColor(c.value);
                        setPage(1);
                      }}
                      title={c.label}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-3 py-2 transition-all',
                        color === c.value
                          ? 'ring-primary-400 bg-white shadow-lg ring-2'
                          : 'hover:bg-white/50'
                      )}
                    >
                      <span
                        className={cn(
                          'h-6 w-6 rounded-full bg-gradient-to-br shadow-sm',
                          c.gradient,
                          c.value === 'trắng' && 'ring-1 ring-stone-200'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm',
                          color === c.value ? 'font-semibold text-stone-900' : 'text-stone-600'
                        )}
                      >
                        {c.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Season filters */}
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <span>🗓️</span> Mùa
                </p>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map((s, i) => (
                    <motion.button
                      key={s.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSeason(s.value);
                        setPage(1);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        season === s.value
                          ? 'bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-lg'
                          : 'glass-button text-stone-600 hover:text-stone-800'
                      )}
                    >
                      <span>{s.icon}</span>
                      {s.label}
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
              Hiển thị <span className="font-semibold text-stone-800">{flowers.length}</span> /{' '}
              {pagination.total} loài hoa
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
          <FlowerListSkeleton count={12} columns={4} />
        ) : flowers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass space-y-4 rounded-2xl py-24 text-center"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Inbox className="mx-auto h-16 w-16 text-stone-300" />
            </motion.div>
            <p className="text-xl font-semibold text-stone-700">Không tìm thấy loài hoa nào</p>
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
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {flowers.map((flower, index) => (
                <FlowerCard key={flower._id} flower={flower} index={index} />
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
