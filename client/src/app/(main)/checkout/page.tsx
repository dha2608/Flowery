'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin,
  Phone,
  Calendar,
  Gift,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Package,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useCreateOrder, type PaymentMethod } from '@/hooks/use-orders';
import { formatPrice } from '@/lib/utils';
import { Button, Input, Textarea, Card, CardHeader, CardContent, Spinner } from '@/components/ui';
import { Container } from '@/components/layout';
import { cn } from '@/lib/utils';

// ─── Constants ───────────────────────────────────────────────────────────────

const DELIVERY_FEE = 30_000;

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    description: 'Trả tiền mặt khi nhận hoa',
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: 'vnpay',
    label: 'VNPay',
    description: 'Cổng thanh toán VNPay',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: 'momo',
    label: 'MoMo',
    description: 'Ví điện tử MoMo',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    value: 'zalopay',
    label: 'ZaloPay',
    description: 'Ví điện tử ZaloPay',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    value: 'bank_transfer',
    label: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp',
    icon: <Building2 className="h-5 w-5" />,
  },
];

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  recipientName: z.string().min(2, 'Tên người nhận phải có ít nhất 2 ký tự'),
  recipientPhone: z
    .string()
    .regex(
      /^(\+84|0)(3|5|7|8|9)\d{8}$/,
      'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'
    ),
  street: z.string().min(3, 'Vui lòng nhập địa chỉ cụ thể'),
  ward: z.string().min(1, 'Vui lòng nhập phường/xã'),
  district: z.string().min(1, 'Vui lòng nhập quận/huyện'),
  city: z.string().min(1, 'Vui lòng nhập tỉnh/thành phố'),
  deliveryDate: z.string().min(1, 'Vui lòng chọn ngày giao hàng'),
  giftMessage: z.string().optional(),
  isAnonymous: z.boolean(),
  paymentMethod: z.enum(['cod', 'vnpay', 'momo', 'zalopay', 'bank_transfer'] as const),
});

type CheckoutForm = z.infer<typeof schema>;

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  number,
  title,
  icon,
  children,
}: {
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="card-base">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 text-primary-700 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {number}
          </div>
          <div className="text-text-primary flex items-center gap-2">
            {icon}
            <span className="heading-sm">{title}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const getShopGroups = useCartStore((s) => s.getShopGroups);
  const clearCart = useCartStore((s) => s.clearCart);

  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      isAnonymous: false,
      paymentMethod: 'cod',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const isAnonymous = watch('isAnonymous');

  useEffect(() => setMounted(true), []);

  // Pre-fill user info
  useEffect(() => {
    if (user && mounted) {
      setValue('recipientName', user.name);
      if (user.phone) setValue('recipientPhone', user.phone);
    }
  }, [user, mounted, setValue]);

  // Redirect if cart is empty (after hydration)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace('/cart');
    }
  }, [mounted, items.length, router]);

  if (authLoading || !mounted) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải..." />
      </Container>
    );
  }

  const shopGroups = getShopGroups();

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitError(null);

    const deliveryAddress = {
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      street: data.street,
      ward: data.ward,
      district: data.district,
      city: data.city,
    };

    try {
      const orderPromises = Array.from(shopGroups.entries()).map(([shopId, group]) =>
        createOrder.mutateAsync({
          shopId,
          items: group.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            ...(item.customizations
              ? {
                  customizations: Object.entries(item.customizations).map(([name, selected]) => ({
                    name,
                    selected,
                  })),
                }
              : {}),
          })),
          deliveryAddress,
          deliveryDate: new Date(data.deliveryDate).toISOString(),
          ...(data.giftMessage ? { giftMessage: data.giftMessage } : {}),
          isAnonymous: data.isAnonymous,
          paymentMethod: data.paymentMethod,
        })
      );

      const results = await Promise.all(orderPromises);
      clearCart();

      // Remove gift message from localStorage after successful order
      localStorage.removeItem('flowery-gift-message');

      // Navigate to success page with order info
      const firstId = results[0]?._id;
      if (firstId) {
        router.push(`/checkout/success?orderId=${firstId}`);
      } else {
        router.push('/orders');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.';
      setSubmitError(msg);
    }
  };

  // Per-shop totals for summary
  const shopSummaries = Array.from(shopGroups.entries()).map(([shopId, group]) => {
    const subtotal = group.items.reduce(
      (sum, item) => sum + (item.salePrice ?? item.price) * item.quantity,
      0
    );
    return { shopId, shopName: group.shopName, items: group.items, subtotal };
  });

  const totalSubtotal = shopSummaries.reduce((s, g) => s + g.subtotal, 0);
  const totalDelivery = DELIVERY_FEE * shopGroups.size;
  const grandTotal = totalSubtotal + totalDelivery;

  return (
    <Container className="py-8 pb-16">
      <h1 className="heading-md text-text-primary mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ── Left column: form sections ─────────────────────────── */}
          <div className="space-y-6">
            {/* 1. Delivery info */}
            <Section
              number={1}
              title="Thông tin giao hàng"
              icon={<MapPin className="text-primary-500 h-4 w-4" />}
            >
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Tên người nhận"
                    placeholder="Nguyễn Văn A"
                    error={errors.recipientName?.message}
                    {...register('recipientName')}
                  />
                  <Input
                    label="Số điện thoại"
                    placeholder="0912 345 678"
                    type="tel"
                    error={errors.recipientPhone?.message}
                    leftIcon={<Phone className="h-4 w-4" />}
                    {...register('recipientPhone')}
                  />
                </div>

                <Input
                  label="Địa chỉ (số nhà, tên đường)"
                  placeholder="123 Đường Hoa Hồng"
                  error={errors.street?.message}
                  {...register('street')}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Phường/Xã"
                    placeholder="Phường 1"
                    error={errors.ward?.message}
                    {...register('ward')}
                  />
                  <Input
                    label="Quận/Huyện"
                    placeholder="Quận Bình Thạnh"
                    error={errors.district?.message}
                    {...register('district')}
                  />
                  <Input
                    label="Tỉnh/Thành phố"
                    placeholder="TP. Hồ Chí Minh"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                </div>

                <Input
                  label="Ngày giao hàng"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  error={errors.deliveryDate?.message}
                  leftIcon={<Calendar className="h-4 w-4" />}
                  {...register('deliveryDate')}
                />
              </div>
            </Section>

            {/* 2. Gift message */}
            <Section
              number={2}
              title="Tin nhắn tặng hoa"
              icon={<Gift className="text-primary-500 h-4 w-4" />}
            >
              <div className="space-y-4">
                <Textarea
                  label="Lời nhắn (không bắt buộc)"
                  placeholder="Chúc mừng sinh nhật! Yêu bạn nhiều lắm"
                  rows={3}
                  autoGrow
                  {...register('giftMessage')}
                />
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="border-border text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                    {...register('isAnonymous')}
                  />
                  <span className="body-sm text-text-primary">
                    Gửi ẩn danh{' '}
                    <span className="text-text-tertiary">(không hiển thị tên người gửi)</span>
                  </span>
                </label>
                {isAnonymous && (
                  <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    Đơn hàng này sẽ được gửi ẩn danh đến người nhận.
                  </p>
                )}
              </div>
            </Section>

            {/* 3. Payment method */}
            <Section
              number={3}
              title="Phương thức thanh toán"
              icon={<CreditCard className="text-primary-500 h-4 w-4" />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('paymentMethod', opt.value)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                      paymentMethod === opt.value
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-border hover:border-stone-300 hover:bg-stone-50'
                    )}
                  >
                    <div
                      className={cn(
                        'shrink-0 rounded-lg p-2',
                        paymentMethod === opt.value
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-text-secondary bg-stone-100'
                      )}
                    >
                      {opt.icon}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          paymentMethod === opt.value ? 'text-primary-700' : 'text-text-primary'
                        )}
                      >
                        {opt.label}
                      </p>
                      <p className="text-text-tertiary truncate text-xs">{opt.description}</p>
                    </div>
                    {paymentMethod === opt.value && (
                      <div className="bg-primary-500 ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* ── Right column: order summary ─────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Order summary card */}
            <Card className="card-base">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="text-primary-500 h-4 w-4" />
                  <span className="heading-sm text-text-primary">Xác nhận đơn hàng</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {shopSummaries.map((group) => (
                  <div key={group.shopId}>
                    <p className="text-text-primary mb-3 text-sm font-semibold">{group.shopName}</p>

                    <div className="space-y-2">
                      {group.items.map((item) => {
                        const price = item.salePrice ?? item.price;
                        return (
                          <div
                            key={item.productId}
                            className="flex items-start justify-between gap-3 text-sm"
                          >
                            <span className="text-text-secondary line-clamp-2 min-w-0 flex-1">
                              {item.productName}{' '}
                              <span className="text-text-tertiary">×{item.quantity}</span>
                            </span>
                            <span className="text-text-primary shrink-0 font-medium">
                              {formatPrice(price * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-border-light mt-2 flex justify-between border-t border-dashed pt-2 text-sm">
                      <span className="text-text-secondary">Phí giao hàng</span>
                      <span className="text-text-primary">{formatPrice(DELIVERY_FEE)}</span>
                    </div>

                    {shopSummaries.length > 1 && (
                      <div className="mt-1 flex justify-between text-sm font-semibold">
                        <span className="text-text-primary">Tổng cửa hàng</span>
                        <span className="text-text-primary">
                          {formatPrice(group.subtotal + DELIVERY_FEE)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Grand total */}
                <div className="border-border space-y-2 border-t pt-3">
                  <div className="text-text-secondary flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalSubtotal)}</span>
                  </div>
                  <div className="text-text-secondary flex justify-between text-sm">
                    <span>Phí giao hàng ({shopGroups.size} đơn)</span>
                    <span>{formatPrice(totalDelivery)}</span>
                  </div>
                  <div className="divider" />
                  <div className="text-text-primary flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error */}
            {submitError && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="btn-primary w-full"
              isLoading={isSubmitting || createOrder.isPending}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              {shopGroups.size > 1 ? `Đặt ${shopGroups.size} đơn hàng` : 'Đặt hàng'}
            </Button>

            <p className="text-text-tertiary text-center text-xs">
              Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của Flowery.
            </p>
          </div>
        </div>
      </form>
    </Container>
  );
}
