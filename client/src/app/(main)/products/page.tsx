'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronDown,
  Heart,
  Inbox,
  Package,
  Search,
  SlidersHorizontal,
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
import { PetalAccent } from '@/components/ui/botanicals';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'single_flower', label: 'Hoa đơn' },
  { value: 'bouquet', label: 'Bó hoa' },
  { value: 'arrangement', label: 'Cắm hoa' },
  { value: 'basket', label: 'Giỏ hoa' },
  { value: 'box', label: 'Hộp hoa' },
  { value: 'subscription_pack', label: 'Gói đăng ký' },
  { value: 'custom', label: 'Tuỳ chỉnh' },
];

const OCCASIONS = [
  { value: '', label: 'Tất cả dịp' },
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'valentines', label: 'Valentine' },
  { value: 'mothers_day', label: 'Ngày của mẹ' },
  { value: 'womens_day', label: 'Ngày phụ nữ' },
  { value: 'teachers_day', label: 'Ngày nhà giáo' },
  { value: 'congratulations', label: 'Chúc mừng' },
];

const PRICE_RANGES = [
  { min: undefined, max: undefined, label: 'Tất cả giá' },
  { min: 0, max: 200000, label: 'Dưới 200K' },
  { min: 200000, max: 500000, label: '200K - 500K' },
  { min: 500000, max: 1000000, label: '500K - 1 triệu' },
  { min: 1000000, max: 2000000, label: '1 - 2 triệu' },
  { min: 2000000, max: undefined, label: 'Trên 2 triệu' },
];

const SORT_OPTIONS: { value: string; label: string; sort: ProductSortBy; order: SortOrder }[] = [
  { value: 'popular', label: 'Bán chạy nhất', sort: 'popularity', order: 'desc' },
  { value: 'newest', label: 'Mới nhất', sort: 'createdAt', order: 'desc' },
  { value: 'price-asc', label: 'Giá thấp → cao', sort: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Giá cao → thấp', sort: 'price', order: 'desc' },
];

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

function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product.images);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          {imageUrl ? (
            <AppImage
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-12 w-12 text-stone-300" />
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              -{discountPercent}%
            </div>
          )}

          <button
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4 text-stone-500" />
          </button>

          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="group-hover:text-primary-600 mb-1 line-clamp-2 text-sm font-medium text-stone-800 transition-colors">
            {product.name}
          </h3>

          {typeof product.shopId === 'object' && product.shopId?.name && (
            <p className="mb-2 truncate text-xs text-stone-400">{product.shopId.name}</p>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-primary-600 text-base font-bold">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {(product.totalSold ?? 0) > 0 && (
            <p className="mt-1 text-xs text-stone-400">Đã bán {product.totalSold}</p>
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
    <div className="relative min-h-screen bg-stone-50">
      <Container className="relative py-8">
        <Breadcrumbs items={[{ label: 'Sản phẩm hoa' }]} className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <PetalAccent className="text-primary-400 h-5 w-5" />
            <span className="text-primary-500 text-xs font-semibold tracking-[0.15em] uppercase">
              Cửa hàng
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">Sản phẩm hoa</h1>
          <p className="mt-2 max-w-md text-stone-500">
            Khám phá các mẫu hoa đẹp từ các shop uy tín trên Flowery
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
                  placeholder="Tìm kiếm sản phẩm…"
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
                {category && (
                  <FilterTag
                    label={CATEGORIES.find((c) => c.value === category)?.label ?? category}
                    onRemove={() => {
                      setCategory('');
                      setPage(1);
                    }}
                  />
                )}
                {occasion && (
                  <FilterTag
                    label={OCCASIONS.find((o) => o.value === occasion)?.label ?? occasion}
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
                <button
                  onClick={handleClearFilters}
                  className="text-primary-600 hover:text-primary-700 ml-2 text-sm font-medium"
                >
                  Xoá tất cả
                </button>
              </div>
            )}

            {/* Category */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-medium text-stone-700">Loại sản phẩm</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setCategory(c.value);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-colors',
                      category === c.value
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-medium text-stone-700">Dịp tặng</p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setOccasion(o.value);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-colors',
                      occasion === o.value
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="mb-3 text-sm font-medium text-stone-700">Khoảng giá</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPriceRange(idx);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm transition-colors',
                      priceRange === idx
                        ? 'bg-primary-600 font-medium text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {p.label}
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
              Hiển thị <span className="font-medium text-stone-700">{products.length}</span> /{' '}
              {pagination.total} sản phẩm
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
          <ProductListSkeleton count={12} columns={4} />
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white py-24 text-center">
            <Inbox className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <p className="text-lg font-medium text-stone-700">Không tìm thấy sản phẩm nào</p>
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
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
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
