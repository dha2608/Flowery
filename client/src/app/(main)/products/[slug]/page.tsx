'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { AppImage } from '@/components/ui/app-image';
import { Store, Package, ShoppingCart } from 'lucide-react';
import { Container } from '@/components/layout';
import { Badge, Button, ProductDetailSkeleton, FlowerCareInline } from '@/components/ui';
import { useProduct, useProducts, type Product } from '@/hooks/use-products';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  bouquet: 'Bó hoa',
  single: 'Hoa đơn',
  basket: 'Giỏ hoa',
  box: 'Hộp hoa',
  wreath: 'Vòng hoa',
  custom: 'Tùy chỉnh',
  accessory: 'Phụ kiện',
};

const EMOTION_LABELS: Record<string, string> = {
  romantic: 'Lãng mạn',
  grateful: 'Biết ơn',
  joyful: 'Vui vẻ',
  sympathetic: 'Chia sẻ',
  respectful: 'Kính trọng',
  apologetic: 'Xin lỗi',
  celebratory: 'Chúc mừng',
  passionate: 'Đam mê',
  hopeful: 'Hy vọng',
  peaceful: 'Bình yên',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="border-border flex w-fit items-center gap-0 overflow-hidden rounded-xl border">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="text-text-secondary flex h-10 w-10 items-center justify-center transition-colors hover:bg-stone-50 disabled:opacity-40"
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <span className="text-text-primary border-border flex h-10 w-12 items-center justify-center border-x text-center text-sm font-semibold">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="text-text-secondary flex h-10 w-10 items-center justify-center transition-colors hover:bg-stone-50 disabled:opacity-40"
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const img = product.images[0]?.url ?? null;
  const discountPct =
    product.salePrice && product.salePrice < product.price
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : null;
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-base card-hover overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-stone-50">
          {img ? (
            <AppImage
              src={img}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-stone-300" />
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
        <div className="p-3">
          <p className="text-text-primary group-hover:text-primary-600 line-clamp-2 text-sm font-semibold transition-colors">
            {product.name}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-primary-600 text-sm font-bold">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-text-tertiary text-xs line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useProduct(slug);

  // Related products: same emotion or same shop
  const shopId = product && typeof product.shopId === 'object' ? product.shopId._id : undefined;
  const { data: relatedData } = useProducts(product ? { shopId, limit: 4 } : {});
  const relatedProducts = (relatedData?.products ?? []).filter((p) => p.slug !== slug);

  // Must be called before any early returns (Rules of Hooks)
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Package className="h-12 w-12 text-stone-300" />
        <p className="heading-sm text-text-secondary">Không tìm thấy sản phẩm này</p>
        <Link href="/shops">
          <Button variant="outline">Quay lại</Button>
        </Link>
      </div>
    );
  }

  const shopObj = typeof product.shopId === 'object' ? product.shopId : null;
  const discountPct =
    product.salePrice && product.salePrice < product.price
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : null;

  const maxQuantity = product.stock.isUnlimited ? 99 : Math.max(0, product.stock.quantity);
  const inStock = product.stock.isUnlimited || product.stock.quantity > 0;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0]?.url ?? '',
      productSlug: product.slug,
      shopId: shopObj?._id ?? '',
      shopName: shopObj?.name ?? '',
      shopSlug: shopObj?.slug ?? '',
      price: product.price,
      salePrice: product.salePrice,
      quantity,
    });

    toast.success('Đã thêm vào giỏ hàng', {
      description: `${quantity}x ${product.name}`,
      action: {
        label: 'Xem giỏ hàng',
        onClick: () => (window.location.href = '/cart'),
      },
    });
  };

  return (
    <div className="bg-surface min-h-screen py-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="text-text-tertiary mb-8 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          {shopObj && (
            <>
              <Link href="/shops" className="hover:text-primary-600 transition-colors">
                Cửa hàng
              </Link>
              <span>/</span>
              <Link
                href={`/shops/${shopObj.slug}`}
                className="hover:text-primary-600 transition-colors"
              >
                {shopObj.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-secondary line-clamp-1 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left — Image Gallery */}
          <div>
            {/* Main image */}
            <div className="card-base flex aspect-square items-center justify-center overflow-hidden bg-stone-50">
              {product.images.length > 0 ? (
                <AppImage
                  src={product.images[activeImage]?.url ?? ''}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-stone-300" />
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                      idx === activeImage
                        ? 'border-primary-500 shadow-md'
                        : 'border-border hover:border-primary-300'
                    )}
                  >
                    <AppImage src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="space-y-5">
            {/* Name & Category */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="default">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </Badge>
                {!inStock && <Badge variant="danger">Hết hàng</Badge>}
              </div>
              <h1 className="heading-md">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-primary-600 text-2xl font-semibold">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-text-tertiary mb-0.5 text-lg line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="danger">Tiết kiệm {discountPct}%</Badge>
                </>
              )}
            </div>

            {/* Shop Link */}
            {shopObj && (
              <div className="card-base flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                  <Store className="h-4 w-4 text-stone-400" />
                </div>
                <div>
                  <p className="text-text-tertiary text-xs">Bán bởi</p>
                  <Link
                    href={`/shops/${shopObj.slug}`}
                    className="text-primary-600 text-sm font-semibold hover:underline"
                  >
                    {shopObj.name}
                  </Link>
                </div>
              </div>
            )}

            {/* Occasions */}
            {product.occasions.length > 0 && (
              <div>
                <p className="label-text mb-2">Dịp phù hợp</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.occasions.map((o) => (
                    <Badge key={o} variant="info">
                      {o}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Emotions */}
            {product.emotions.length > 0 && (
              <div>
                <p className="label-text mb-2">Cảm xúc</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.emotions.map((e) => (
                    <Badge key={e} variant="primary">
                      {EMOTION_LABELS[e] ?? e}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn('h-2 w-2 rounded-full', inStock ? 'bg-accent-500' : 'bg-red-500')}
              />
              <span
                className={inStock ? 'text-accent-600 font-medium' : 'font-medium text-red-600'}
              >
                {product.stock.isUnlimited
                  ? 'Còn hàng'
                  : product.stock.quantity > 0
                    ? `Còn ${product.stock.quantity} sản phẩm`
                    : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity + CTA */}
            {inStock && (
              <div className="flex items-center gap-3 pt-2">
                <QuantitySelector value={quantity} max={maxQuantity} onChange={setQuantity} />
                <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm vào giỏ hàng
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <section className="card-base mt-10 p-6">
            <h2 className="heading-sm mb-3">Mô tả sản phẩm</h2>
            <p className="body-base whitespace-pre-line">{product.description}</p>
          </section>
        )}

        {/* Flower Care Tips */}
        <section className="card-base mt-6 p-4">
          <h3 className="mb-3 text-sm font-medium text-stone-700">Mẹo chăm sóc hoa</h3>
          <FlowerCareInline />
        </section>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="heading-sm mb-5">Sản phẩm khác từ cửa hàng</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <RelatedProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <div className="mt-10">
          <Button variant="ghost" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </Container>
    </div>
  );
}
