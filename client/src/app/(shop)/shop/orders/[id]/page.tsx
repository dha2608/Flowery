'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Package, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useUpdateOrderStatus } from '@/hooks/use-shop-management';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Spinner,
} from '@/components/ui';
import { formatPrice, formatDate, formatDateTime, cn } from '@/lib/utils';
import type { OrderStatus, OrderItem } from '@/hooks/use-orders';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedUser {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: { url: string };
}

interface PopulatedOrder {
  _id: string;
  orderNumber: string;
  userId: PopulatedUser | string;
  shopId: { _id: string; name: string; slug: string };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    totalAmount: number;
  };
  status: OrderStatus;
  deliveryAddress: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  deliveryDate: string;
  giftMessage?: string;
  isAnonymous: boolean;
  paymentMethod: string;
  paymentStatus: string;
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const HISTORY_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-400',
  preparing: 'bg-rose-400',
  delivering: 'bg-purple-400',
  delivered: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  refunded: 'bg-gray-400',
};

interface NextAction {
  nextStatus: OrderStatus;
  label: string;
  isDanger?: boolean;
}

const STATUS_NEXT_ACTIONS: Partial<Record<OrderStatus, NextAction[]>> = {
  pending: [
    { nextStatus: 'confirmed', label: 'Xác nhận đơn' },
    { nextStatus: 'cancelled', label: 'Hủy đơn', isDanger: true },
  ],
  confirmed: [{ nextStatus: 'preparing', label: 'Bắt đầu chuẩn bị' }],
  preparing: [{ nextStatus: 'delivering', label: 'Bàn giao giao hàng' }],
  delivering: [{ nextStatus: 'delivered', label: 'Xác nhận đã giao' }],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getPopulatedUser(userId: PopulatedUser | string): PopulatedUser | null {
  if (typeof userId === 'object' && userId !== null) return userId;
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { accessToken } = useAuthStore();
  const updateStatus = useUpdateOrderStatus();

  const { data: order, isLoading } = useQuery({
    queryKey: ['shop-order-detail', id],
    queryFn: async () => {
      const res = await api.get<PopulatedOrder>('/orders/' + id, accessToken ?? undefined);
      return res.data ?? null;
    },
    enabled: !!id,
  });

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    if (!order) return;
    try {
      await updateStatus.mutateAsync({ id: order._id, status: nextStatus });
      toast.success('Cập nhật trạng thái thành công!');
    } catch {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" label="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-gray-500">Không tìm thấy đơn hàng</p>
        <Link href="/shop/orders">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const status = order.status;
  const nextActions = STATUS_NEXT_ACTIONS[status] ?? [];
  const populatedUser = getPopulatedUser(order.userId);

  const fullAddress = [
    order.deliveryAddress.street,
    order.deliveryAddress.ward,
    order.deliveryAddress.district,
    order.deliveryAddress.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/shop/orders"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Đơn hàng
          </Link>
          <span className="text-gray-300">/</span>
          <h2 className="text-base font-semibold text-gray-900">#{order.orderNumber}</h2>
          <Badge variant={ORDER_STATUS_BADGE[status] ?? 'default'}>
            {ORDER_STATUS_LABELS[status] ?? status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {nextActions.map((action) => (
            <Button
              key={action.nextStatus}
              size="sm"
              variant={action.isDanger ? 'danger' : 'primary'}
              isLoading={updateStatus.isPending}
              onClick={() => handleStatusChange(action.nextStatus)}
              className={cn(
                !action.isDanger && 'bg-rose-500 hover:bg-rose-600 text-white',
              )}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-5 lg:col-span-2">
          {/* Customer info */}
          {populatedUser && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-rose-500" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-semibold text-sm">
                    {populatedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{populatedUser.name}</p>
                    {populatedUser.email && (
                      <p className="text-sm text-gray-500">{populatedUser.email}</p>
                    )}
                  </div>
                </div>
                {populatedUser.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-500">Điện thoại:</span>
                    {populatedUser.phone}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Delivery info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-rose-500" />
                Thông tin giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Người nhận</p>
                  <p className="font-medium text-gray-900">
                    {order.deliveryAddress.recipientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Điện thoại</p>
                  <p className="font-medium text-gray-900">
                    {order.deliveryAddress.recipientPhone}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="font-medium text-gray-900">{fullAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày giao</p>
                  <p className="font-medium text-gray-900">{formatDate(order.deliveryDate)}</p>
                </div>
              </div>
              {order.giftMessage && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-100 px-4 py-3">
                  <p className="text-xs font-medium text-rose-500 mb-1">Lời nhắn kèm hoa</p>
                  <p className="text-sm text-gray-700 italic">"{order.giftMessage}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-rose-500" />
                Sản phẩm đặt hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Sản phẩm
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      SL
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Đơn giá
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-3.5 text-right text-gray-600">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Pricing summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tổng kết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.pricing.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>{formatPrice(order.pricing.deliveryFee)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.pricing.discount)}</span>
                </div>
              )}
              {order.pricing.couponCode && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Mã giảm giá</span>
                  <Badge size="sm" variant="success">
                    {order.pricing.couponCode}
                  </Badge>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-semibold text-base text-gray-900">
                <span>Tổng cộng</span>
                <span className="text-rose-600">{formatPrice(order.pricing.totalAmount)}</span>
              </div>

              <div className="mt-2 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Phương thức TT</span>
                  <span className="font-medium uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái TT</span>
                  <Badge
                    size="sm"
                    variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                  >
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-rose-500" />
                Lịch sử trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.statusHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Chưa có lịch sử</p>
              ) : (
                <ol className="space-y-4">
                  {order.statusHistory.map((entry, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
                            HISTORY_STATUS_COLORS[entry.status] ?? 'bg-gray-300',
                          )}
                        />
                        {idx < order.statusHistory.length - 1 && (
                          <span className="mt-1.5 flex-1 w-px bg-gray-100" />
                        )}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {ORDER_STATUS_LABELS[entry.status as OrderStatus] ?? entry.status}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDateTime(entry.timestamp)}
                        </p>
                        {entry.note && (
                          <p className="mt-0.5 text-xs text-gray-500 italic">{entry.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardContent className="space-y-2 text-xs text-gray-500 py-4">
              <div className="flex justify-between">
                <span>Ngày tạo</span>
                <span className="text-gray-700">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cập nhật</span>
                <span className="text-gray-700">{formatDateTime(order.updatedAt)}</span>
              </div>
              {order.cancelReason && (
                <div className="mt-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                  <p className="text-xs font-medium text-red-500">Lý do hủy</p>
                  <p className="text-xs text-gray-600 mt-0.5">{order.cancelReason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
