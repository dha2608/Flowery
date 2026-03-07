'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  MapPin,
  Phone,
  Calendar,
  Package,
  ShoppingBag,
  ClipboardList,
  AlertCircle,
  Gift,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useOrder, type PaymentMethod } from '@/hooks/use-orders';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  Spinner,
  FlowerCareTips,
} from '@/components/ui';
import { Container } from '@/components/layout';

// ─── Config ───────────────────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng',
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  bank_transfer: 'Chuyển khoản ngân hàng',
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="text-primary-400 mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="label-text">{label}</p>
        <div className="text-text-primary mt-0.5 font-medium">{value}</div>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  bold,
  accent,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={cn('flex justify-between gap-3 text-sm', bold && 'text-base font-semibold')}>
      <span className={bold ? 'text-text-primary' : 'text-text-secondary'}>{label}</span>
      <span className={cn(bold && 'text-text-primary', accent && 'text-primary-600')}>{value}</span>
    </div>
  );
}

// ─── Inner page content (requires useSearchParams) ────────────────────────────

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { isLoading: authLoading } = useRequireAuth();
  const { data: order, isLoading, isError } = useOrder(orderId ?? '');

  // Clear cart on mount — idempotent, safe to call even if already cleared
  useEffect(() => {
    if (orderId) {
      useCartStore.getState().clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (authLoading || isLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải thông tin đơn hàng..." />
      </Container>
    );
  }

  // ── No orderId ───────────────────────────────────────────────────────────────
  if (!orderId) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="text-lg font-semibold text-red-700">Không tìm thấy đơn hàng</h2>
          <p className="mt-1.5 text-sm text-red-600">
            Liên kết không hợp lệ. Vui lòng kiểm tra lại trong mục đơn hàng của bạn.
          </p>
          <Link
            href="/orders"
            className="mt-5 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Xem tất cả đơn hàng
          </Link>
        </div>
      </Container>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (isError || !order) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-amber-100 bg-amber-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-400" />
          <h2 className="text-lg font-semibold text-amber-700">Không thể hiển thị chi tiết</h2>
          <p className="mt-1.5 text-sm text-amber-600">
            Đơn hàng của bạn đã được đặt thành công, nhưng chúng tôi không thể tải chi tiết ngay lúc
            này. Bạn có thể xem lại trong mục đơn hàng.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/orders">
              <Button variant="primary" size="sm">
                Xem đơn hàng
              </Button>
            </Link>
            <Link href="/flowers">
              <Button variant="outline" size="sm">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────────
  const { deliveryAddress: addr, pricing } = order;
  const fullAddress = [addr.street, addr.ward, addr.district, addr.city].filter(Boolean).join(', ');

  return (
    <Container className="py-10 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* ── Success header ───────────────────────────────────────────────── */}
        <div className="border-border bg-surface-elevated mb-8 rounded-2xl border px-6 py-12 text-center">
          {/* Checkmark */}
          <div className="bg-primary-50 ring-primary-50 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-4">
            <CheckCircle className="text-primary-600 h-9 w-9" strokeWidth={1.75} />
          </div>

          {/* Heading */}
          <h1 className="heading-lg text-text-primary">Đặt hàng thành công</h1>
          <p className="body-base text-text-secondary mt-2">
            Cảm ơn bạn đã tin tưởng Flowery. Đơn hàng của bạn đang được xử lý.
          </p>

          {/* Order number pill */}
          <div className="border-border bg-surface mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-2">
            <Package className="text-primary-500 h-4 w-4" />
            <span className="text-text-secondary text-sm">Mã đơn hàng</span>
            <span className="text-text-primary font-bold">#{order.orderNumber}</span>
          </div>
        </div>

        {/* ── Content cards ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Order items + pricing */}
          <Card className="card-base">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="text-primary-500 h-4 w-4" />
                  <span className="heading-sm text-text-primary">
                    Sản phẩm ({order.items.length})
                  </span>
                </div>
                <Badge variant="success" size="sm">
                  Đã đặt hàng
                </Badge>
              </div>
            </CardHeader>

            {/* Item list */}
            <CardContent className="divide-border-light divide-y p-0">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 px-6 py-3.5">
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                    <Package className="text-text-tertiary h-4 w-4" />
                  </div>

                  {/* Name + customisations */}
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary line-clamp-2 text-sm font-medium">
                      {item.productName}
                    </p>
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(item.customizations).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-text-secondary rounded-full bg-stone-100 px-2 py-0.5 text-xs"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-text-primary text-sm font-semibold">
                      {formatPrice(item.subtotal)}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Pricing summary */}
            <CardFooter className="flex-col items-stretch gap-2.5">
              <PriceRow label="Tạm tính" value={formatPrice(pricing.subtotal)} />
              <PriceRow label="Phí giao hàng" value={formatPrice(pricing.deliveryFee)} />
              {pricing.discount > 0 && (
                <PriceRow
                  label={pricing.couponCode ? `Giảm giá (${pricing.couponCode})` : 'Giảm giá'}
                  value={<span className="text-green-600">−{formatPrice(pricing.discount)}</span>}
                />
              )}
              <div className="border-border border-t pt-2.5">
                <PriceRow
                  label="Tổng cộng"
                  value={
                    <span className="text-primary-600 text-lg font-bold">
                      {formatPrice(pricing.totalAmount)}
                    </span>
                  }
                  bold
                />
              </div>
              <p className="text-text-tertiary text-xs">
                Phương thức thanh toán:{' '}
                <span className="text-text-secondary font-medium">
                  {PAYMENT_LABELS[order.paymentMethod]}
                </span>
              </p>
            </CardFooter>
          </Card>

          {/* Delivery info */}
          <Card className="card-base">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary-500 h-4 w-4" />
                <span className="heading-sm text-text-primary">Thông tin giao hàng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoRow
                icon={<Package className="h-4 w-4" />}
                label="Người nhận"
                value={
                  <span className="flex flex-wrap items-center gap-2">
                    {addr.recipientName}
                    {order.isAnonymous && (
                      <Badge variant="default" size="sm">
                        Ẩn danh
                      </Badge>
                    )}
                  </span>
                }
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Số điện thoại"
                value={addr.recipientPhone}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Địa chỉ giao hàng"
                value={fullAddress}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Ngày giao hàng dự kiến"
                value={
                  <span className="text-primary-600 font-semibold">
                    {formatDate(order.deliveryDate)}
                  </span>
                }
              />

              {order.giftMessage && (
                <div className="border-border rounded-xl border bg-stone-50 p-4">
                  <p className="text-text-tertiary mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                    <Gift className="h-3.5 w-3.5" />
                    Lời nhắn tặng hoa
                  </p>
                  <p className="text-text-primary text-sm italic">"{order.giftMessage}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flower Care Tips */}
          <FlowerCareTips compact className="shadow-none" />

          {/* Action buttons */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href={`/orders/${orderId}`}>
              <Button
                variant="primary"
                size="lg"
                className="btn-primary w-full"
                leftIcon={<Package className="h-4 w-4" />}
              >
                Theo dõi đơn hàng
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                variant="outline"
                size="lg"
                className="btn-secondary w-full"
                leftIcon={<ClipboardList className="h-4 w-4" />}
              >
                Xem đơn hàng
              </Button>
            </Link>
            <Link href="/flowers">
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                leftIcon={<ShoppingBag className="h-4 w-4" />}
              >
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          <p className="text-text-tertiary text-center text-xs">
            Nếu bạn có thắc mắc về đơn hàng, vui lòng liên hệ cửa hàng hoặc bộ phận hỗ trợ Flowery.
          </p>
        </div>
      </div>
    </Container>
  );
}

// ─── Page export (Suspense boundary for useSearchParams) ──────────────────────

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[60vh] items-center justify-center py-16">
          <Spinner size="lg" label="Đang tải..." />
        </Container>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
