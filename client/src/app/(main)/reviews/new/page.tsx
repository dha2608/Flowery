'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Star, ImageIcon, AlertCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Container } from '@/components/layout';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Textarea,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Order } from '@/hooks';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Rating {
  overall: number;
  quality: number;
  delivery: number;
  packaging: number;
}

interface CreateReviewPayload {
  orderId: string;
  rating: Rating;
  comment?: string;
  images: Array<{ url: string; publicId: string }>;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const RATING_FIELDS: Array<{ key: keyof Rating; label: string; description: string }> = [
  { key: 'overall', label: 'Đánh giá chung', description: 'Trải nghiệm tổng thể' },
  { key: 'quality', label: 'Chất lượng hoa', description: 'Độ tươi, màu sắc, vẻ đẹp' },
  { key: 'delivery', label: 'Giao hàng', description: 'Đúng giờ, thái độ giao hàng' },
  { key: 'packaging', label: 'Đóng gói', description: 'Cẩn thận, an toàn, thẩm mỹ' },
];

const STAR_LABELS: Record<number, string> = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Tuyệt vời',
};

// ─── StarRating ───────────────────────────────────────────────────────────────

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  error?: string;
}

function StarRating({ value, onChange, label, description, error }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        {/* Label */}
        <div className="min-w-0">
          <span className="block text-sm font-medium text-stone-800">{label}</span>
          {description && (
            <span className="block text-xs text-stone-400">{description}</span>
          )}
        </div>

        {/* Stars + verbal label */}
        <div className="flex shrink-0 items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${star} sao${star === value ? ' (đã chọn)' : ''}`}
              className={cn(
                'rounded p-0.5 transition-transform focus:outline-none focus-visible:ring-2',
                'focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                star <= active ? 'hover:scale-125' : 'hover:scale-110',
              )}
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  star <= active
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-stone-200',
                )}
              />
            </button>
          ))}

          <span
            className={cn(
              'ml-2 w-20 text-sm transition-colors',
              active > 0 ? 'text-stone-600' : 'text-stone-300',
            )}
          >
            {active > 0 ? STAR_LABELS[active] : '—'}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── ReviewForm (needs Suspense for useSearchParams) ──────────────────────────

function ReviewForm() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const { accessToken } = useAuthStore();

  // ── Form state ────────────────────────────────────────────────────────────
  const [rating, setRating] = useState<Rating>({
    overall: 0,
    quality: 0,
    delivery: 0,
    packaging: 0,
  });
  const [comment, setComment] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Rating, string>>>({});

  // ── Fetch order info ──────────────────────────────────────────────────────
  const {
    data: order,
    isLoading: orderLoading,
    isError: orderError,
  } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const res = await api.get<Order>(`/orders/${orderId}`, accessToken ?? undefined);
      return res.data ?? null;
    },
    enabled: !!orderId,
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  const submitReview = useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const res = await api.post<unknown>('/reviews', payload, accessToken ?? undefined);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cảm ơn bạn! Đánh giá đã được gửi thành công.');
      router.push(`/orders/${orderId}`);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Gửi đánh giá thất bại. Vui lòng thử lại.',
      );
    },
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setRatingField = (key: keyof Rating, value: number) => {
    setRating((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Rating, string>> = {};
    let valid = true;

    (Object.keys(rating) as Array<keyof Rating>).forEach((key) => {
      if (rating[key] === 0) {
        newErrors[key] = 'Vui lòng chọn số sao';
        valid = false;
      }
    });

    setFieldErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!orderId) {
      toast.error('Không tìm thấy đơn hàng. Vui lòng thử lại.');
      return;
    }
    if (!validate()) {
      toast.error('Vui lòng đánh giá đầy đủ tất cả các tiêu chí');
      return;
    }
    if (comment.length > 1000) {
      toast.error('Nhận xét không được vượt quá 1000 ký tự');
      return;
    }

    submitReview.mutate({
      orderId,
      rating,
      comment: comment.trim() || undefined,
      images: [],
    });
  };

  const allRated = Object.values(rating).every((v) => v > 0);
  const commentTooLong = comment.length > 1000;

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang xác thực..." />
      </Container>
    );
  }

  // ── Missing orderId ───────────────────────────────────────────────────────
  if (!orderId) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="font-semibold text-red-700">Thiếu thông tin đơn hàng</h2>
          <p className="mt-1 text-sm text-red-600">
            Không tìm thấy mã đơn hàng trong đường dẫn.
          </p>
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

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <Container className="py-8 pb-20">
      {/* Back link */}
      <Link
        href={`/orders/${orderId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại đơn hàng
      </Link>

      <div className="max-w-2xl">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-stone-900">Đánh giá đơn hàng</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Chia sẻ trải nghiệm của bạn để giúp những khách hàng khác lựa chọn tốt hơn
          </p>
        </div>

        <div className="grid gap-6">
          {/* ── Order Info ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {orderLoading ? (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Spinner size="sm" />
                  <span>Đang tải thông tin đơn hàng...</span>
                </div>
              ) : orderError || !order ? (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Không thể tải thông tin đơn hàng</span>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-lg bg-stone-50 px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-xs text-stone-400">Mã đơn hàng</p>
                    <p className="mt-0.5 font-semibold text-stone-900">#{order.orderNumber}</p>
                  </div>

                  <div className="h-8 w-px shrink-0 bg-stone-200" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-stone-400">Cửa hàng</p>
                    <p className="mt-0.5 truncate font-medium text-stone-900">{order.shopId.name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Star Ratings ───────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá tiêu chí</CardTitle>
              <CardDescription>Chọn số sao cho từng tiêu chí — bắt buộc</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {RATING_FIELDS.map(({ key, label, description }) => (
                <StarRating
                  key={key}
                  label={label}
                  description={description}
                  value={rating[key]}
                  onChange={(val) => setRatingField(key, val)}
                  error={fieldErrors[key]}
                />
              ))}

              {/* Overall progress hint */}
              <div className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2">
                <div className="flex gap-0.5">
                  {RATING_FIELDS.map(({ key }) => (
                    <span
                      key={key}
                      className={cn(
                        'block h-1.5 w-8 rounded-full transition-colors',
                        rating[key] > 0 ? 'bg-primary-400' : 'bg-stone-200',
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500">
                  {Object.values(rating).filter((v) => v > 0).length}/{RATING_FIELDS.length} tiêu chí đã đánh giá
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Comment ────────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Nhận xét</CardTitle>
              <CardDescription>
                Chia sẻ thêm cảm nhận của bạn về đơn hàng — tùy chọn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="VD: Hoa rất tươi và đẹp, giao hàng đúng giờ, đóng gói cẩn thận, sẽ ủng hộ lần sau..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                error={commentTooLong ? 'Nhận xét không được vượt quá 1000 ký tự' : undefined}
              />
              <div className="flex justify-end">
                <span
                  className={cn(
                    'text-xs tabular-nums transition-colors',
                    comment.length > 900
                      ? comment.length >= 1000
                        ? 'text-red-500'
                        : 'text-amber-500'
                      : 'text-stone-400',
                  )}
                >
                  {comment.length} / 1000
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Image Upload Placeholder ────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Thêm ảnh thực tế để đánh giá thuyết phục hơn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <ImageIcon className="h-6 w-6 text-stone-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    Tính năng tải ảnh sẽ sớm được cập nhật
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">Chúng tôi đang phát triển tính năng này</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Actions ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              isLoading={submitReview.isPending}
              disabled={submitReview.isPending || !allRated || commentTooLong}
              size="lg"
              className="flex-1 sm:flex-none"
              leftIcon={
                !submitReview.isPending ? (
                  <Star className="h-4 w-4" />
                ) : undefined
              }
            >
              Gửi đánh giá
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push(`/orders/${orderId}`)}
              disabled={submitReview.isPending}
            >
              Hủy
            </Button>
          </div>

          {/* Disabled hint */}
          {!allRated && (
            <p className="text-center text-xs text-stone-400">
              Vui lòng đánh giá đầy đủ tất cả{' '}
              <span className="font-medium text-primary-600">{RATING_FIELDS.length} tiêu chí</span>{' '}
              để gửi đánh giá
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

// ─── Page (Suspense boundary for useSearchParams) ─────────────────────────────

export default function NewReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" label="Đang tải..." />
        </div>
      }
    >
      <ReviewForm />
    </Suspense>
  );
}
