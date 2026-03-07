'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Calendar,
  Gift,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Star,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useOrder, useCancelOrder, type OrderStatus, type PaymentMethod, type Order } from '@/hooks/use-orders';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { Badge, Button, Spinner, Modal, Textarea, Card, CardHeader, CardContent, CardFooter } from '@/components/ui';
import { Container } from '@/components/layout';
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

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng',
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  bank_transfer: 'Chuyển khoản ngân hàng',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
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

// Status progression for timeline stepper
const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'delivering',
  'delivered',
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <Package className="h-4 w-4" />,
  preparing: <Package className="h-4 w-4" />,
  delivering: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  refunded: <RotateCcw className="h-4 w-4" />,
};

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cod: <Banknote className="h-4 w-4" />,
  vnpay: <CreditCard className="h-4 w-4" />,
  momo: <Smartphone className="h-4 w-4" />,
  zalopay: <Smartphone className="h-4 w-4" />,
  bank_transfer: <Building2 className="h-4 w-4" />,
};

// ─── Timeline stepper ─────────────────────────────────────────────────────────

function OrderTimeline({ order }: { order: Order }) {
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const currentIndex = STATUS_FLOW.indexOf(order.status as OrderStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-red-700">
            {order.status === 'refunded' ? 'Đã hoàn tiền' : 'Đơn hàng đã hủy'}
          </p>
          {order.cancelReason && (
            <p className="mt-0.5 text-sm text-red-600">Lý do: {order.cancelReason}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      {STATUS_FLOW.map((status, idx) => {
        const isDone = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        const isLast = idx === STATUS_FLOW.length - 1;

        // Find history entry for this status
        const historyEntry = order.statusHistory.find((h) => h.status === status);

        return (
          <div key={status} className="flex flex-1 flex-col items-center">
            {/* Dot + connector */}
            <div className="flex w-full items-center">
              {/* Left line */}
              {idx > 0 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    isDone ? 'bg-primary-400' : 'bg-gray-200',
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isCurrent
                    ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-200'
                    : isDone
                    ? 'border-primary-400 bg-primary-400 text-white'
                    : 'border-gray-200 bg-white text-gray-300',
                )}
              >
                {STATUS_ICONS[status]}
              </div>

              {/* Right line */}
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    idx < currentIndex ? 'bg-primary-400' : 'bg-gray-200',
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="mt-2 px-1 text-center">
              <p
                className={cn(
                  'text-xs font-medium',
                  isCurrent
                    ? 'text-primary-700'
                    : isDone
                    ? 'text-gray-700'
                    : 'text-gray-400',
                )}
              >
                {STATUS_LABELS[status]}
              </p>
              {historyEntry && (
                <p className="mt-0.5 text-[10px] text-gray-400 hidden sm:block">
                  {formatDate(historyEntry.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ─── Cancel modal ─────────────────────────────────────────────────────────────

function CancelModal({
  orderId,
  isOpen,
  onClose,
}: {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const cancelOrder = useCancelOrder();

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    setError('');
    try {
      await cancelOrder.mutateAsync({ id: orderId, reason: reason.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hủy đơn thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hủy đơn hàng"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này.
        </p>

        <Textarea
          label="Lý do hủy"
          placeholder="VD: Tôi muốn thay đổi địa chỉ giao hàng..."
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={error}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose} disabled={cancelOrder.isPending}>
            Quay lại
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            isLoading={cancelOrder.isPending}
          >
            Xác nhận hủy
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { isLoading: authLoading } = useRequireAuth();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: order, isLoading, isError } = useOrder(id);

  if (authLoading || isLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải đơn hàng..." />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="font-semibold text-red-700">Không tìm thấy đơn hàng</h2>
          <p className="mt-1 text-sm text-red-600">Đơn hàng không tồn tại hoặc bạn không có quyền xem.</p>
          <Link
            href="/orders"
            className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
          >
            Quay lại đơn hàng
          </Link>
        </div>
      </Container>
    );
  }

  const status = order.status as OrderStatus;
  const canCancel = order.status === 'pending';
  const canReview = order.status === 'delivered';

  const { deliveryAddress: addr, pricing } = order;
  const fullAddress = [addr.street, addr.ward, addr.district, addr.city]
    .filter(Boolean)
    .join(', ');

  return (
    <Container className="py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/orders" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Đơn hàng
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">#{order.orderNumber}</span>
      </nav>

      {/* Status hero */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">#{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Đặt lúc {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={STATUS_BADGE[status]} size="md" className="text-sm px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            {STATUS_ICONS[status]}
            {STATUS_LABELS[status]}
          </span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <p className="font-semibold text-gray-900">Trạng thái đơn hàng</p>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />

              {/* Status history */}
              {order.statusHistory.length > 0 && (
                <div className="mt-6 space-y-3 border-t border-gray-50 pt-5">
                  <p className="text-sm font-medium text-gray-700">Lịch sử trạng thái</p>
                  <div className="space-y-2">
                    {[...order.statusHistory].reverse().map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-700">
                            {STATUS_LABELS[entry.status as OrderStatus] ?? entry.status}
                          </span>
                          {entry.note && (
                            <span className="ml-2 text-gray-500">— {entry.note}</span>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary-500" />
                <span className="font-semibold text-gray-900">
                  Sản phẩm ({order.items.length})
                </span>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-gray-50 p-0">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 px-6 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <Package className="h-5 w-5 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {item.productName}
                    </p>
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(item.customizations).map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span className="font-semibold text-gray-900">Thông tin giao hàng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow
                label="Người nhận"
                value={
                  <span className="flex items-center gap-1.5">
                    {order.isAnonymous && (
                      <Badge variant="default" size="sm">Ẩn danh</Badge>
                    )}
                    {addr.recipientName}
                  </span>
                }
              />
              <InfoRow
                label="Số điện thoại"
                value={
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {addr.recipientPhone}
                  </span>
                }
              />
              <InfoRow label="Địa chỉ" value={fullAddress} />
              <InfoRow
                label="Ngày giao"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {formatDate(order.deliveryDate)}
                  </span>
                }
              />

              {order.giftMessage && (
                <div className="mt-2 rounded-lg bg-pink-50 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-pink-600">
                    <Gift className="h-3.5 w-3.5" />
                    Lời nhắn tặng hoa
                  </div>
                  <p className="text-sm text-gray-700 italic">"{order.giftMessage}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <span className="font-semibold text-gray-900">Chi tiết thanh toán</span>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Tạm tính" value={formatPrice(pricing.subtotal)} />
              <InfoRow label="Phí giao hàng" value={formatPrice(pricing.deliveryFee)} />
              {pricing.discount > 0 && (
                <InfoRow
                  label={`Giảm giá${pricing.couponCode ? ` (${pricing.couponCode})` : ''}`}
                  value={<span className="text-accent-600">−{formatPrice(pricing.discount)}</span>}
                />
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(pricing.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Payment method */}
            <CardFooter className="flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {PAYMENT_ICONS[order.paymentMethod]}
                <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Thanh toán:</span>
                <Badge
                  variant={
                    order.paymentStatus === 'paid'
                      ? 'success'
                      : order.paymentStatus === 'failed'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                </Badge>
              </div>
            </CardFooter>
          </Card>

          {/* Shop info */}
          <Card>
            <CardHeader>
              <span className="font-semibold text-gray-900">Thông tin cửa hàng</span>
            </CardHeader>
            <CardContent>
              <Link
                href={`/shops/${order.shopId.slug}`}
                className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-primary-50"
              >
                <span className="font-medium text-gray-900">{order.shopId.name}</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Actions */}
          {(canCancel || canReview) && (
            <div className="space-y-3">
              {canCancel && (
                <Button
                  variant="danger"
                  className="w-full"
                  leftIcon={<XCircle className="h-4 w-4" />}
                  onClick={() => setCancelOpen(true)}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {canReview && (
                <Link href={`/reviews/new?orderId=${order._id}`}>
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<Star className="h-4 w-4" />}
                  >
                    Đánh giá đơn hàng
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelModal
        orderId={id}
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
    </Container>
  );
}
