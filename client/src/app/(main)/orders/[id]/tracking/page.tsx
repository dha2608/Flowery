'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  CheckCircle,
  Circle,
  Clock,
  Package,
  Truck,
  XCircle,
  RotateCcw,
  MapPin,
  Phone,
  Calendar,
  Gift,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks';
import { useOrder, useOrderTracking, type OrderStatus } from '@/hooks/use-orders';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Spinner } from '@/components/ui';
import { Container } from '@/components/layout';
import { cn } from '@/lib/utils';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  delivering: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

const STATUS_BADGE_VARIANT: Record<string, 'warning' | 'info' | 'primary' | 'default' | 'success' | 'danger'> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'primary',
  delivering: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'default',
};

// The normal delivery flow (linear progression)
const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'delivering',
  'delivered',
];

const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: 'Đơn hàng đang chờ shop xác nhận',
  confirmed: 'Shop đã xác nhận đơn hàng của bạn',
  preparing: 'Shop đang chuẩn bị hoa cho bạn',
  delivering: 'Đơn hàng đang trên đường giao đến bạn',
  delivered: 'Đơn hàng đã được giao thành công',
  cancelled: 'Đơn hàng đã bị hủy',
  refunded: 'Tiền đã được hoàn về tài khoản của bạn',
};

// ─── Timeline step icons ───────────────────────────────────────────────────────

function StepIcon({ status, state }: { status: string; state: 'done' | 'current' | 'upcoming' }) {
  const iconClass = cn(
    'h-4 w-4 transition-colors',
    state === 'done' && 'text-white',
    state === 'current' && 'text-white',
    state === 'upcoming' && 'text-stone-300',
  );

  if (state === 'done') return <CheckCircle className={iconClass} />;

  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className={iconClass} />,
    confirmed: <Package className={iconClass} />,
    preparing: <Package className={iconClass} />,
    delivering: <Truck className={iconClass} />,
    delivered: <CheckCircle className={iconClass} />,
  };

  return (icons[status] as React.ReactElement) ?? <Circle className={iconClass} />;
}

// ─── Vertical Timeline ────────────────────────────────────────────────────────

interface TimelineProps {
  orderStatus: OrderStatus;
  trackingEvents: Array<{ status: string; timestamp: string; note?: string }>;
  cancelReason?: string;
}

function VerticalTimeline({ orderStatus, trackingEvents, cancelReason }: TimelineProps) {
  const isCancelled = orderStatus === 'cancelled' || orderStatus === 'refunded';
  const currentFlowIndex = STATUS_FLOW.indexOf(orderStatus);

  // Build a map for quick lookup of tracking events by status
  const eventByStatus = new Map(trackingEvents.map((e) => [e.status, e]));

  // The statuses we show depend on whether order is cancelled
  const visibleSteps: OrderStatus[] = isCancelled
    ? STATUS_FLOW.slice(0, Math.max(currentFlowIndex, 0) + 1)
    : STATUS_FLOW;

  return (
    <div className="relative">
      {visibleSteps.map((status, idx) => {
        const isLast = idx === visibleSteps.length - 1;
        const isDone = STATUS_FLOW.indexOf(status) < currentFlowIndex ||
          (status === orderStatus && orderStatus === 'delivered');
        const isCurrent = status === orderStatus && !isCancelled;
        const state: 'done' | 'current' | 'upcoming' = isDone
          ? 'done'
          : isCurrent
          ? 'current'
          : 'upcoming';

        const event = eventByStatus.get(status);

        return (
          <div key={status} className="flex gap-4">
            {/* Dot + vertical line column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  state === 'done' &&
                    'border-primary-500 bg-primary-500',
                  state === 'current' &&
                    'border-primary-500 bg-primary-500 shadow-md shadow-primary-100 ring-4 ring-primary-50',
                  state === 'upcoming' &&
                    'border-border bg-surface-elevated',
                )}
              >
                {/* Pulse ring for current step */}
                {state === 'current' && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-20" />
                )}
                <StepIcon status={status} state={state} />
              </div>

              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'mt-1 min-h-[2rem] w-0.5 flex-1 transition-colors duration-300',
                    isDone ? 'bg-primary-300' : 'bg-border',
                  )}
                />
              )}
            </div>

            {/* Content column */}
            <div className={cn('min-w-0 flex-1 pb-6', isLast && 'pb-0')}>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    state === 'current' && 'text-primary-700',
                    state === 'done' && 'text-text-primary',
                    state === 'upcoming' && 'text-text-tertiary',
                  )}
                >
                  {STATUS_LABELS[status]}
                </p>
                {state === 'current' && (
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                    Hiện tại
                  </span>
                )}
              </div>

              <p
                className={cn(
                  'mt-0.5 text-xs',
                  state === 'upcoming' ? 'text-text-tertiary' : 'text-text-secondary',
                )}
              >
                {STATUS_DESCRIPTIONS[status]}
              </p>

              {/* Timestamp + note from tracking event */}
              {event && (
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-xs font-medium text-text-tertiary">
                    {formatDateTime(event.timestamp)}
                  </p>
                  {event.note && (
                    <p className="text-xs italic text-text-secondary">"{event.note}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Cancelled / Refunded terminal step */}
      {isCancelled && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-400 bg-red-400">
              {orderStatus === 'refunded' ? (
                <RotateCcw className="h-4 w-4 text-white" />
              ) : (
                <XCircle className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
          <div className="flex-1 pb-0">
            <p className="text-sm font-semibold text-red-600">
              {STATUS_LABELS[orderStatus]}
            </p>
            <p className="mt-0.5 text-xs text-red-400">
              {STATUS_DESCRIPTIONS[orderStatus]}
            </p>
            {cancelReason && (
              <p className="mt-1 text-xs text-text-secondary">
                Lý do: {cancelReason}
              </p>
            )}
            {(() => {
              const ev = eventByStatus.get(orderStatus);
              return ev ? (
                <p className="mt-1 text-xs font-medium text-text-tertiary">
                  {formatDateTime(ev.timestamp)}
                </p>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading } = useRequireAuth();

  const { data: order, isLoading: orderLoading, isError } = useOrder(id);
  const { data: trackingEvents = [], isLoading: trackingLoading } = useOrderTracking(id);

  const isLoading = authLoading || orderLoading || trackingLoading;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải thông tin vận chuyển..." />
      </Container>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────
  if (isError || !order) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="font-semibold text-red-700">Không tìm thấy đơn hàng</h2>
          <p className="mt-1 text-sm text-red-600">
            Đơn hàng không tồn tại hoặc bạn không có quyền xem.
          </p>
          <Link
            href="/orders"
            className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </Container>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const { deliveryAddress: addr, pricing } = order;
  const fullAddress = [addr.street, addr.ward, addr.district, addr.city]
    .filter(Boolean)
    .join(', ');

  // Merge tracking events with status history (tracking API may return same data)
  // Prefer trackingEvents if available, otherwise fall back to statusHistory
  const events =
    trackingEvents.length > 0 ? trackingEvents : order.statusHistory;

  const badgeVariant = STATUS_BADGE_VARIANT[order.status] ?? 'default';

  return (
    <Container className="py-8 pb-16">
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
        <Link
          href="/orders"
          className="flex items-center gap-1 transition-colors hover:text-primary-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Đơn hàng
        </Link>
        <span className="text-text-tertiary">/</span>
        <Link
          href={`/orders/${id}`}
          className="transition-colors hover:text-primary-600"
        >
          #{order.orderNumber}
        </Link>
        <span className="text-text-tertiary">/</span>
        <span className="font-medium text-text-primary">Theo dõi</span>
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="card-base mb-6 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-text">Mã đơn hàng</p>
            <h1 className="heading-md mt-1 font-mono text-text-primary">
              #{order.orderNumber}
            </h1>
            <p className="body-sm mt-1 text-text-secondary">
              Đặt lúc {formatDateTime(order.createdAt)}
            </p>
            <p className="body-sm text-text-secondary">
              Giao dự kiến: {formatDate(order.deliveryDate)}
            </p>
          </div>
          <Badge variant={badgeVariant} size="md" className="text-xs">
            {STATUS_LABELS[order.status] ?? order.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="heading-sm text-text-primary">
                Trạng thái vận chuyển
              </CardTitle>
              <p className="body-sm text-text-secondary">
                Cập nhật theo thời gian thực về hành trình đơn hàng của bạn
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <VerticalTimeline
                orderStatus={order.status}
                trackingEvents={events}
                cancelReason={order.cancelReason}
              />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="heading-sm text-text-primary">
                Sản phẩm trong đơn ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border-light p-0">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 px-6 py-4">
                  {/* Product icon placeholder */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Package className="h-4 w-4 text-text-tertiary" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-text-primary">
                      {item.productName}
                    </p>

                    {/* Customizations */}
                    {item.customizations &&
                      Object.keys(item.customizations).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(item.customizations).map(([k, v]) => (
                            <span
                              key={k}
                              className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-text-secondary"
                            >
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}

                    <p className="mt-1 text-xs text-text-tertiary">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <span className="shrink-0 text-sm font-semibold text-text-primary">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}

              {/* Pricing summary */}
              <div className="space-y-2 rounded-b-2xl bg-stone-50 px-6 py-4">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Tạm tính</span>
                  <span>{formatPrice(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Phí giao hàng</span>
                  <span>{formatPrice(pricing.deliveryFee)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      Giảm giá
                      {pricing.couponCode && (
                        <span className="ml-1 text-xs text-text-tertiary">
                          ({pricing.couponCode})
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-green-600">
                      −{formatPrice(pricing.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-text-primary">Tổng cộng</span>
                  <span className="font-bold text-primary-600">
                    {formatPrice(pricing.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <Card className="card-base">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <CardTitle className="heading-sm text-text-primary">Thông tin giao hàng</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipient */}
              <div>
                <p className="label-text mb-1">Người nhận</p>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                    {order.isAnonymous && (
                      <Badge variant="default" size="sm">
                        Ẩn danh
                      </Badge>
                    )}
                    {addr.recipientName}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
                    {addr.recipientPhone}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="label-text mb-1">Địa chỉ</p>
                <p className="text-sm leading-relaxed text-text-primary">{fullAddress}</p>
              </div>

              {/* Expected delivery */}
              <div>
                <p className="label-text mb-1">Ngày giao dự kiến</p>
                <p className="flex items-center gap-1.5 text-sm text-text-primary">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
                  {formatDate(order.deliveryDate)}
                </p>
              </div>

              {/* Gift message */}
              {order.giftMessage && (
                <div className="rounded-xl border border-border bg-stone-50 p-3">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-text-tertiary" />
                    <span className="label-text">Lời nhắn tặng hoa</span>
                  </div>
                  <p className="text-sm italic leading-relaxed text-text-primary">
                    "{order.giftMessage}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Link href={`/orders/${id}`} className="block">
              <Button
                variant="outline"
                className="btn-secondary w-full"
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Quay lại đơn hàng
              </Button>
            </Link>

            <Link
              href={`/shops/${(order.shopId as { slug: string }).slug}`}
              className="block"
            >
              <Button
                variant="ghost"
                className="w-full text-text-primary"
                leftIcon={<MessageCircle className="h-4 w-4" />}
              >
                Liên hệ shop
              </Button>
            </Link>
          </div>

          {/* Shop info card */}
          <div className="card-base overflow-hidden">
            <div className="px-5 py-4">
              <p className="label-text mb-2">Cửa hàng</p>
              <Link
                href={`/shops/${(order.shopId as { slug: string }).slug}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary-200 hover:bg-primary-50"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100">
                    <Package className="h-4 w-4 text-text-secondary" />
                  </div>
                  <span className="truncate text-sm font-medium text-text-primary">
                    {order.shopId.name}
                  </span>
                </div>
                <ChevronLeft className="h-4 w-4 shrink-0 rotate-180 text-text-tertiary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
