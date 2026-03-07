'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { AppImage } from '@/components/ui/app-image';
import {
  AlertCircle,
  CalendarDays,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Plus,
  Brain,
  Store,
  Package,
  Gift,
  Heart,
  GraduationCap,
  PartyPopper,
  Calendar,
  Flower2,
  Star,
} from 'lucide-react';

import { useRequireAuth } from '@/hooks/use-require-auth';
import { useAuthStore } from '@/lib/store';
import { useProfile, useResendVerification } from '@/hooks/use-profile';
import { useUpcomingEvents, type EventType, type Event } from '@/hooks/use-events';
import { useOrders, type OrderStatus, type Order } from '@/hooks/use-orders';
import {
  usePersonalizedRecommendations,
  type RecommendedProduct,
} from '@/hooks/use-recommendations';
import { useRelationships } from '@/hooks/use-relationships';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Spinner,
  Avatar,
  Button,
} from '@/components/ui';
import { Container } from '@/components/layout';
import { formatPrice, formatDate } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
  if (hour >= 12 && hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Config ───────────────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; icon: React.ReactNode }> = {
  birthday: {
    label: 'Sinh nhật',
    icon: <Gift className="h-4 w-4" />,
  },
  anniversary: {
    label: 'Kỷ niệm',
    icon: <Heart className="h-4 w-4" />,
  },
  holiday: {
    label: 'Ngày lễ',
    icon: <PartyPopper className="h-4 w-4" />,
  },
  graduation: {
    label: 'Tốt nghiệp',
    icon: <GraduationCap className="h-4 w-4" />,
  },
  wedding: {
    label: 'Đám cưới',
    icon: <Heart className="h-4 w-4" />,
  },
  custom: {
    label: 'Sự kiện',
    icon: <Calendar className="h-4 w-4" />,
  },
};

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

function CountdownBadge({ days }: { days: number }) {
  if (days < 0)
    return (
      <Badge variant="default" size="sm">
        Đã qua
      </Badge>
    );
  if (days === 0)
    return (
      <Badge variant="success" size="sm">
        Hôm nay
      </Badge>
    );
  if (days === 1)
    return (
      <Badge variant="warning" size="sm">
        Ngày mai
      </Badge>
    );
  if (days <= 7)
    return (
      <Badge variant="warning" size="sm">
        Còn {days} ngày
      </Badge>
    );
  return (
    <Badge variant="default" size="sm">
      Còn {days} ngày
    </Badge>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href}>
      <div className="card-base card-hover cursor-pointer p-6">
        <p className="text-text-primary text-3xl font-bold">{value}</p>
        <p className="body-sm text-text-secondary mt-1">{label}</p>
      </div>
    </Link>
  );
}

function EventRow({ event }: { event: Event }) {
  const config = EVENT_TYPE_CONFIG[event.type] ?? EVENT_TYPE_CONFIG.custom;
  const days = getDaysUntil(event.date);
  const relName = typeof event.relationshipId === 'object' ? event.relationshipId.name : null;

  return (
    <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-stone-50">
      <div className="text-text-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100">
        {config.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-text-primary truncate text-sm font-medium">{event.title}</p>
        <p className="text-text-tertiary text-xs">
          {relName && <span className="text-text-secondary">{relName} · </span>}
          {formatDate(event.date)}
        </p>
      </div>
      <CountdownBadge days={days} />
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const status = order.status as OrderStatus;
  return (
    <Link
      href={`/orders/${order._id}`}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-stone-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100">
        <Package className="text-text-secondary h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-text-primary text-sm font-medium">#{order.orderNumber}</p>
        <p className="text-text-tertiary truncate text-xs">{order.shopId.name}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={ORDER_STATUS_BADGE[status] ?? 'default'} size="sm">
          {ORDER_STATUS_LABELS[status] ?? status}
        </Badge>
        <span className="text-primary-600 text-xs font-semibold">
          {formatPrice(order.pricing.totalAmount)}
        </span>
      </div>
    </Link>
  );
}

function ProductCard({ product }: { product: RecommendedProduct }) {
  const imageUrl = product.images?.[0]?.url;
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined && product.salePrice < product.price;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card-base card-hover cursor-pointer overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-stone-50">
          <AppImage
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              Giảm giá
            </span>
          )}
          {product.matchScore !== undefined && product.matchScore >= 80 && (
            <span className="bg-primary-600 absolute top-2 right-2 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold text-white">
              <Star className="h-3 w-3 fill-white" />
              {product.matchScore}%
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-text-primary mb-1 line-clamp-2 text-sm leading-snug font-medium">
            {product.name}
          </p>
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-primary-600 font-bold">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-text-tertiary text-xs line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.shopId && (
            <p className="text-text-tertiary mt-0.5 truncate text-xs">{product.shopId.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const storeUser = useAuthStore((s) => s.user);

  const { data: profile } = useProfile();
  const resendMutation = useResendVerification();
  const { data: upcomingEvents, isLoading: eventsLoading } = useUpcomingEvents(90);
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });
  const { data: recommendations, isLoading: recsLoading } = usePersonalizedRecommendations(
    6,
    'all'
  );
  const { data: relationshipsData } = useRelationships({ limit: 1 });

  // Resolved display values
  const displayName = profile?.name ?? storeUser?.name ?? 'bạn';
  const avatarSrc = profile?.avatar ?? storeUser?.avatar?.url ?? null;

  // Sliced data for dashboard previews
  const events = (upcomingEvents ?? []).slice(0, 5);
  const orders = ordersData?.orders.slice(0, 5) ?? [];
  const recs = (recommendations ?? []).slice(0, 6);

  // Stat counts
  const totalOrders = ordersData?.pagination?.total ?? 0;
  const totalRelationships = relationshipsData?.pagination?.total ?? 0;
  const upcomingEventsCount = upcomingEvents?.length ?? 0;

  const greeting = getTimeGreeting();

  // ── Auth loading gate ──
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* ── Email Verification Banner ───────────────────────────────────────── */}
      {profile && !profile.emailVerified && (
        <div className="border-b border-yellow-200 bg-yellow-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Email chưa được xác thực</p>
                  <p className="text-xs text-yellow-600">
                    Vui lòng kiểm tra email và xác thực tài khoản
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resendMutation.mutate(undefined, {
                    onSuccess: () => toast.success('Đã gửi lại email xác thực'),
                    onError: (err) =>
                      toast.error(err instanceof Error ? err.message : 'Gửi email thất bại'),
                  });
                }}
                disabled={resendMutation.isPending}
                className="shrink-0 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600 disabled:opacity-50"
              >
                {resendMutation.isPending ? 'Đang gửi...' : 'Gửi lại email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="border-border bg-surface-elevated border-b">
        <Container className="py-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Avatar + greeting */}
            <div className="flex items-center gap-4">
              <Avatar
                src={avatarSrc}
                name={displayName}
                size="xl"
                className="ring-border shadow-sm ring-2"
              />
              <div>
                <p className="body-sm text-text-secondary">{greeting},</p>
                <h1 className="heading-lg text-text-primary">{displayName}</h1>
                <p className="body-sm text-text-tertiary mt-1">
                  Flowery đồng hành cùng mọi khoảnh khắc của bạn
                </p>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex flex-wrap gap-2">
              <Link href="/flowers">
                <Button variant="outline" size="sm" leftIcon={<Flower2 className="h-4 w-4" />}>
                  Đặt hoa
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline" size="sm" leftIcon={<Brain className="h-4 w-4" />}>
                  Làm quiz
                </Button>
              </Link>
              <Link href="/shops">
                <Button variant="outline" size="sm" leftIcon={<Store className="h-4 w-4" />}>
                  Xem shop
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-8 space-y-8">
        {/* ── Quick Stats ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Tổng đơn hàng" value={totalOrders} href="/orders" />
          <StatCard label="Mối quan hệ" value={totalRelationships} href="/relationships" />
          <StatCard label="Sự kiện sắp tới" value={upcomingEventsCount} href="/events" />
        </div>

        {/* ── Upcoming Events + Recent Orders ────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Upcoming Events */}
          <Card className="card-base">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="text-primary-500 h-4 w-4" />
                Sự kiện sắp tới
              </CardTitle>
              <Link
                href="/events"
                className="text-primary-600 hover:text-primary-700 flex items-center gap-0.5 text-sm font-medium"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>

            <CardContent className="p-3">
              {eventsLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="sm" label="Đang tải..." />
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
                    <CalendarDays className="h-6 w-6 text-stone-300" />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-medium">Chưa có sự kiện nào</p>
                    <p className="text-text-tertiary mt-1 text-xs">
                      Thêm sinh nhật, kỷ niệm để nhận nhắc nhở kịp thời
                    </p>
                  </div>
                  <Link href="/events/new">
                    <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                      Thêm sự kiện
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-50">
                  {events.map((event) => (
                    <Link key={event._id} href={`/events/${event._id}`}>
                      <EventRow event={event} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="card-base">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="text-primary-500 h-4 w-4" />
                Đơn hàng gần đây
              </CardTitle>
              <Link
                href="/orders"
                className="text-primary-600 hover:text-primary-700 flex items-center gap-0.5 text-sm font-medium"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>

            <CardContent className="p-3">
              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="sm" label="Đang tải..." />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
                    <ShoppingBag className="h-6 w-6 text-stone-300" />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-medium">Chưa có đơn hàng nào</p>
                    <p className="text-text-tertiary mt-1 text-xs">
                      Hãy khám phá những bó hoa tươi đẹp nhất!
                    </p>
                  </div>
                  <Link href="/flowers">
                    <Button size="sm" leftIcon={<Flower2 className="h-4 w-4" />}>
                      Khám phá hoa
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-50">
                  {orders.map((order) => (
                    <OrderRow key={order._id} order={order} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Personalized Recommendations ────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="heading-sm text-text-primary flex items-center gap-2">
                <Sparkles className="text-primary-500 h-4 w-4" />
                Gợi ý dành cho bạn
              </h2>
              <p className="body-sm text-text-secondary mt-0.5">
                Được cá nhân hóa dựa trên sở thích và lịch sử của bạn
              </p>
            </div>
            <Link
              href="/flowers"
              className="text-primary-600 hover:text-primary-700 mt-1 flex shrink-0 items-center gap-0.5 text-sm font-medium"
            >
              Xem thêm
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {recsLoading ? (
            <div className="flex justify-center py-14">
              <Spinner size="lg" label="Đang tải gợi ý..." />
            </div>
          ) : recs.length === 0 ? (
            <div className="card-base p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <Sparkles className="h-7 w-7 text-stone-400" />
              </div>
              <p className="text-text-primary font-medium">Chưa có gợi ý nào</p>
              <p className="body-sm text-text-secondary mt-1">
                Làm quiz để nhận gợi ý hoa phù hợp nhất với bạn
              </p>
              <Link href="/quiz" className="mt-4 inline-block">
                <Button leftIcon={<Brain className="h-4 w-4" />}>Làm quiz ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recs.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
