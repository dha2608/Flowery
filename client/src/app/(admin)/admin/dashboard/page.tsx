'use client';

import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  ShoppingCart,
  DollarSign,
  PlusCircle,
  Star,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from '@/components/ui';
import { useAdminStats } from '@/hooks/use-admin';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

const STATUS_BADGE: Record<
  string,
  'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default'
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
  sub?: string;
}

function StatCard({ icon, iconBg, label, value, sub }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div
          className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', iconBg)}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl leading-none font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data: statsRes, isLoading, isError } = useAdminStats();
  const stats = statsRes?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" label="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Không thể tải dữ liệu. Vui lòng thử lại.</p>
      </div>
    );
  }

  const {
    overview = { totalUsers: 0, totalShops: 0, totalOrders: 0, totalRevenue: 0 },
    today = { newUsers: 0, newShops: 0, newOrders: 0, revenue: 0 },
    topShops = [],
    recentOrders = [],
  } = stats;

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div>
        <h2 className="label-text mb-3">Tổng quan toàn hệ thống</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-indigo-600" />}
            iconBg="bg-indigo-100"
            label="Tổng người dùng"
            value={(overview.totalUsers ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<Store className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-100"
            label="Tổng cửa hàng"
            value={(overview.totalShops ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<ShoppingBag className="h-5 w-5 text-amber-600" />}
            iconBg="bg-amber-100"
            label="Tổng đơn hàng"
            value={(overview.totalOrders ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
            iconBg="bg-rose-100"
            label="Tổng doanh thu"
            value={formatPrice(overview.totalRevenue ?? 0)}
          />
        </div>
      </div>

      {/* Today cards */}
      <div>
        <h2 className="label-text mb-3">Hôm nay</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<UserPlus className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-100"
            label="Người dùng mới"
            value={(today.newUsers ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<PlusCircle className="h-5 w-5 text-violet-600" />}
            iconBg="bg-violet-100"
            label="Cửa hàng mới"
            value={(today.newShops ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<ShoppingCart className="h-5 w-5 text-orange-600" />}
            iconBg="bg-orange-100"
            label="Đơn hàng mới"
            value={(today.newOrders ?? 0).toLocaleString('vi-VN')}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
            label="Doanh thu hôm nay"
            value={formatPrice(today.revenue ?? 0)}
          />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Shops */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-amber-500" />
              Top cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {topShops.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Chưa có dữ liệu</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-2 text-left font-medium text-gray-500">Cửa hàng</th>
                      <th className="py-2 text-right font-medium text-gray-500">Đơn hàng</th>
                      <th className="py-2 text-right font-medium text-gray-500">Doanh thu</th>
                      <th className="py-2 text-right font-medium text-gray-500">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topShops.map((shop, i) => (
                      <tr key={shop._id} className="transition-colors hover:bg-gray-50/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-4 text-xs font-bold text-gray-400">{i + 1}</span>
                            <span className="max-w-[140px] truncate font-medium text-gray-900">
                              {shop.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-gray-700">
                          {(shop.orders ?? 0).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 text-right text-gray-700">
                          {formatPrice(shop.revenue ?? 0)}
                        </td>
                        <td className="py-3 text-right">
                          <span className="flex items-center justify-end gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            {(shop.rating ?? 0).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-stone-500" />
              Đơn hàng gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-gray-500">#{order.orderNumber ?? '—'}</p>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {order.user?.name ?? 'Không rõ'}
                      </p>
                      <p className="truncate text-xs text-gray-400">{order.shop?.name ?? '—'}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(order.amount ?? 0)}
                      </p>
                      <Badge
                        variant={STATUS_BADGE[order.status] ?? 'default'}
                        size="sm"
                        className="mt-1"
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </Badge>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
