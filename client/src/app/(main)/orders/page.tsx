'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useOrders, type OrderStatus } from '@/hooks/use-orders';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Badge, Card, CardContent, Spinner } from '@/components/ui';
import { Container } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

const STATUS_BADGE: Record<
  OrderStatus,
  'warning' | 'info' | 'primary' | 'default' | 'success' | 'danger'
> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'primary',
  delivering: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'default',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <Package className="h-4 w-4" />,
  preparing: <Package className="h-4 w-4" />,
  delivering: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  refunded: <RotateCcw className="h-4 w-4" />,
};

const FILTER_TABS: Array<{ label: string; value: string }> = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang xử lý', value: 'confirmed' },
  { label: 'Đang giao', value: 'delivering' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth();
  const [activeStatus, setActiveStatus] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useOrders({ page, limit: 10, status: activeStatus });

  const orders = response?.orders ?? [];
  const pagination = response?.pagination;

  if (authLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải..." />
      </Container>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveStatus(value);
    setPage(1);
  };

  return (
    <Container className="py-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Đơn hàng của tôi' }]} className="mb-4" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Đơn hàng của tôi</h1>
      </div>

      {/* Filter tabs — underline style */}
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-stone-200">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              '-mb-px flex-shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-all',
              activeStatus === tab.value
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải đơn hàng..." />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-red-600">Không thể tải danh sách đơn hàng. Vui lòng thử lại.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="rounded-full bg-stone-100 p-10">
            <ShoppingBag className="h-12 w-12 text-stone-300" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">
              {activeStatus ? 'Không có đơn hàng nào' : 'Bạn chưa có đơn hàng nào'}
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {activeStatus
                ? 'Thử xem đơn hàng ở trạng thái khác.'
                : 'Hãy khám phá và đặt những bó hoa tươi đẹp nhất!'}
            </p>
          </div>
          {!activeStatus && (
            <button
              onClick={() => router.push('/flowers')}
              className="bg-primary-600 hover:bg-primary-700 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Khám phá hoa
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = order.status as OrderStatus;
            return (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <Card hoverable className="card-base card-hover transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Order info */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-stone-900">
                            #{order.orderNumber}
                          </span>
                          <Badge variant={STATUS_BADGE[status] ?? 'default'}>
                            <span className="flex items-center gap-1">
                              {STATUS_ICON[status]}
                              {STATUS_LABELS[status] ?? status}
                            </span>
                          </Badge>
                        </div>

                        <p className="text-sm text-stone-500">
                          {order.shopId.name} · {order.items.length} sản phẩm
                        </p>

                        <p className="text-xs text-stone-400">
                          Đặt lúc {formatDateTime(order.createdAt)}
                        </p>
                      </div>

                      {/* Total & arrow */}
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-primary-600 font-bold">
                          {formatPrice(order.pricing.totalAmount)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-stone-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Trước
          </button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                  )}
                >
                  {p}
                </button>
              ))}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {pagination && (
        <p className="mt-4 text-center text-xs text-stone-400">
          Hiển thị {orders.length} / {pagination.total} đơn hàng
        </p>
      )}
    </Container>
  );
}
