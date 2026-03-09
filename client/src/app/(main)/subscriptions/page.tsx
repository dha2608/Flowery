'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Flower2,
  CalendarDays,
  Pause,
  Play,
  XCircle,
  CheckCircle,
  Clock,
  Ban,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useMySubscriptions,
  useSubscriptionPlans,
  usePauseSubscription,
  useResumeSubscription,
  useCancelSubscription,
  type Subscription,
  type SubscriptionStatus,
  type SubscriptionPlan,
  type SubscriptionPlanType,
} from '@/hooks/use-subscriptions';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button, Card, CardContent, CardFooter, Badge, Spinner, Modal } from '@/components/ui';
import { Container } from '@/components/layout';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: 'Đang hoạt động',
  paused: 'Tạm dừng',
  cancelled: 'Đã hủy',
};

const STATUS_BADGE: Record<SubscriptionStatus, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  paused: 'warning',
  cancelled: 'danger',
};

const STATUS_ICON: Record<SubscriptionStatus, React.ReactNode> = {
  active: <CheckCircle className="h-3.5 w-3.5" />,
  paused: <Clock className="h-3.5 w-3.5" />,
  cancelled: <Ban className="h-3.5 w-3.5" />,
};

const PLAN_LABEL: Record<SubscriptionPlanType, string> = {
  weekly: 'Hàng tuần',
  biweekly: 'Hai tuần/lần',
  monthly: 'Hàng tháng',
};

const PLAN_BG: Record<SubscriptionPlanType, string> = {
  weekly: 'bg-primary-600',
  biweekly: 'bg-stone-700',
  monthly: 'bg-primary-800',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getShopName(shopId: Subscription['shopId']): string {
  if (typeof shopId === 'string') return shopId;
  return shopId.name;
}

function getShopLogo(shopId: Subscription['shopId']): string | undefined {
  if (typeof shopId === 'string') return undefined;
  return shopId.logo?.url;
}

// ─── Cancel Modal ─────────────────────────────────────────────────────────────

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

function CancelModal({ isOpen, onClose, onConfirm, isPending }: CancelModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Hủy đăng ký" size="md">
      <div className="space-y-4">
        <p className="text-sm text-stone-600">
          Bạn có chắc chắn muốn hủy gói đăng ký này? Sau khi hủy, bạn sẽ không nhận được hoa định kỳ
          nữa.
        </p>

        <div>
          <label
            htmlFor="cancel-reason"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Lý do hủy <span className="font-normal text-stone-400">(không bắt buộc)</span>
          </label>
          <textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do hủy đăng ký..."
            rows={3}
            className={cn(
              'w-full resize-none rounded-lg border border-stone-200 px-3 py-2',
              'text-sm text-stone-900 placeholder-stone-400 outline-none',
              'focus:border-primary-400 focus:ring-primary-100 focus:ring-2',
              'transition-colors'
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Không, giữ lại
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isPending}>
            Xác nhận hủy
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Subscription Card ────────────────────────────────────────────────────────

interface SubscriptionCardProps {
  subscription: Subscription;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  pausePending: boolean;
  resumePending: boolean;
}

function SubscriptionCard({
  subscription,
  onPause,
  onResume,
  onCancel,
  pausePending,
  resumePending,
}: SubscriptionCardProps) {
  const shopName = getShopName(subscription.shopId);
  const shopLogo = getShopLogo(subscription.shopId);
  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused';

  return (
    <Card className="card-base overflow-hidden">
      {/* Top accent stripe — solid color, no gradient */}
      <div
        className={cn(
          'h-1.5 w-full',
          isActive ? 'bg-primary-400' : isPaused ? 'bg-amber-300' : 'bg-stone-200'
        )}
      />

      <CardContent className="p-5">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {shopLogo ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-stone-100 shadow-sm">
                <AppImage src={shopLogo} alt={shopName} className="object-cover" />
              </div>
            ) : (
              <div className="bg-primary-50 flex h-10 w-10 items-center justify-center rounded-full">
                <Flower2 className="text-primary-500 h-5 w-5" />
              </div>
            )}
            <div>
              <p className="font-semibold text-stone-900">{shopName}</p>
              <p className="text-xs text-stone-500">{PLAN_LABEL[subscription.planType]}</p>
            </div>
          </div>

          <Badge variant={STATUS_BADGE[subscription.status]}>
            <span className="flex items-center gap-1">
              {STATUS_ICON[subscription.status]}
              {STATUS_LABEL[subscription.status]}
            </span>
          </Badge>
        </div>

        {/* Details grid */}
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-3 text-sm">
          <div>
            <p className="text-xs text-stone-400">Giao hàng tiếp theo</p>
            <p className="mt-0.5 font-medium text-stone-900">
              {formatDate(subscription.nextDeliveryDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Tổng lần giao</p>
            <p className="mt-0.5 font-medium text-stone-900">{subscription.totalDeliveries} lần</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Ngân sách / lần</p>
            <p className="text-primary-600 mt-0.5 font-medium">
              {formatPrice(subscription.preferences.budget.min)} –{' '}
              {formatPrice(subscription.preferences.budget.max)}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Địa chỉ nhận</p>
            <p className="mt-0.5 truncate font-medium text-stone-900">
              {subscription.deliveryAddress.district}, {subscription.deliveryAddress.city}
            </p>
          </div>
        </div>

        {/* Preferences chips */}
        {subscription.preferences.emotions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {subscription.preferences.emotions.slice(0, 4).map((emotion) => (
              <span
                key={emotion}
                className="bg-primary-50 text-primary-700 ring-primary-100 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1"
              >
                {emotion}
              </span>
            ))}
            {subscription.preferences.emotions.length > 4 && (
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                +{subscription.preferences.emotions.length - 4}
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Actions */}
      {(isActive || isPaused) && (
        <CardFooter className="gap-2">
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Pause className="h-3.5 w-3.5" />}
              onClick={() => onPause(subscription._id)}
              isLoading={pausePending}
              className="flex-1"
            >
              Tạm dừng
            </Button>
          )}
          {isPaused && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Play className="h-3.5 w-3.5" />}
              onClick={() => onResume(subscription._id)}
              isLoading={resumePending}
              className="flex-1"
            >
              Tiếp tục
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<XCircle className="h-3.5 w-3.5 text-red-400" />}
            onClick={() => onCancel(subscription._id)}
            className="text-red-500 hover:bg-red-50"
          >
            Hủy
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

function PlanCard({ plan, isPopular }: PlanCardProps) {
  const planType = plan.id as SubscriptionPlanType;
  const bg = PLAN_BG[planType] ?? 'bg-primary-700';

  return (
    <Card
      className={cn('card-base relative overflow-hidden', isPopular && 'ring-primary-400 ring-2')}
    >
      {isPopular && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary-100 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            Phổ biến
          </span>
        </div>
      )}

      {/* Solid-color header */}
      <div className={cn('p-6 text-white', bg)}>
        <p className="text-sm font-medium opacity-90">{PLAN_LABEL[planType] ?? plan.name}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-serif text-3xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-sm opacity-80">/ lần</span>
        </div>
        <p className="mt-1 text-xs opacity-75">{plan.description}</p>
      </div>

      <CardContent className="p-5">
        <ul className="space-y-2.5">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link href="/subscriptions/new" className="w-full">
          <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">
            Đăng ký ngay
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({ subscription }: { subscription: Subscription }) {
  const shopName = getShopName(subscription.shopId);

  return (
    <Card className="card-base opacity-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">
              <Flower2 className="h-4 w-4 text-stone-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">{shopName}</p>
              <p className="text-xs text-stone-400">
                {PLAN_LABEL[subscription.planType]} · {subscription.totalDeliveries} lần giao
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge variant={STATUS_BADGE[subscription.status]}>
              <span className="flex items-center gap-1">
                {STATUS_ICON[subscription.status]}
                {STATUS_LABEL[subscription.status]}
              </span>
            </Badge>
            <p className="text-xs text-stone-400">
              {subscription.cancelledAt
                ? `Hủy ${formatDate(subscription.cancelledAt)}`
                : subscription.pausedAt
                  ? `Dừng ${formatDate(subscription.pausedAt)}`
                  : formatDate(subscription.createdAt)}
            </p>
          </div>
        </div>

        {subscription.cancelReason && (
          <p className="mt-2 rounded-md bg-stone-50 px-3 py-1.5 text-xs text-stone-500">
            Lý do: {subscription.cancelReason}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const plansRef = useRef<HTMLDivElement>(null);

  // Data
  const { data: allSubscriptions = [], isLoading: subsLoading } = useMySubscriptions();
  const { data: plans = [], isLoading: plansLoading } = useSubscriptionPlans();

  // Mutations
  const pauseMutation = usePauseSubscription();
  const resumeMutation = useResumeSubscription();
  const cancelMutation = useCancelSubscription();

  // Cancel modal state
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Split active vs history
  const activeSubscriptions = allSubscriptions.filter(
    (s) => s.status === 'active' || s.status === 'paused'
  );
  const historySubscriptions = allSubscriptions.filter((s) => s.status === 'cancelled');

  const hasActive = activeSubscriptions.length > 0;

  // Handlers
  const handlePause = (id: string) => {
    pauseMutation.mutate(id);
  };

  const handleResume = (id: string) => {
    resumeMutation.mutate(id);
  };

  const handleCancelRequest = (id: string) => {
    setCancelTargetId(id);
  };

  const handleCancelConfirm = (reason: string) => {
    if (!cancelTargetId) return;
    cancelMutation.mutate(
      { id: cancelTargetId, reason },
      {
        onSettled: () => setCancelTargetId(null),
      }
    );
  };

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auth loading guard
  if (authLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải..." />
      </Container>
    );
  }

  const isLoading = subsLoading || plansLoading;

  return (
    <>
      <Container className="py-8 pb-20">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Đăng ký hoa định kỳ</h1>
            <p className="mt-1 text-sm text-stone-500">
              Nhận hoa tươi mỗi tuần theo sở thích của bạn — không cần lo lắng.
            </p>
          </div>

          <div className="flex gap-3">
            {hasActive && (
              <Button variant="outline" size="sm" onClick={scrollToPlans}>
                <Flower2 className="h-4 w-4" />
                Xem gói mới
              </Button>
            )}
            <Link href="/subscriptions/new">
              <Button size="sm">Đăng ký ngay</Button>
            </Link>
          </div>
        </div>

        {/* ── Loading ───────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" label="Đang tải dữ liệu..." />
          </div>
        ) : (
          <div className="space-y-12">
            {/* ── Active subscriptions ─────────────────────────────────────── */}
            {hasActive && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h2 className="font-serif text-lg font-semibold text-stone-900">
                    Đăng ký đang hoạt động
                  </h2>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {activeSubscriptions.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeSubscriptions.map((sub) => (
                    <SubscriptionCard
                      key={sub._id}
                      subscription={sub}
                      onPause={handlePause}
                      onResume={handleResume}
                      onCancel={handleCancelRequest}
                      pausePending={pauseMutation.isPending && pauseMutation.variables === sub._id}
                      resumePending={
                        resumeMutation.isPending && resumeMutation.variables === sub._id
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Empty state ───────────────────────────────────────────────── */}
            {!hasActive && (
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                  <Flower2 className="text-primary-400 h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">Bạn chưa có đăng ký nào</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    Đăng ký nhận hoa định kỳ và để Flowery lo phần còn lại.
                  </p>
                </div>
                <Button onClick={scrollToPlans}>Khám phá gói đăng ký</Button>
              </div>
            )}

            {/* ── Plans ────────────────────────────────────────────────────── */}
            <section ref={plansRef}>
              <div className="mb-6 text-center">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Chọn gói phù hợp với bạn
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Mỗi gói đều bao gồm lựa chọn hoa cá nhân hóa và giao hàng tận nơi.
                </p>
              </div>

              {plansLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="md" label="Đang tải gói..." />
                </div>
              ) : plans.length === 0 ? (
                <div className="rounded-xl border border-stone-100 bg-stone-50 py-12 text-center">
                  <RefreshCw className="mx-auto mb-3 h-8 w-8 text-stone-300" />
                  <p className="text-sm text-stone-500">
                    Không thể tải gói đăng ký. Vui lòng thử lại sau.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan, i) => (
                    <PlanCard key={plan.id} plan={plan} isPopular={i === 1} />
                  ))}
                </div>
              )}
            </section>

            {/* ── History ──────────────────────────────────────────────────── */}
            {historySubscriptions.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-stone-400" />
                  <h2 className="font-serif text-lg font-semibold text-stone-900">
                    Lịch sử đăng ký
                  </h2>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                    {historySubscriptions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {historySubscriptions.map((sub) => (
                    <HistoryCard key={sub._id} subscription={sub} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </Container>

      {/* ── Cancel Modal ─────────────────────────────────────────────────────── */}
      <CancelModal
        isOpen={cancelTargetId !== null}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleCancelConfirm}
        isPending={cancelMutation.isPending}
      />
    </>
  );
}
