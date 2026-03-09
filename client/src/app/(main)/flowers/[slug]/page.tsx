'use client';

import { use } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Badge, Button, Spinner } from '@/components/ui';
import { AppImage } from '@/components/ui/app-image';
import { useFlower, getFlowerImageUrl } from '@/hooks/use-flowers';
import { useProducts } from '@/hooks/use-products';
import { formatPrice } from '@/lib/utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
  red: '#ef4444',
  đỏ: '#ef4444',
  pink: '#ec4899',
  hồng: '#ec4899',
  white: '#f3f4f6',
  trắng: '#f3f4f6',
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
};

const SEASON_LABEL: Record<string, string> = {
  spring: 'Xuân',
  summer: 'Hạ',
  autumn: 'Thu',
  winter: 'Đông',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlowerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: flower, isLoading, isError } = useFlower(slug);

  // Load products linked to this flower
  const { data: productsData } = useProducts(flower ? { flowerId: flower._id, limit: 6 } : {});
  const relatedProducts = productsData?.products ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin hoa…" />
      </div>
    );
  }

  if (isError || !flower) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="body-lg text-stone-700">Không tìm thấy loài hoa này.</p>
        <Link href="/flowers">
          <Button variant="outline">← Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const mainImage = getFlowerImageUrl(flower.images);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="label-text mb-8 flex items-center gap-2">
          <Link href="/" className="transition-colors hover:text-stone-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/flowers" className="transition-colors hover:text-stone-600">
            Hoa
          </Link>
          <span>/</span>
          <span className="line-clamp-1 font-medium text-stone-700">{flower.name.vi}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left — Image */}
          <div>
            <div className="card-base relative flex aspect-square items-center justify-center overflow-hidden bg-stone-100">
              {mainImage ? (
                <AppImage src={mainImage} alt={flower.name.vi} className="object-cover" />
              ) : (
                <div className="h-full w-full bg-stone-100" />
              )}
            </div>

            {/* Thumbnail row */}
            {flower.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {flower.images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200"
                  >
                    <AppImage src={img.url} alt="" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="space-y-6">
            {/* Names */}
            <div>
              <h1 className="heading-lg">{flower.name.vi}</h1>
              <p className="body-lg mt-1 italic">{flower.name.en}</p>
              {flower.scientificName && (
                <p className="body-sm mt-0.5 font-mono">{flower.scientificName}</p>
              )}
            </div>

            {/* Description */}
            {flower.description?.vi && (
              <div>
                <h2 className="label-text mb-2">Mô tả</h2>
                <p className="body-base">{flower.description.vi}</p>
              </div>
            )}

            {/* Meanings */}
            {flower.meanings.length > 0 && (
              <div>
                <h2 className="label-text mb-2.5">Ý nghĩa</h2>
                <div className="flex flex-wrap gap-2">
                  {flower.meanings.map((m) => (
                    <span
                      key={m}
                      className="rounded-lg border border-stone-200 px-3 py-1 text-sm text-stone-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {flower.colors.length > 0 && (
              <div>
                <h2 className="label-text mb-2.5">Màu sắc</h2>
                <div className="flex flex-wrap items-center gap-3">
                  {flower.colors.map((color) => (
                    <div key={color} className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 shrink-0 rounded-full ring-2 ring-stone-200"
                        style={{ backgroundColor: COLOR_HEX[color.toLowerCase()] ?? '#d1d5db' }}
                      />
                      <span className="body-sm capitalize">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seasons */}
            {flower.seasons.length > 0 && (
              <div>
                <h2 className="label-text mb-2.5">Mùa nở</h2>
                <div className="flex flex-wrap gap-2">
                  {flower.seasons.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-stone-200 px-3 py-1 text-sm text-stone-700"
                    >
                      {SEASON_LABEL[s] ?? s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {flower.tags && flower.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {flower.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-stone-200 px-2 py-0.5 text-xs text-stone-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cultural Significance */}
        {flower.culturalSignificance && (
          <section className="card-base mt-10 p-6">
            <h2 className="heading-sm mb-3">Ý nghĩa văn hoá</h2>
            <p className="body-base">{flower.culturalSignificance.vi}</p>
          </section>
        )}

        {/* Care Instructions */}
        {flower.careInstructions && (
          <section className="card-base mt-6 p-6">
            <h2 className="heading-sm mb-3">Hướng dẫn chăm sóc</h2>
            <p className="body-base whitespace-pre-line">{flower.careInstructions.vi}</p>
          </section>
        )}

        {/* Related Products */}
        <section className="mt-10">
          <h2 className="heading-sm mb-5">Sản phẩm từ loài hoa này</h2>
          {relatedProducts.length === 0 ? (
            <p className="body-sm">Chưa có sản phẩm nào từ loài hoa này.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => {
                const shopName = typeof product.shopId === 'object' ? product.shopId.name : '';
                const img = product.images[0];
                const discountPct =
                  product.salePrice && product.salePrice < product.price
                    ? Math.round((1 - product.salePrice / product.price) * 100)
                    : null;
                return (
                  <Link key={product._id} href={`/products/${product.slug}`} className="group">
                    <div className="card-base card-hover overflow-hidden">
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        {img ? (
                          <AppImage
                            src={img.url}
                            alt={product.name}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-stone-100" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="group-hover:text-primary-600 line-clamp-1 font-medium text-stone-900 transition-colors">
                          {product.name}
                        </p>
                        {shopName && <p className="body-sm mt-0.5">{shopName}</p>}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-primary-600 text-sm font-bold">
                            {formatPrice(product.salePrice ?? product.price)}
                          </span>
                          {discountPct && (
                            <Badge variant="danger" size="sm">
                              -{discountPct}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Back button */}
        <div className="mt-10">
          <Link href="/flowers">
            <Button variant="outline">← Quay lại danh sách hoa</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
