'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Store, Package, Car, Clock, Tag } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Button, Spinner } from '@/components/ui';
import { useShop, useShopProducts } from '@/hooks/use-shops';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('w-4 h-4', i < stars ? 'text-yellow-400' : 'text-stone-200')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="card-base overflow-hidden animate-pulse">
      <div className="aspect-video bg-stone-100" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-stone-100 rounded w-3/4" />
        <div className="h-4 bg-stone-100 rounded w-1/3" />
      </div>
    </div>
  );
}

function ProductPagination({
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
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Trước
      </Button>
      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
        const p = Math.max(1, page - 2) + i;
        if (p > totalPages) return null;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              p === page ? 'bg-primary-600 text-white' : 'text-text-secondary hover:bg-stone-100',
            )}
          >
            {p}
          </button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Tiếp
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [productPage, setProductPage] = useState(1);

  const { data: shop, isLoading, isError } = useShop(slug);
  const { data: productsData, isLoading: productsLoading } = useShopProducts(slug, {
    page: productPage,
    limit: 12,
  });

  const products = productsData?.products ?? [];
  const productsPagination = productsData?.pagination ?? {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin cửa hàng…" />
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Store className="w-12 h-12 text-stone-300" />
        <p className="heading-sm text-text-secondary">Không tìm thấy cửa hàng này</p>
        <Link href="/shops">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const fullAddress = [
    shop.address.street,
    shop.address.ward,
    shop.address.district,
    shop.address.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-surface min-h-screen">
      {/* Cover Image Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-stone-100">
        {shop.coverImage?.url ? (
          <AppImage
            src={shop.coverImage.url}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-16 h-16 text-stone-300" />
          </div>
        )}
        {shop.coverImage?.url && (
          <div className="absolute inset-0 bg-black/20" />
        )}
      </div>

      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/shops" className="hover:text-primary-600 transition-colors">
            Cửa hàng
          </Link>
          <span>/</span>
          <span className="text-text-secondary font-medium">{shop.name}</span>
        </nav>

        {/* Shop Header Card */}
        <div className="card-base p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0 bg-stone-100 flex items-center justify-center self-start">
              {shop.logo?.url ? (
                <AppImage src={shop.logo.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-stone-400">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="heading-md">{shop.name}</h1>
                {shop.isVerified && (
                  <Badge variant="success">Đã xác thực</Badge>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap text-sm text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={shop.stats.rating} />
                  <span className="font-medium text-text-primary">
                    {shop.stats.rating.toFixed(1)}
                  </span>
                  <span>({shop.stats.totalReviews} đánh giá)</span>
                </div>
                <span>·</span>
                <span>{shop.stats.totalOrders} đơn hàng</span>
                <span>·</span>
                <span>{shop.stats.totalProducts} sản phẩm</span>
              </div>

              {shop.description && (
                <p className="body-sm mt-3">{shop.description}</p>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-border-light text-sm">
            <div className="flex gap-2.5">
              <MapPin className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
              <span className="text-text-secondary">{fullAddress}</span>
            </div>
            <div className="flex gap-2.5">
              <Phone className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
              <span className="text-text-secondary">{shop.phone}</span>
            </div>
          </div>

          {/* Operating Hours */}
          {shop.operatingHours.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border-light">
              <p className="text-sm font-semibold text-text-primary mb-3">Giờ hoạt động</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {shop.operatingHours.map((h) => (
                  <div
                    key={h.day}
                    className={cn(
                      'text-center rounded-lg p-2 text-xs',
                      h.isClosed
                        ? 'bg-stone-100 text-text-tertiary'
                        : 'bg-primary-50 text-primary-700',
                    )}
                  >
                    <p className="font-semibold">{DAY_LABELS[h.day]}</p>
                    {h.isClosed ? (
                      <p>Đóng</p>
                    ) : (
                      <p>
                        {h.open}–{h.close}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="mt-5 pt-5 border-t border-border-light flex flex-wrap gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-text-tertiary" />
              <span>Phạm vi giao hàng: {shop.deliveryConfig.maxDistance} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-text-tertiary" />
              <span>Thời gian dự kiến: {shop.deliveryConfig.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-text-tertiary" />
              <span>
                Miễn phí giao từ {formatPrice(shop.deliveryConfig.freeAboveAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="heading-sm">Sản phẩm</h2>
            <span className="body-sm">{productsPagination.total} sản phẩm</span>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="body-base">Cửa hàng chưa có sản phẩm nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => {
                  const img = product.images[0]?.url ?? null;
                  const discountPct =
                    product.salePrice && product.salePrice < product.price
                      ? Math.round((1 - product.salePrice / product.price) * 100)
                      : null;
                  return (
                    <Link key={product._id} href={`/products/${product.slug}`} className="group">
                      <div className="card-base card-hover overflow-hidden">
                        <div className="aspect-video bg-stone-50 overflow-hidden relative">
                          {img ? (
                            <AppImage
                              src={img}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-stone-300" />
                            </div>
                          )}
                          {discountPct && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="danger" size="sm">
                                -{discountPct}%
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-text-primary line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-primary-600 font-bold text-sm">
                              {formatPrice(product.salePrice ?? product.price)}
                            </span>
                            {product.salePrice && product.salePrice < product.price && (
                              <span className="text-xs text-text-tertiary line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-tertiary mt-1">
                            {product.stock.isUnlimited
                              ? 'Còn hàng'
                              : product.stock.quantity > 0
                                ? `Còn ${product.stock.quantity} sản phẩm`
                                : 'Hết hàng'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <ProductPagination
                page={productsPagination.page}
                totalPages={productsPagination.totalPages}
                onPageChange={setProductPage}
              />
            </>
          )}
        </section>

        {/* Back */}
        <div className="mt-10">
          <Link href="/shops">
            <Button variant="outline">Quay lại danh sách cửa hàng</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
