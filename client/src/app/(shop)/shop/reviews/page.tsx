'use client';

import { useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useMyShop, useShopReviews, useReplyReview } from '@/hooks/use-shop-management';
import { Avatar, Badge, Button, Spinner, Textarea, Card, CardContent } from '@/components/ui';
import { formatDate, cn } from '@/lib/utils';
import type { ShopReview } from '@/hooks/use-shop-management';
import { AppImage } from '@/components/ui/app-image';

// ─── Star display ─────────────────────────────────────────────────────────────

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </span>
  );
}

// ─── Rating summary ───────────────────────────────────────────────────────────

function RatingSummary({ reviews }: { reviews: ShopReview[] }) {
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  // Count per star
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center">
      {/* Average */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <p className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</p>
        <StarRow rating={Math.round(avg)} />
        <p className="text-xs text-gray-400 mt-1">{reviews.length} đánh giá</p>
      </div>

      {/* Bar breakdown */}
      <div className="flex-1 w-full space-y-2 min-w-0">
        {counts.map(({ star, count }) => {
          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 text-right text-xs font-medium text-gray-600">
                {star} ★
              </span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-xs text-gray-400">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ShopReview }) {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const replyMutation = useReplyReview();

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await replyMutation.mutateAsync({ id: review._id, content: replyText.trim() });
      toast.success('Đã trả lời đánh giá!');
      setReplyText('');
      setShowReplyBox(false);
    } catch {
      toast.error('Trả lời thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        {/* Header: avatar + name + rating + date */}
        <div className="flex items-start gap-3">
          <Avatar
            src={review.userId.avatar?.url}
            name={review.userId.name}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-gray-900">{review.userId.name}</p>
              {review.isVerifiedPurchase && (
                <Badge variant="success" size="sm">
                  Đã mua hàng
                </Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRow rating={review.rating} />
              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
            {review.productId && (
              <p className="mt-0.5 text-xs text-gray-400">
                Sản phẩm: {review.productId.name}
              </p>
            )}
          </div>
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
        )}

        {/* Review images */}
        {review.images && review.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {review.images.map((img, idx) => (
              <AppImage
                key={idx}
                src={img.url}
                alt={`Ảnh đánh giá ${idx + 1}`}
                className="h-20 w-20 rounded-lg object-cover border border-gray-100"
              />
            ))}
          </div>
        )}

        {/* Shop reply */}
        {review.reply ? (
          <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-rose-500" />
              <p className="text-xs font-semibold text-rose-600">Phản hồi của cửa hàng</p>
              <span className="text-xs text-gray-400">
                · {formatDate(review.reply.repliedAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{review.reply.content}</p>
          </div>
        ) : (
          <div>
            {showReplyBox ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Nhập phản hồi của bạn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  autoGrow
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                    isLoading={replyMutation.isPending}
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                  >
                    Trả lời
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                onClick={() => setShowReplyBox(true)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                Trả lời đánh giá
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopReviewsPage() {
  const [page, setPage] = useState(1);
  const { data: shop, isLoading: shopLoading } = useMyShop();

  const shopId = shop?._id ?? '';
  const { data, isLoading: reviewsLoading } = useShopReviews(shopId, { page, limit: 10 });

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  const isLoading = shopLoading || (!!shopId && reviewsLoading);

  return (
    <div className="space-y-5">
      {/* Rating summary */}
      {reviews.length > 0 && <RatingSummary reviews={reviews} />}

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải đánh giá..." />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Star className="h-6 w-6 text-amber-300" />
          </div>
          <p className="text-sm font-medium text-gray-700">Chưa có đánh giá nào</p>
          <p className="text-xs text-gray-400">Đánh giá của khách hàng sẽ hiển thị tại đây</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} · {pagination.total} đánh giá
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
            >
              Trước
            </Button>
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
