'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ChevronDown, Inbox, Search, SlidersHorizontal, X } from 'lucide-react';
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
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PetalAccent } from '@/components/ui/botanicals';

// ─── Constants ────────────────────────────────────────────────────────────────

const EMOTIONS = [
  { key: 'romantic', label: 'Lãng mạn' },
  { key: 'grateful', label: 'Biết ơn' },
  { key: 'joyful', label: 'Vui vẻ' },
  { key: 'sympathetic', label: 'Đồng cảm' },
  { key: 'respectful', label: 'Kính trọng' },
  { key: 'apologetic', label: 'Xin lỗi' },
  { key: 'celebratory', label: 'Chúc mừng' },
  { key: 'passionate', label: 'Đam mê' },
  { key: 'inspiring', label: 'Cảm hứng' },
  { key: 'peaceful', label: 'Bình yên' },
];

const COLOR_FILTERS = [
  { value: 'đỏ', label: 'Đỏ', hex: '#dc2626' },
  { value: 'hồng', label: 'Hồng', hex: '#ec4899' },
  { value: 'trắng', label: 'Trắng', hex: '#f5f5f4' },
  { value: 'vàng', label: 'Vàng', hex: '#eab308' },
  { value: 'tím', label: 'Tím', hex: '#8b5cf6' },
  { value: 'cam', label: 'Cam', hex: '#f97316' },
  { value: 'xanh', label: 'Xanh', hex: '#3b82f6' },
];

const SEASONS = [
  { value: 'spring', label: 'Xuân' },
  { value: 'summer', label: 'Hạ' },
  { value: 'autumn', label: 'Thu' },
  { value: 'winter', label: 'Đông' },
];

const SORT_OPTIONS: { value: string; label: string; sortBy: FlowerSortBy; order: SortOrder }[] = [
  { value: 'popular', label: 'Phổ biến nhất', sortBy: 'popularityScore', order: 'desc' },
  { value: 'name-az', label: 'Tên A → Z', sortBy: 'name', order: 'asc' },
  { value: 'name-za', label: 'Tên Z → A', sortBy: 'name', order: 'desc' },
  { value: 'newest', label: 'Mới nhất', sortBy: 'createdAt', order: 'desc' },
];

const COLOR_HEX: Record<string, string> = {
  đỏ: '#dc2626',
  red: '#dc2626',
  hồng: '#ec4899',
  pink: '#ec4899',
  trắng: '#f5f5f4',
  white: '#f5f5f4',
  vàng: '#eab308',
  yellow: '#eab308',
  tím: '#8b5cf6',
  purple: '#8b5cf6',
  cam: '#f97316',
  orange: '#f97316',
  xanh: '#3b82f6',
  blue: '#3b82f6',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getColorHex(color: string): string {
  return COLOR_HEX[color.toLowerCase()] ?? '#a8a29e';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-primary-50 text-primary-700 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function FlowerCard({ flower }: { flower: Flower }) {
  const imageUrl = getFlowerImageUrl(flower.images);
  const name = typeof flower.name === 'object' ? (flower.name.vi ?? flower.name.en) : flower.name;
  const meaning =
    Array.isArray(flower.meanings) && flower.meanings.length > 0 ? flower.meanings[0] : undefined;

  return (
    <Link href={`/flowers/${flower.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          {imageUrl ? (
            <AppImage
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-300">
              <div className="h-16 w-16 rounded-full bg-stone-200" />
            </div>
          )}

          {/* Colors */}
          {flower.colors && flower.colors.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {flower.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: getColorHex(color) }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="group-hover:text-primary-600 mb-1 line-clamp-1 font-medium text-stone-800 transition-colors">
            {name}
          </h3>
          {meaning && (
            <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">{meaning}</p>
          )}
          {flower.seasons && flower.seasons.length > 0 && (
            <p className="mt-2 text-xs text-stone-400">Mùa: {flower.seasons.join(', ')}</p>
          )}
        </div>
      </div>
    </Link>
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
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
      >
        Trước
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum =
            page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
          if (pageNum < 1 || pageNum > totalPages) return null;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                pageNum === page ? 'bg-primary-600 text-white' : 'text-stone-600 hover:bg-stone-100'
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Tiếp
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlowersPage() {
  const searchParams = useSearchParams();
  const initialEmotion = searchParams.get('emotion') ?? '';

  const [emotion, setEmotion] = useState(initialEmotion);
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [showFilters, setShowFilters] = useState(Boolean(initialEmotion));
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
    <div className="relative min-h-screen bg-stone-50">
      <Container className="relative py-8">
        <Breadcrumbs items={[{ label: 'Bộ sưu tập hoa' }]} className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <PetalAccent className="text-primary-400 h-5 w-5" />
            <span className="text-primary-500 text-xs font-semibold tracking-[0.15em] uppercase">
              Bộ sưu tập
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">Thế giới hoa</h1>
          <p className="mt-2 max-w-md text-stone-500">
            Khám phá các loài hoa đẹp và ý nghĩa sâu sắc của chúng
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-4 rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex min-w-0 flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm loài hoa…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-colors outline-none focus:border-stone-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-600 hover:bg-primary-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
              >
                Tìm
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <label htmlFor="sort-flowers" className="sr-only">
                Sắp xếp theo
              </label>
              <select
                id="sort-flowers"
                aria-label="Sắp xếp loài hoa"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="min-w-[160px] cursor-pointer appearance-none rounded-lg border border-stone-200 bg-white px-4 py-2.5 pr-10 text-sm text-stone-700 transition-colors hover:border-stone-300 focus:border-stone-400 focus:outline-none"
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                showFilters
                  ? 'bg-primary-600 text-white'
                  : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary-100 text-primary-700 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-stone-100 pb-5">
                <span className="text-sm text-stone-500">Đang lọc:</span>
                {emotion && (
                  <FilterTag
                    label={EMOTIONS.find((e) => e.key === emotion)?.label ?? emotion}
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
                    label={SEASONS.find((s) => s.value === season)?.label ?? season}
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
                <button
                  onClick={handleClearFilters}
                  className="text-primary-600 hover:text-primary-700 ml-2 text-sm font-medium"
                >
                  Xoá tất cả
                </button>
              </div>
            )}

            {/* Emotion */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-medium text-stone-700">Cảm xúc</p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => {
                      setEmotion(emotion === e.key ? '' : e.key);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-colors',
                      emotion === e.key
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-medium text-stone-700">Màu sắc</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_FILTERS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(color === c.value ? '' : c.value);
                      setPage(1);
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                      color === c.value
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <p className="mb-3 text-sm font-medium text-stone-700">Mùa</p>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setSeason(season === s.value ? '' : s.value);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-colors',
                      season === s.value
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && pagination.total > 0 && (
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-sm text-stone-500">
              Hiển thị <span className="font-medium text-stone-700">{flowers.length}</span> /{' '}
              {pagination.total} loài hoa
            </p>
            <p className="text-sm text-stone-400">
              Sắp xếp: <span className="text-stone-600">{currentSort.label}</span>
            </p>
          </div>
        )}

        {/* Content */}
        {isError ? (
          <div className="rounded-xl border border-stone-200 bg-white py-20 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-stone-300" />
            <p className="font-medium text-stone-700">Đã xảy ra lỗi khi tải dữ liệu</p>
            <p className="mt-1 text-sm text-stone-500">Vui lòng thử lại sau</p>
          </div>
        ) : isLoading ? (
          <FlowerListSkeleton count={12} columns={4} />
        ) : flowers.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white py-24 text-center">
            <Inbox className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <p className="text-lg font-medium text-stone-700">Không tìm thấy loài hoa nào</p>
            <p className="mt-1 text-stone-500">Hãy thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
            {hasActiveFilters && (
              <div className="mt-6">
                <Button variant="outline" onClick={handleClearFilters}>
                  Xoá bộ lọc
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {flowers.map((flower) => (
                <FlowerCard key={flower._id} flower={flower} />
              ))}
            </div>

            <div className="mt-10">
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
