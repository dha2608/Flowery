'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Star,
  Clock,
  CalendarDays,
  Plus,
  ChevronRight,
  Store,
  Pencil,
} from 'lucide-react';
import { useMyShop, useShopStats, useShopOrders } from '@/hooks/use-shop-management';
import { useAuthStore } from '@/lib/store';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Spinner,
  Button,
} from '@/components/ui';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';
import type { OrderStatus } from '@/hooks/use-orders';

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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  href?: string;
  trend?: string;
}

function StatCard({ icon, iconBg, label, value, href, trend }: StatCardProps) {
  const inner = (
    <div className={cn('card-base p-5 flex items-center gap-4', href && 'card-hover cursor-pointer group')}>
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform',
          href && 'group-hover:scale-105',
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold text-stone-900 leading-none">{value}</p>
        <p className="mt-1 body-sm">{label}</p>
        {trend && <p className="mt-0.5 text-xs font-medium text-primary-600">{trend}</p>}
      </div>
      {href && <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-primary-500" />}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopDashboardPage() {
  const { user } = useAuthStore();
  const { data: shop, isLoading: shopLoading } = useMyShop();
  const { data: stats, isLoading: statsLoading } = useShopStats();
  const { data: ordersData, isLoading: ordersLoading } = useShopOrders({ limit: 5 });

  const recentOrders = ordersData?.orders.slice(0, 5) ?? [];
  const isStatsLoading = shopLoading || statsLoading;

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="card-base p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-text">Xin chào,</p>
            <h1 className="heading-md mt-1">
              {shop?.name ?? user?.name ?? 'Cửa hàng'}
            </h1>
            <p className="body-sm mt-1">
              Quản lý và phát triển cửa hàng hoa của bạn mỗi ngày
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/shop/products/new">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Plus className="h-4 w-4" />}
                className="border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Thêm sản phẩm
              </Button>
            </Link>
            <Link href="/shop/orders">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<ShoppingBag className="h-4 w-4" />}
                className="border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Xem đơn hàng
              </Button>
            </Link>
            <Link href="/shop/settings">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Store className="h-4 w-4" />}
                className="border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Cài đặt shop
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      {isStatsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" label="Đang tải thống kê..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<Package className="h-5 w-5 text-primary-600" />}
            iconBg="bg-primary-50"
            label="Tổng sản phẩm"
            value={stats?.totalProducts ?? shop?.stats.totalProducts ?? 0}
            href="/shop/products"
          />
          <StatCard
            icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Tổng đơn hàng"
            value={stats?.totalOrders ?? shop?.stats.totalOrders ?? 0}
            href="/shop/orders"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label="Doanh thu"
            value={formatPrice(stats?.totalRevenue ?? 0)}
          />
          <StatCard
            icon={<Star className="h-5 w-5 text-amber-500" />}
            iconBg="bg-amber-50"
            label="Đánh giá trung bình"
            value={`${(stats?.averageRating ?? shop?.stats.rating ?? 0).toFixed(1)} / 5`}
            href="/shop/reviews"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            iconBg="bg-orange-50"
            label="Đơn chờ xử lý"
            value={stats?.pendingOrders ?? 0}
            href="/shop/orders?status=pending"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5 text-violet-600" />}
            iconBg="bg-violet-50"
            label="Đơn hôm nay"
            value={stats?.todayOrders ?? 0}
          />
        </div>
      )}

      {/* ── Recent Orders ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4 text-primary-500" />
            Đơn hàng gần đây
          </CardTitle>
          <Link
            href="/shop/orders"
            className="flex items-center gap-0.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size="sm" label="Đang tải..." />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
                <ShoppingBag className="h-6 w-6 text-stone-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">Chưa có đơn hàng nào</p>
                <p className="mt-1 body-sm">
                  Đơn hàng sẽ xuất hiện ở đây khi khách đặt
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentOrders.map((order) => {
                const status = order.status as OrderStatus;
                return (
                  <div
                    key={order._id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50">
                      <ShoppingBag className="h-4 w-4 text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-stone-400">
                        {order.deliveryAddress.recipientName} ·{' '}
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge
                        variant={ORDER_STATUS_BADGE[status] ?? 'default'}
                        size="sm"
                      >
                        {ORDER_STATUS_LABELS[status] ?? status}
                      </Badge>
                      <span className="text-xs font-semibold text-primary-600">
                        {formatPrice(order.pricing.totalAmount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <div>
        <h2 className="label-text mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              href: '/shop/products/new',
              icon: <Plus className="h-5 w-5 text-primary-500" />,
              bg: 'bg-primary-50',
              label: 'Thêm sản phẩm',
            },
            {
              href: '/shop/orders',
              icon: <ShoppingBag className="h-5 w-5 text-blue-500" />,
              bg: 'bg-blue-50',
              label: 'Xử lý đơn hàng',
            },
            {
              href: '/shop/reviews',
              icon: <Star className="h-5 w-5 text-amber-500" />,
              bg: 'bg-amber-50',
              label: 'Đọc đánh giá',
            },
            {
              href: '/shop/settings',
              icon: <Pencil className="h-5 w-5 text-violet-500" />,
              bg: 'bg-violet-50',
              label: 'Sửa thông tin shop',
            },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="card-base card-hover group cursor-pointer p-5 flex flex-col items-center gap-2.5 text-center">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full transition-transform group-hover:scale-110',
                    action.bg,
                  )}
                >
                  {action.icon}
                </div>
                <p className="text-xs font-medium text-stone-700">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
