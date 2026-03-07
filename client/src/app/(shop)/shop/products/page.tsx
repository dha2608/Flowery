'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Pencil, Trash2, Plus, ImageOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useMyShopProducts, useDeleteProduct } from '@/hooks/use-shop-management';
import type { Product } from '@/hooks/use-products';
import { Card, CardContent, Badge, Spinner, Button, Modal } from '@/components/ui';
import { formatPrice, cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'single_flower', label: 'Hoa đơn' },
  { value: 'bouquet', label: 'Bó hoa' },
  { value: 'arrangement', label: 'Cắm bình' },
  { value: 'basket', label: 'Giỏ hoa' },
  { value: 'box', label: 'Hộp hoa' },
  { value: 'subscription_pack', label: 'Gói đăng ký' },
  { value: 'custom', label: 'Tùy chỉnh' },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  single_flower: 'Hoa đơn',
  bouquet: 'Bó hoa',
  arrangement: 'Cắm bình',
  basket: 'Giỏ hoa',
  box: 'Hộp hoa',
  subscription_pack: 'Gói đăng ký',
  custom: 'Tùy chỉnh',
};

// ─── Product Card ─────────────────────────────────────────────────────────────

function ShopProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {primaryImage?.url ? (
          <AppImage
            src={primaryImage.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="h-10 w-10" />
            <span className="text-xs">Không có ảnh</span>
          </div>
        )}

        {/* Overlays */}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
              Tạm dừng
            </span>
          </div>
        )}
        {!product.stock.isUnlimited && product.stock.quantity <= 5 && product.isAvailable && (
          <span className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow">
            Còn {product.stock.quantity}
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow">
            Giảm giá
          </span>
        )}
      </div>

      {/* Body */}
      <CardContent className="p-3">
        {/* Category badge */}
        <Badge variant="default" size="sm" className="mb-1.5">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </Badge>

        {/* Name */}
        <p className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-gray-900">
          {product.name}
        </p>

        {/* Price */}
        <div className="mb-1 flex flex-wrap items-baseline gap-1.5">
          <span className="font-bold text-rose-600">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock + rating */}
        <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
          <span>
            {product.stock.isUnlimited ? 'Không giới hạn' : `Kho: ${product.stock.quantity}`}
          </span>
          {product.averageRating !== undefined && product.averageRating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => onDelete(product)}
            className="flex-1"
          >
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
        <Package className="h-7 w-7 text-stone-400" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">
          {hasFilter ? 'Không có sản phẩm nào' : 'Chưa có sản phẩm nào'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {hasFilter
            ? 'Không có sản phẩm nào trong danh mục này. Hãy thử danh mục khác.'
            : 'Hãy thêm sản phẩm đầu tiên để bắt đầu bán hàng!'}
        </p>
      </div>
      {!hasFilter && (
        <Link href="/shop/products/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm sản phẩm đầu tiên
          </Button>
        </Link>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopProductsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useMyShopProducts({
    category: selectedCategory || undefined,
    limit: 24,
  });
  const deleteProduct = useDeleteProduct();

  const products = data?.products ?? [];

  const handleEdit = (product: Product) => {
    router.push(`/shop/products/${product._id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget._id);
      toast.success(`Đã xóa sản phẩm "${deleteTarget.name}"`);
      setDeleteTarget(null);
    } catch {
      toast.error('Xóa sản phẩm thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Category Tabs — underline style */}
      <div className="flex flex-wrap gap-0 border-b border-stone-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
              selectedCategory === cat.value
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      {!isLoading && products.length > 0 && (
        <p className="body-sm">
          Hiển thị <span className="font-semibold text-stone-700">{products.length}</span> sản phẩm
          {selectedCategory && (
            <>
              {' '}trong danh mục{' '}
              <span className="font-semibold text-primary-600">
                {CATEGORY_LABELS[selectedCategory] ?? selectedCategory}
              </span>
            </>
          )}
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải sản phẩm..." />
        </div>
      ) : products.length === 0 ? (
        <EmptyState hasFilter={!!selectedCategory} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ShopProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xác nhận xóa sản phẩm"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
            <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">Hành động không thể hoàn tác</p>
              <p className="mt-0.5 text-sm text-red-600">
                Sản phẩm{' '}
                <span className="font-semibold">"{deleteTarget?.name}"</span> sẽ bị xóa
                vĩnh viễn khỏi cửa hàng.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteProduct.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="danger"
              isLoading={deleteProduct.isPending}
              onClick={handleDeleteConfirm}
            >
              Xóa sản phẩm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
