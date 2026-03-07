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

export default function FlowerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: flower, isLoading, isError } = useFlower(slug);

  // Load products linked to this flower
  const { data: productsData } = useProducts(
    flower ? { flowerId: flower._id, limit: 6 } : {},
  );
  const relatedProducts = productsData?.products ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin hoa…" />
      </div>
    );
  }

  if (isError || !flower) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="body-lg text-stone-700">Không tìm thấy loài hoa này.</p>
        <Link href="/flowers">
          <Button variant="outline">← Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const mainImage = getFlowerImageUrl(flower.images);

  return (
    <div className="bg-stone-50 min-h-screen py-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 label-text mb-8">
          <Link href="/" className="hover:text-stone-600 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/flowers" className="hover:text-stone-600 transition-colors">
            Hoa
          </Link>
          <span>/</span>
          <span className="text-stone-700 font-medium line-clamp-1">{flower.name.vi}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Image */}
          <div>
            <div className="card-base overflow-hidden aspect-square bg-stone-100 flex items-center justify-center">
              {mainImage ? (
                <AppImage
                  src={mainImage}
                  alt={flower.name.vi}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-100" />
              )}
            </div>

            {/* Thumbnail row */}
            {flower.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {flower.images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 shrink-0"
                  >
                    <AppImage src={img.url} alt="" className="w-full h-full object-cover" />
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
              <p className="body-lg italic mt-1">{flower.name.en}</p>
              {flower.scientificName && (
                <p className="body-sm font-mono mt-0.5">{flower.scientificName}</p>
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
                      className="px-3 py-1 text-sm border border-stone-200 rounded-lg text-stone-700"
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
                <div className="flex items-center gap-3 flex-wrap">
                  {flower.colors.map((color) => (
                    <div key={color} className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full ring-2 ring-stone-200 shrink-0"
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
                      className="px-3 py-1 text-sm border border-stone-200 rounded-lg text-stone-700"
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
                    className="px-2 py-0.5 text-xs border border-stone-200 rounded text-stone-500"
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
          <section className="mt-10 card-base p-6">
            <h2 className="heading-sm mb-3">Ý nghĩa văn hoá</h2>
            <p className="body-base">{flower.culturalSignificance.vi}</p>
          </section>
        )}

        {/* Care Instructions */}
        {flower.careInstructions && (
          <section className="mt-6 card-base p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((product) => {
                const shopName =
                  typeof product.shopId === 'object' ? product.shopId.name : '';
                const img = product.images[0];
                const discountPct =
                  product.salePrice && product.salePrice < product.price
                    ? Math.round((1 - product.salePrice / product.price) * 100)
                    : null;
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="card-base card-hover overflow-hidden">
                      <div className="aspect-video bg-stone-100 overflow-hidden">
                        {img ? (
                          <AppImage
                            src={img.url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-stone-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </p>
                        {shopName && (
                          <p className="body-sm mt-0.5">{shopName}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary-600 font-bold text-sm">
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
