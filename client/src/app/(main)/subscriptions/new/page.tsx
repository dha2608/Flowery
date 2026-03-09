'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Truck,
  Plus,
  X,
  Store,
  CalendarDays,
  Heart,
  Home,
  CreditCard,
  Flower2,
  Smartphone,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useRequireAuth,
  useShops,
  useSubscriptionPlans,
  useCreateSubscription,
  type SubscriptionPlanType,
  type SubscriptionPaymentMethod,
} from '@/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Spinner,
  Input,
  Textarea,
} from '@/components/ui';
import { Container } from '@/components/layout';
import { formatPrice, cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Cửa hàng', icon: Store },
  { id: 2, label: 'Gói', icon: CalendarDays },
  { id: 3, label: 'Sở thích', icon: Heart },
  { id: 4, label: 'Địa chỉ', icon: Home },
  { id: 5, label: 'Xác nhận', icon: CreditCard },
];

const EMOTIONS = [
  { id: 'romantic', label: 'Lãng mạn', color: 'bg-red-100 text-red-800 ring-red-200' },
  { id: 'grateful', label: 'Biết ơn', color: 'bg-yellow-100 text-yellow-800 ring-yellow-200' },
  { id: 'joyful', label: 'Vui vẻ', color: 'bg-green-100 text-green-800 ring-green-200' },
  { id: 'sympathetic', label: 'Đồng cảm', color: 'bg-blue-100 text-blue-800 ring-blue-200' },
  { id: 'respectful', label: 'Kính trọng', color: 'bg-purple-100 text-purple-800 ring-purple-200' },
  { id: 'apologetic', label: 'Xin lỗi', color: 'bg-orange-100 text-orange-800 ring-orange-200' },
  {
    id: 'celebratory',
    label: 'Chúc mừng',
    color: 'bg-primary-100 text-primary-800 ring-primary-200',
  },
  { id: 'friendly', label: 'Thân thiện', color: 'bg-teal-100 text-teal-800 ring-teal-200' },
  { id: 'passionate', label: 'Đam mê', color: 'bg-rose-100 text-rose-800 ring-rose-200' },
];

const COLORS = [
  { id: 'red', label: 'Đỏ', hex: '#EF4444' },
  { id: 'pink', label: 'Hồng', hex: '#EC4899' },
  { id: 'white', label: 'Trắng', hex: '#F9FAFB', border: true },
  { id: 'yellow', label: 'Vàng', hex: '#EAB308' },
  { id: 'purple', label: 'Tím', hex: '#A855F7' },
  { id: 'blue', label: 'Xanh dương', hex: '#3B82F6' },
  { id: 'orange', label: 'Cam', hex: '#F97316' },
  { id: 'green', label: 'Xanh lá', hex: '#22C55E' },
];

const PLAN_LABELS: Record<SubscriptionPlanType, string> = {
  weekly: 'Hàng tuần',
  biweekly: 'Hai tuần/lần',
  monthly: 'Hàng tháng',
};

const PLAN_BG: Record<SubscriptionPlanType, string> = {
  weekly: 'bg-primary-600',
  biweekly: 'bg-stone-700',
  monthly: 'bg-primary-800',
};

const PAYMENT_METHODS: { id: SubscriptionPaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'vnpay', label: 'VNPay', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'momo', label: 'MoMo', icon: <Smartphone className="h-5 w-5" /> },
  { id: 'zalopay', label: 'ZaloPay', icon: <Smartphone className="h-5 w-5" /> },
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: <Building2 className="h-5 w-5" /> },
];

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  shopId: string;
  planType: SubscriptionPlanType | '';
  preferences: {
    budgetMin: number;
    budgetMax: number;
    emotions: string[];
    colors: string[];
    excludeFlowers: string[];
    excludeInput: string;
    notes: string;
  };
  delivery: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  paymentMethod: SubscriptionPaymentMethod | '';
}

const INITIAL_FORM: FormState = {
  shopId: '',
  planType: '',
  preferences: {
    budgetMin: 200000,
    budgetMax: 800000,
    emotions: [],
    colors: [],
    excludeFlowers: [],
    excludeInput: '',
    notes: '',
  },
  delivery: {
    recipientName: '',
    recipientPhone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  },
  paymentMethod: '',
};

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Các bước" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const done = current > step.id;
          const active = current === step.id;
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors',
                    done
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : active
                        ? 'border-primary-600 text-primary-600 bg-white'
                        : 'border-stone-200 bg-white text-stone-400'
                  )}
                >
                  {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    active ? 'text-primary-600' : done ? 'text-primary-500' : 'text-stone-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-colors',
                    done ? 'bg-primary-400' : 'bg-stone-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Step 1: Chọn cửa hàng ───────────────────────────────────────────────────

function Step1Shops({ form, onChange }: { form: FormState; onChange: (shopId: string) => void }) {
  const { data, isLoading, isError } = useShops({ limit: 20 });
  const shops = data?.shops ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label="Đang tải danh sách cửa hàng..." />
      </div>
    );
  }

  if (isError || shops.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center">
        <Store className="mx-auto mb-3 h-10 w-10 text-stone-300" />
        <p className="text-sm text-stone-500">Không tìm thấy cửa hàng. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shops.map((shop) => {
        const selected = form.shopId === shop._id;
        return (
          <button
            key={shop._id}
            type="button"
            onClick={() => onChange(shop._id)}
            className={cn(
              'group relative rounded-xl border-2 bg-white text-left transition-all',
              'focus-visible:ring-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              selected
                ? 'border-primary-500 shadow-primary-100 shadow-md'
                : 'hover:border-primary-300 border-stone-200 hover:shadow-sm'
            )}
          >
            {selected && (
              <span className="bg-primary-500 absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </span>
            )}

            <div className="p-4">
              {/* Logo + name */}
              <div className="mb-3 flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-stone-100 shadow-sm">
                  <AppImage src={shop.logo?.url} alt={shop.name} className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-stone-900">{shop.name}</p>
                  {shop.isVerified && (
                    <Badge variant="success" size="sm">
                      Đã xác minh
                    </Badge>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mb-2 flex items-start gap-1.5 text-xs text-stone-500">
                <MapPin className="text-primary-400 mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">
                  {shop.address.street}, {shop.address.ward}, {shop.address.district},{' '}
                  {shop.address.city}
                </span>
              </div>

              {/* Rating + delivery */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-stone-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{shop.stats.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({shop.stats.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <Truck className="text-primary-400 h-3.5 w-3.5" />
                  <span>{shop.deliveryConfig.estimatedTime}</span>
                </div>
              </div>

              {/* Delivery fee */}
              <div className="bg-primary-50 mt-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-600">
                Phí giao:{' '}
                <span className="text-primary-600 font-medium">
                  {formatPrice(shop.deliveryConfig.baseFee)}
                </span>
                {shop.deliveryConfig.freeAboveAmount > 0 && (
                  <span className="text-stone-400">
                    {' '}
                    · Miễn phí khi ≥ {formatPrice(shop.deliveryConfig.freeAboveAmount)}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 2: Chọn gói ────────────────────────────────────────────────────────

function Step2Plans({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (planType: SubscriptionPlanType) => void;
}) {
  const { data: plans = [], isLoading } = useSubscriptionPlans();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label="Đang tải gói đăng ký..." />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan, idx) => {
        const planType = plan.id as SubscriptionPlanType;
        const selected = form.planType === planType;
        const bg = PLAN_BG[planType] ?? 'bg-primary-700';
        const isPopular = idx === 1;

        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onChange(planType)}
            className={cn(
              'relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all',
              'focus-visible:ring-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              selected
                ? 'border-primary-500 shadow-primary-100 shadow-lg'
                : 'hover:border-primary-300 border-stone-200'
            )}
          >
            {isPopular && !selected && (
              <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-stone-700 ring-1 ring-stone-200 backdrop-blur-sm">
                Phổ biến
              </span>
            )}
            {selected && (
              <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                <CheckCircle className="text-primary-500 h-4 w-4" />
              </span>
            )}

            {/* Solid-color header */}
            <div className={cn('p-5 text-white', bg)}>
              <p className="text-sm font-medium opacity-90">{PLAN_LABELS[planType] ?? plan.name}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-sm opacity-80">/ lần</span>
              </div>
              <p className="mt-1 text-xs opacity-75">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="flex-1 bg-white p-4">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 3: Sở thích ────────────────────────────────────────────────────────

function Step3Preferences({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (partial: Partial<FormState['preferences']>) => void;
}) {
  const pref = form.preferences;

  const toggleEmotion = (id: string) => {
    const next = pref.emotions.includes(id)
      ? pref.emotions.filter((e) => e !== id)
      : [...pref.emotions, id];
    onChange({ emotions: next });
  };

  const toggleColor = (id: string) => {
    const next = pref.colors.includes(id)
      ? pref.colors.filter((c) => c !== id)
      : [...pref.colors, id];
    onChange({ colors: next });
  };

  const addExcludeFlower = () => {
    const val = pref.excludeInput.trim();
    if (!val || pref.excludeFlowers.includes(val)) return;
    onChange({ excludeFlowers: [...pref.excludeFlowers, val], excludeInput: '' });
  };

  const removeExcludeFlower = (flower: string) => {
    onChange({ excludeFlowers: pref.excludeFlowers.filter((f) => f !== flower) });
  };

  return (
    <div className="space-y-8">
      {/* Budget */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-stone-900">Ngân sách (VNĐ / lần giao)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Tối thiểu</label>
            <input
              type="number"
              min={50000}
              step={50000}
              value={pref.budgetMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({ budgetMin: v, budgetMax: Math.max(pref.budgetMax, v) });
              }}
              className={cn(
                'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900',
                'focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none'
              )}
            />
            <p className="text-primary-600 mt-1 text-xs font-medium">
              {formatPrice(pref.budgetMin)}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600">Tối đa</label>
            <input
              type="number"
              min={pref.budgetMin}
              step={50000}
              value={pref.budgetMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({ budgetMax: Math.max(v, pref.budgetMin) });
              }}
              className={cn(
                'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900',
                'focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none'
              )}
            />
            <p className="text-primary-600 mt-1 text-xs font-medium">
              {formatPrice(pref.budgetMax)}
            </p>
          </div>
        </div>
        <div className="bg-primary-50 mt-4 rounded-xl px-4 py-3 text-sm text-stone-700">
          Khoảng ngân sách:{' '}
          <span className="text-primary-600 font-semibold">
            {formatPrice(pref.budgetMin)} – {formatPrice(pref.budgetMax)}
          </span>
        </div>
      </section>

      {/* Emotions */}
      <section>
        <h3 className="mb-1.5 text-sm font-semibold text-stone-900">
          Cảm xúc muốn gửi gắm <span className="font-normal text-stone-400">(chọn nhiều)</span>
        </h3>
        <p className="mb-3 text-xs text-stone-500">
          Chúng tôi sẽ chọn hoa phù hợp với cảm xúc bạn muốn truyền đạt.
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((emotion) => {
            const selected = pref.emotions.includes(emotion.id);
            return (
              <button
                key={emotion.id}
                type="button"
                onClick={() => toggleEmotion(emotion.id)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-all',
                  'focus-visible:ring-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  selected
                    ? cn(emotion.color, 'scale-105 shadow-sm ring-current')
                    : 'bg-stone-50 text-stone-600 ring-stone-200 hover:bg-stone-100'
                )}
              >
                {emotion.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="mb-1.5 text-sm font-semibold text-stone-900">
          Màu sắc yêu thích <span className="font-normal text-stone-400">(chọn nhiều)</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => {
            const selected = pref.colors.includes(color.id);
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => toggleColor(color.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-all',
                  'focus-visible:ring-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  selected
                    ? 'scale-105 bg-stone-900 text-white shadow-md ring-stone-900'
                    : 'bg-white text-stone-700 ring-stone-200 hover:ring-stone-300'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 rounded-full',
                    color.border ? 'border border-stone-300' : ''
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                {color.label}
                {selected && <CheckCircle className="text-primary-400 h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Exclude flowers */}
      <section>
        <h3 className="mb-1.5 text-sm font-semibold text-stone-900">
          Hoa không muốn nhận <span className="font-normal text-stone-400">(không bắt buộc)</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={pref.excludeInput}
            onChange={(e) => onChange({ excludeInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addExcludeFlower();
              }
            }}
            placeholder="Nhập tên hoa rồi nhấn Enter hoặc Thêm..."
            className={cn(
              'flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900',
              'focus:border-primary-400 focus:ring-primary-100 placeholder:text-stone-400 focus:ring-2 focus:outline-none'
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExcludeFlower}
            disabled={!pref.excludeInput.trim()}
          >
            <Plus className="h-4 w-4" />
            Thêm
          </Button>
        </div>
        {pref.excludeFlowers.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {pref.excludeFlowers.map((flower) => (
              <span
                key={flower}
                className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-red-100"
              >
                {flower}
                <button
                  type="button"
                  onClick={() => removeExcludeFlower(flower)}
                  className="rounded-full p-0.5 transition-colors hover:bg-red-100"
                  aria-label={`Xóa ${flower}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Notes */}
      <section>
        <Textarea
          label="Ghi chú thêm (không bắt buộc)"
          placeholder="Ví dụ: Tôi muốn hoa có mùi thơm nhẹ, tránh hoa có phấn..."
          rows={3}
          value={pref.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </section>
    </div>
  );
}

// ─── Step 4: Địa chỉ giao hàng ───────────────────────────────────────────────

const VN_PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;

interface DeliveryErrors {
  recipientName?: string;
  recipientPhone?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
}

function Step4Delivery({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: DeliveryErrors;
  onChange: (partial: Partial<FormState['delivery']>) => void;
}) {
  const d = form.delivery;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Tên người nhận"
          placeholder="Nguyễn Văn A"
          value={d.recipientName}
          onChange={(e) => onChange({ recipientName: e.target.value })}
          error={errors.recipientName}
          required
        />
        <Input
          label="Số điện thoại"
          placeholder="0901234567"
          value={d.recipientPhone}
          onChange={(e) => onChange({ recipientPhone: e.target.value })}
          error={errors.recipientPhone}
          required
        />
      </div>

      <Input
        label="Địa chỉ (số nhà, tên đường)"
        placeholder="123 Đường Hoa Hồng"
        value={d.street}
        onChange={(e) => onChange({ street: e.target.value })}
        error={errors.street}
        required
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label="Phường/Xã"
          placeholder="Phường Bến Nghé"
          value={d.ward}
          onChange={(e) => onChange({ ward: e.target.value })}
          error={errors.ward}
          required
        />
        <Input
          label="Quận/Huyện"
          placeholder="Quận 1"
          value={d.district}
          onChange={(e) => onChange({ district: e.target.value })}
          error={errors.district}
          required
        />
        <Input
          label="Thành phố/Tỉnh"
          placeholder="TP. Hồ Chí Minh"
          value={d.city}
          onChange={(e) => onChange({ city: e.target.value })}
          error={errors.city}
          required
        />
      </div>

      <div className="bg-primary-50 text-primary-800 flex items-start gap-2 rounded-xl p-4 text-sm">
        <Truck className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Địa chỉ này sẽ được sử dụng cho tất cả các lần giao hàng định kỳ. Bạn có thể thay đổi sau
          trong phần quản lý đăng ký.
        </p>
      </div>
    </div>
  );
}

// ─── Step 5: Xác nhận & Thanh toán ───────────────────────────────────────────

function Step5Confirm({
  form,
  onPaymentChange,
  shops,
  plans,
}: {
  form: FormState;
  onPaymentChange: (method: SubscriptionPaymentMethod) => void;
  shops: { _id: string; name: string; logo?: { url: string } }[];
  plans: { id: string; name: string; price: number }[];
}) {
  const shop = shops.find((s) => s._id === form.shopId);
  const plan = plans.find((p) => p.id === form.planType);
  const pref = form.preferences;
  const d = form.delivery;

  const selectedEmotions = EMOTIONS.filter((e) => pref.emotions.includes(e.id));
  const selectedColors = COLORS.filter((c) => pref.colors.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Shop */}
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Store className="text-primary-500 h-4 w-4" />
              Cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            {shop ? (
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-stone-100">
                  <AppImage src={shop.logo?.url} alt={shop.name} className="object-cover" />
                </div>
                <span className="font-medium text-stone-900">{shop.name}</span>
              </div>
            ) : (
              <p className="text-sm text-stone-400">Chưa chọn</p>
            )}
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="text-primary-500 h-4 w-4" />
              Gói đăng ký
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            {plan ? (
              <div>
                <p className="font-medium text-stone-900">
                  {PLAN_LABELS[form.planType as SubscriptionPlanType] ?? plan.name}
                </p>
                <p className="text-primary-600 text-sm">{formatPrice(plan.price)} / lần giao</p>
              </div>
            ) : (
              <p className="text-sm text-stone-400">Chưa chọn</p>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="sm:col-span-2">
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="text-primary-500 h-4 w-4" />
              Sở thích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Ngân sách:</span>
              <span className="text-primary-600 font-medium">
                {formatPrice(pref.budgetMin)} – {formatPrice(pref.budgetMax)}
              </span>
            </div>

            {selectedEmotions.length > 0 && (
              <div>
                <span className="text-stone-500">Cảm xúc:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedEmotions.map((e) => (
                    <span
                      key={e.id}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                        e.color
                      )}
                    >
                      {e.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedColors.length > 0 && (
              <div>
                <span className="text-stone-500">Màu sắc:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedColors.map((c) => (
                    <span
                      key={c.id}
                      className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700"
                    >
                      <span
                        className={cn(
                          'h-3 w-3 rounded-full',
                          c.border ? 'border border-stone-300' : ''
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pref.excludeFlowers.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Không dùng:</span>
                <span className="font-medium text-red-600">{pref.excludeFlowers.join(', ')}</span>
              </div>
            )}

            {pref.notes && (
              <div>
                <span className="text-stone-500">Ghi chú: </span>
                <span className="text-stone-700">{pref.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery address */}
        <Card className="sm:col-span-2">
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Home className="text-primary-500 h-4 w-4" />
              Địa chỉ giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-0 pb-4 text-sm">
            <p className="font-medium text-stone-900">{d.recipientName}</p>
            <p className="text-stone-500">{d.recipientPhone}</p>
            <p className="text-stone-700">
              {d.street}, {d.ward}, {d.district}, {d.city}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment method */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-900">Phương thức thanh toán</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PAYMENT_METHODS.map((method) => {
            const selected = form.paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentChange(method.id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                  'focus-visible:ring-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  selected
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'hover:border-primary-200 border-stone-200 bg-white'
                )}
              >
                <span
                  className={cn(
                    'transition-colors',
                    selected ? 'text-primary-600' : 'text-stone-400'
                  )}
                >
                  {method.icon}
                </span>
                <span
                  className={cn(
                    'text-center text-xs font-medium',
                    selected ? 'text-primary-700' : 'text-stone-600'
                  )}
                >
                  {method.label}
                </span>
                {selected && <CheckCircle className="text-primary-500 h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewSubscriptionPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});

  // Data for confirm step
  const { data: shopsData } = useShops({ limit: 20 });
  const { data: plans = [] } = useSubscriptionPlans();
  const shops = shopsData?.shops ?? [];

  const createMutation = useCreateSubscription();

  // ── Form updaters ─────────────────────────────────────────────────────────

  const updatePreferences = (partial: Partial<FormState['preferences']>) => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...partial },
    }));
  };

  const updateDelivery = (partial: Partial<FormState['delivery']>) => {
    setForm((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, ...partial },
    }));
    // Clear errors as user types
    setDeliveryErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(partial)) {
        delete next[key as keyof DeliveryErrors];
      }
      return next;
    });
  };

  // ── Validation per step ───────────────────────────────────────────────────

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!form.shopId) {
          toast.error('Vui lòng chọn một cửa hàng.');
          return false;
        }
        return true;

      case 2:
        if (!form.planType) {
          toast.error('Vui lòng chọn gói đăng ký.');
          return false;
        }
        return true;

      case 3: {
        const { budgetMin, budgetMax } = form.preferences;
        if (budgetMin <= 0 || budgetMax <= 0 || budgetMax < budgetMin) {
          toast.error('Vui lòng nhập ngân sách hợp lệ (tối thiểu ≤ tối đa).');
          return false;
        }
        return true;
      }

      case 4: {
        const d = form.delivery;
        const errors: DeliveryErrors = {};

        if (!d.recipientName.trim()) errors.recipientName = 'Vui lòng nhập tên người nhận.';
        if (!d.recipientPhone.trim()) {
          errors.recipientPhone = 'Vui lòng nhập số điện thoại.';
        } else if (!VN_PHONE_REGEX.test(d.recipientPhone.trim())) {
          errors.recipientPhone = 'Số điện thoại không hợp lệ (VD: 0901234567).';
        }
        if (!d.street.trim()) errors.street = 'Vui lòng nhập địa chỉ.';
        if (!d.ward.trim()) errors.ward = 'Vui lòng nhập phường/xã.';
        if (!d.district.trim()) errors.district = 'Vui lòng nhập quận/huyện.';
        if (!d.city.trim()) errors.city = 'Vui lòng nhập thành phố/tỉnh.';

        setDeliveryErrors(errors);
        if (Object.keys(errors).length > 0) {
          toast.error('Vui lòng điền đầy đủ thông tin địa chỉ.');
          return false;
        }
        return true;
      }

      case 5:
        if (!form.paymentMethod) {
          toast.error('Vui lòng chọn phương thức thanh toán.');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    if (!form.planType || !form.paymentMethod) return;

    createMutation.mutate(
      {
        shopId: form.shopId,
        planType: form.planType as SubscriptionPlanType,
        preferences: {
          budget: { min: form.preferences.budgetMin, max: form.preferences.budgetMax },
          emotions: form.preferences.emotions,
          colors: form.preferences.colors,
          excludeFlowers: form.preferences.excludeFlowers,
          notes: form.preferences.notes || undefined,
        },
        deliveryAddress: {
          recipientName: form.delivery.recipientName.trim(),
          recipientPhone: form.delivery.recipientPhone.trim(),
          street: form.delivery.street.trim(),
          ward: form.delivery.ward.trim(),
          district: form.delivery.district.trim(),
          city: form.delivery.city.trim(),
        },
        paymentMethod: form.paymentMethod as SubscriptionPaymentMethod,
      },
      {
        onSuccess: () => {
          toast.success('Đăng ký thành công! Chúng tôi sẽ giao hoa đến bạn sớm nhất.');
          router.push('/subscriptions');
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
          toast.error(message);
        },
      }
    );
  };

  // ── Auth guard ────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải..." />
      </Container>
    );
  }

  // ── Step content ──────────────────────────────────────────────────────────

  const stepTitles: Record<number, { title: string; description: string }> = {
    1: {
      title: 'Chọn cửa hàng',
      description: 'Chọn cửa hàng hoa bạn muốn đăng ký nhận hoa định kỳ.',
    },
    2: {
      title: 'Chọn gói đăng ký',
      description: 'Chọn tần suất giao hoa phù hợp với nhu cầu của bạn.',
    },
    3: {
      title: 'Sở thích cá nhân',
      description: 'Cho chúng tôi biết sở thích để chọn hoa phù hợp nhất.',
    },
    4: {
      title: 'Địa chỉ giao hàng',
      description: 'Nhập địa chỉ để chúng tôi giao hoa đến bạn.',
    },
    5: {
      title: 'Xác nhận & Thanh toán',
      description: 'Kiểm tra thông tin và chọn phương thức thanh toán.',
    },
  };

  const { title, description } = stepTitles[currentStep] ?? { title: '', description: '' };

  return (
    <Container className="py-8 pb-20">
      {/* Page header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-stone-500">
          <button
            type="button"
            onClick={() => router.push('/subscriptions')}
            className="hover:text-primary-600 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Đăng ký định kỳ
          </button>
          <span>/</span>
          <span className="font-medium text-stone-900">Tạo đăng ký mới</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-xl">
            <Flower2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Đăng ký hoa định kỳ mới
            </h1>
            <p className="text-sm text-stone-500">
              Nhận hoa tươi theo lịch cố định, không cần lo lắng.
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={currentStep} />

      {/* Step card */}
      <Card className="card-base overflow-hidden">
        {/* Step header */}
        <div className="border-b border-stone-100 bg-stone-50 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="bg-primary-600 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
              {currentStep}
            </span>
            <h2 className="font-serif text-lg font-semibold text-stone-900">{title}</h2>
          </div>
          <p className="mt-1 pl-8 text-sm text-stone-500">{description}</p>
        </div>

        {/* Step body */}
        <CardContent className="p-6">
          {currentStep === 1 && (
            <Step1Shops
              form={form}
              onChange={(shopId) => setForm((prev) => ({ ...prev, shopId }))}
            />
          )}

          {currentStep === 2 && (
            <Step2Plans
              form={form}
              onChange={(planType) => setForm((prev) => ({ ...prev, planType }))}
            />
          )}

          {currentStep === 3 && <Step3Preferences form={form} onChange={updatePreferences} />}

          {currentStep === 4 && (
            <Step4Delivery form={form} errors={deliveryErrors} onChange={updateDelivery} />
          )}

          {currentStep === 5 && (
            <Step5Confirm
              form={form}
              onPaymentChange={(method) => setForm((prev) => ({ ...prev, paymentMethod: method }))}
              shops={shops}
              plans={plans}
            />
          )}
        </CardContent>

        {/* Navigation footer */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/50 px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Quay lại
          </Button>

          <div className="flex items-center gap-2">
            {/* Dot indicators */}
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'h-2 rounded-full transition-all',
                  step.id === currentStep
                    ? 'bg-primary-500 w-6'
                    : step.id < currentStep
                      ? 'bg-primary-300 w-2'
                      : 'w-2 bg-stone-200'
                )}
              />
            ))}
          </div>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Tiếp theo
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={createMutation.isPending}
              leftIcon={!createMutation.isPending ? <CheckCircle className="h-4 w-4" /> : undefined}
            >
              Xác nhận đăng ký
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
}
