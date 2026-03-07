'use client';

import { TrendingUp, TrendingDown, Star, Users, Store, ShoppingBag } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Spinner,
} from '@/components/ui';
import { useAdminStats } from '@/hooks/use-admin';
import { formatPrice, cn } from '@/lib/utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function GrowthIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-emerald-600' : 'text-red-500',
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {Math.abs(value)}%
    </span>
  );
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className={cn('h-2 rounded-full transition-all', color)}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const { data: statsRes, isLoading, isError } = useAdminStats();
  const stats = statsRes?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" label="Đang tải dữ liệu phân tích..." />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Không thể tải dữ liệu phân tích.</p>
      </div>
    );
  }

  const { overview, today, topShops, recentOrders } = stats;

  // Calculate revenue growth (today vs average from overview)
  const avgDailyRevenue =
    overview.totalOrders > 0 ? overview.totalRevenue / Math.max(1, overview.totalOrders) : 0;
  const revenueGrowthPct =
    avgDailyRevenue > 0
      ? Math.round(((today.revenue - avgDailyRevenue) / avgDailyRevenue) * 100)
      : 0;

  // Orders by status breakdown from recentOrders
  const orderStatusCounts: Record<string, number> = {};
  for (const o of recentOrders) {
    orderStatusCounts[o.status] = (orderStatusCounts[o.status] ?? 0) + 1;
  }
  const totalRecentOrders = recentOrders.length;

  const ORDER_STATUSES = [
    { key: 'pending', label: 'Chờ xác nhận', color: 'bg-amber-400' },
    { key: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-400' },
    { key: 'preparing', label: 'Đang chuẩn bị', color: 'bg-violet-400' },
    { key: 'delivering', label: 'Đang giao', color: 'bg-indigo-400' },
    { key: 'delivered', label: 'Đã giao', color: 'bg-emerald-400' },
    { key: 'cancelled', label: 'Đã hủy', color: 'bg-red-400' },
    { key: 'refunded', label: 'Hoàn tiền', color: 'bg-gray-400' },
  ];

  // Users by role — estimated from overview
                    const roleData = [
    {
      label: 'Người dùng',
      value: Math.max(0, overview.totalUsers - overview.totalShops),
      color: 'bg-stone-400',
    },
    { label: 'Chủ shop', value: overview.totalShops, color: 'bg-emerald-400' },
    { label: 'Admin', value: 1, color: 'bg-red-400' },
  ];
  const totalRoleUsers = roleData.reduce((s, r) => s + r.value, 0);

  return (
    <div className="space-y-6">
      {/* Revenue overview */}
      <div>
        <h2 className="label-text mb-3">
          Doanh thu
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatPrice(overview.totalRevenue)}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                  <TrendingUp className="h-5 w-5 text-stone-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Doanh thu hôm nay</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatPrice(today.revenue)}
                  </p>
                  <div className="mt-1">
                    <GrowthIndicator value={revenueGrowthPct} />
                    <span className="ml-1 text-xs text-gray-400">so với trung bình</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {overview.totalOrders.toLocaleString('vi-VN')}
                  </p>
                  <div className="mt-1">
                    <GrowthIndicator value={today.newOrders} />
                    <span className="ml-1 text-xs text-gray-400">đơn mới hôm nay</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <ShoppingBag className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Breakdown tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders by status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-4 w-4 text-stone-500" />
              Đơn hàng theo trạng thái
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">
              Dựa trên {totalRecentOrders} đơn hàng gần đây
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {ORDER_STATUSES.map(({ key, label, color }) => {
              const count = orderStatusCounts[key] ?? 0;
              const pct = totalRecentOrders > 0 ? Math.round((count / totalRecentOrders) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <ProgressBar percent={pct} color={color} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Users by role */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-stone-500" />
              Người dùng theo vai trò
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">
              Tổng {overview.totalUsers.toLocaleString('vi-VN')} người dùng
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            {roleData.map(({ label, value, color }) => {
              const pct = totalRoleUsers > 0 ? Math.round((value / totalRoleUsers) * 100) : 0;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-500">
                      {value.toLocaleString('vi-VN')} ({pct}%)
                    </span>
                  </div>
                  <ProgressBar percent={pct} color={color} />
                </div>
              );
            })}

            <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Người dùng mới hôm nay</span>
                <span className="font-semibold text-stone-700">
                  +{today.newUsers.toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Cửa hàng mới hôm nay</span>
                <span className="font-semibold text-emerald-600">
                  +{today.newShops.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top performing shops */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4 text-stone-500" />
            Top cửa hàng hoạt động tốt nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {topShops.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topShops.map((shop, i) => {
                const maxRevenue = topShops[0]?.revenue ?? 1;
                const pct = Math.round((shop.revenue / maxRevenue) * 100);
                return (
                  <div key={shop._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                            i === 0
                              ? 'bg-amber-400'
                              : i === 1
                                ? 'bg-stone-400'
                                : i === 2
                                  ? 'bg-orange-400'
                                  : 'bg-stone-200 text-stone-700',
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="font-medium text-gray-900 truncate max-w-[160px]">
                          {shop.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="flex items-center gap-1 text-amber-500 text-xs">
                          <Star className="h-3 w-3 fill-current" />
                          {shop.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {shop.orders} đơn
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(shop.revenue)}
                        </span>
                      </div>
                    </div>
                    <ProgressBar percent={pct} color="bg-stone-400" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
