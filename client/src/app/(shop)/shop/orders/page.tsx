'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useShopOrders, useUpdateOrderStatus } from '@/hooks/use-shop-management';
import { Badge, Button, Spinner } from '@/components/ui';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import type { OrderStatus } from '@/hooks/use-orders';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'preparing', label: 'Đang chuẩn bị' },
  { value: 'delivering', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

const ORDER_STATUS_BADGE: Record<
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

interface NextAction {
  nextStatus: OrderStatus;
  label: string;
  isDanger?: boolean;
}

const STATUS_NEXT_ACTIONS: Partial<Record<OrderStatus, NextAction[]>> = {
  pending: [
    { nextStatus: 'confirmed', label: 'Xác nhận' },
    { nextStatus: 'cancelled', label: 'Hủy', isDanger: true },
  ],
  confirmed: [{ nextStatus: 'preparing', label: 'Chuẩn bị' }],
  preparing: [{ nextStatus: 'delivering', label: 'Giao hàng' }],
  delivering: [{ nextStatus: 'delivered', label: 'Đã giao' }],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopOrdersPage() {
  const [activeStatus, setActiveStatus] = useState('');
  const [page, setPage] = useState(1);
  const updateStatus = useUpdateOrderStatus();

  const { data, isLoading } = useShopOrders({
    status: activeStatus || undefined,
    page,
    limit: 10,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: nextStatus });
      toast.success('Cập nhật trạng thái thành công!');
    } catch {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  const handleTabChange = (val: string) => {
    setActiveStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* ── Status filter tabs — underline style ──────────────────────── */}
      <div className="flex flex-wrap gap-0 border-b border-stone-200 bg-white rounded-t-xl">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
              activeStatus === tab.value
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Orders table ───────────────────────────────────────────────── */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Đang tải đơn hàng..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex items-center justify-center rounded-full bg-stone-100">
              <ShoppingBag className="h-6 w-6 text-stone-300" />
            </div>
            <p className="text-sm font-medium text-gray-700">Không có đơn hàng nào</p>
            <p className="text-xs text-gray-400">Đơn hàng sẽ hiển thị ở đây khi khách đặt</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {[
                    'Mã đơn',
                    'Khách hàng',
                    'Món hàng',
                    'Tổng tiền',
                    'Trạng thái',
                    'Ngày giao',
                    'Thao tác',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const status = order.status as OrderStatus;
                  const nextActions = STATUS_NEXT_ACTIONS[status] ?? [];
                  // userId may be populated (object) in the API response
                  const rawUserId = order.userId as unknown;
                  const customerName =
                    rawUserId !== null &&
                    typeof rawUserId === 'object' &&
                    'name' in (rawUserId as object)
                      ? (rawUserId as { name: string }).name
                      : order.deliveryAddress.recipientName;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/shop/orders/${order._id}`}
                          className="font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                        {customerName}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {order.items.length} món
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                        {formatPrice(order.pricing.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={ORDER_STATUS_BADGE[status] ?? 'default'} size="sm">
                          {ORDER_STATUS_LABELS[status] ?? status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(order.deliveryDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {nextActions.map((action) => (
                            <Button
                              key={action.nextStatus}
                              size="sm"
                              variant={action.isDanger ? 'danger' : 'outline'}
                              isLoading={updateStatus.isPending}
                              onClick={() => handleStatusChange(order._id, action.nextStatus)}
                              className={cn(
                                'text-xs',
                                !action.isDanger &&
                                  'border-rose-200 text-rose-600 hover:bg-rose-50',
                              )}
                            >
                              {action.label}
                            </Button>
                          ))}
                          {nextActions.length === 0 && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between card-base px-5 py-3">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} · {pagination.total} đơn hàng
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
            >
              Trước
            </Button>
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
