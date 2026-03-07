'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, CheckCircle } from 'lucide-react';
import { useShopOrders } from '@/hooks/use-shop-management';
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/hooks/use-orders';

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày' },
  { value: '30days', label: '30 ngày' },
  { value: 'all', label: 'Tất cả' },
] as const;

type Period = (typeof PERIOD_OPTIONS)[number]['value'];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-400',
  preparing: 'bg-rose-400',
  delivering: 'bg-purple-400',
  delivered: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  refunded: 'bg-gray-400',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterByPeriod(orders: Order[], period: Period): Order[] {
  if (period === 'all') return orders;

  const now = new Date();
  const cutoff = new Date();

  if (period === 'today') {
    cutoff.setHours(0, 0, 0, 0);
  } else if (period === '7days') {
    cutoff.setDate(now.getDate() - 7);
  } else if (period === '30days') {
    cutoff.setDate(now.getDate() - 30);
  }

  return orders.filter((o) => new Date(o.createdAt) >= cutoff);
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

function StatCard({ icon, iconBg, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold text-gray-900 leading-none truncate">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopRevenuePage() {
  const [period, setPeriod] = useState<Period>('30days');

  const { data, isLoading } = useShopOrders({ limit: 100 });
  const allOrders = data?.orders ?? [];

  const filtered = useMemo(() => filterByPeriod(allOrders, period), [allOrders, period]);

  // ── Summary stats
  const stats = useMemo(() => {
    const delivered = filtered.filter((o) => o.status === 'delivered');
    const totalRevenue = delivered.reduce((s, o) => s + o.pricing.totalAmount, 0);
    const avgValue = delivered.length > 0 ? totalRevenue / delivered.length : 0;

    return {
      totalRevenue,
      totalOrders: filtered.length,
      avgValue,
      completedOrders: delivered.length,
    };
  }, [filtered]);

  // ── Status breakdown
  const statusBreakdown = useMemo(() => {
    const map = new Map<OrderStatus, { count: number; total: number }>();
    for (const order of filtered) {
      const s = order.status as OrderStatus;
      const prev = map.get(s) ?? { count: 0, total: 0 };
      map.set(s, { count: prev.count + 1, total: prev.total + order.pricing.totalAmount });
    }
    return Array.from(map.entries())
      .map(([status, data]) => ({ status, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // ── Recent delivered orders
  const recentDelivered = useMemo(
    () =>
      filtered
        .filter((o) => o.status === 'delivered')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [filtered],
  );

  return (
    <div className="space-y-6">
      {/* ── Period filter — underline style ───────────────────────────── */}
      <div className="flex gap-0 border-b border-stone-200 w-fit">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
              period === opt.value
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {/* ── Summary cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
              iconBg="bg-rose-50"
              label="Tổng doanh thu"
              value={formatPrice(stats.totalRevenue)}
            />
            <StatCard
              icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
              iconBg="bg-blue-50"
              label="Số đơn hàng"
              value={String(stats.totalOrders)}
            />
            <StatCard
              icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
              label="Giá trị TB / đơn"
              value={formatPrice(stats.avgValue)}
            />
            <StatCard
              icon={<CheckCircle className="h-5 w-5 text-violet-600" />}
              iconBg="bg-violet-50"
              label="Đơn hoàn thành"
              value={String(stats.completedOrders)}
            />
          </div>

          {/* ── Status breakdown ─────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Phân bổ trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {statusBreakdown.length === 0 ? (
                <p className="px-6 py-6 text-sm text-gray-400 text-center">
                  Không có dữ liệu
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Số đơn
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Tổng tiền
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Tỉ lệ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {statusBreakdown.map(({ status, count, total }) => {
                      const pct =
                        filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
                      return (
                        <tr key={status} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'h-2.5 w-2.5 rounded-full',
                                  STATUS_COLORS[status] ?? 'bg-gray-300',
                                )}
                              />
                              <span className="font-medium text-gray-700">
                                {ORDER_STATUS_LABELS[status] ?? status}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                            {count}
                          </td>
                          <td className="px-5 py-3.5 text-right text-gray-600">
                            {formatPrice(total)}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    STATUS_COLORS[status] ?? 'bg-gray-300',
                                  )}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-8">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* ── Recent delivered orders ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Đơn hàng đã giao gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentDelivered.length === 0 ? (
                <p className="px-6 py-6 text-sm text-gray-400 text-center">
                  Chưa có đơn hàng hoàn thành trong kỳ này
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Mã đơn
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Ngày giao
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Món hàng
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentDelivered.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-600">
                          {order.items.length} món
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                          {formatPrice(order.pricing.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
