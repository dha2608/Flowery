'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatPrice } from '@/lib/utils';
import { useRecommendationHistory } from '@/hooks/use-recommendations';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { AppImage } from '@/components/ui/app-image';

const OCCASION_LABELS: Record<string, string> = {
  birthday: 'Sinh nhật',
  anniversary: 'Kỷ niệm',
  holiday: 'Lễ tết',
  graduation: 'Tốt nghiệp',
  wedding: 'Đám cưới',
  apology: 'Xin lỗi',
  thanks: 'Cảm ơn',
  confession: 'Tỏ tình',
  sympathy: 'Chia buồn',
  congratulations: 'Chúc mừng',
  other: 'Khác',
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  lover: 'Người yêu',
  family: 'Gia đình',
  friend: 'Bạn bè',
  colleague: 'Đồng nghiệp',
  other: 'Khác',
};

const EMOTION_LABELS: Record<string, string> = {
  romantic: 'Lãng mạn',
  grateful: 'Biết ơn',
  joyful: 'Vui vẻ',
  sympathetic: 'Chia sẻ',
  respectful: 'Kính trọng',
  apologetic: 'Xin lỗi',
  celebratory: 'Chúc mừng',
  passionate: 'Đam mê',
  hopeful: 'Hy vọng',
  peaceful: 'Bình yên',
};

const COLOR_LABELS: Record<string, string> = {
  red: 'Đỏ',
  pink: 'Hồng',
  white: 'Trắng',
  yellow: 'Vàng',
  orange: 'Cam',
  purple: 'Tím',
  blue: 'Xanh dương',
};

export default function QuizHistoryPage() {
  const { isAuthenticated } = useRequireAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useRecommendationHistory(page);

  if (!isAuthenticated) {
    return (
      <Container className="py-20">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="heading-lg">Lịch sử quiz</h1>
          <p className="body-base mt-2">Xem lại các kết quả quiz trước đây</p>
        </div>
        <Link href="/quiz" className="btn-primary">Làm quiz mới</Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" label="Đang tải..." />
        </div>
      )}

      {error && (
        <div className="py-12 text-center">
          <p className="body-base text-red-600">Không thể tải lịch sử. Vui lòng thử lại.</p>
        </div>
      )}

      {data && data.history.length === 0 && (
        <div className="text-center py-16">
          <p className="heading-sm mb-2">Chưa có lịch sử quiz</p>
          <p className="body-base mb-6">Hãy thử quiz để nhận gợi ý hoa phù hợp với bạn</p>
          <Link href="/quiz" className="btn-primary">Thử ngay</Link>
        </div>
      )}

      {data && data.history.length > 0 && (
        <div className="space-y-4">
          {data.history.map((item) => {
            const occasion = OCCASION_LABELS[item.quiz.occasion] ?? item.quiz.occasion;
            const relationship = RELATIONSHIP_LABELS[item.quiz.relationship] ?? item.quiz.relationship;
            const emotion = EMOTION_LABELS[item.quiz.emotion] ?? item.quiz.emotion;
            const colors = item.quiz.colorPreferences
              .map(c => COLOR_LABELS[c] ?? c)
              .join(', ');

            return (
              <div key={item._id} className="card-base card-hover p-5">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-4">
                  <p className="body-sm">{formatDate(item.createdAt)}</p>
                  <p className="body-sm">{item.recommendations.length} gợi ý</p>
                </div>

                {/* Quiz input summary */}
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-stone-700">
                    <span className="text-stone-400">Dịp:</span> {occasion}
                    <span className="mx-2 text-stone-300">·</span>
                    <span className="text-stone-400">Tặng:</span> {relationship}
                    <span className="mx-2 text-stone-300">·</span>
                    <span className="text-stone-400">Cảm xúc:</span> {emotion}
                  </p>
                  {colors && (
                    <p className="text-sm text-stone-700">
                      <span className="text-stone-400">Màu:</span> {colors}
                    </p>
                  )}
                  <p className="text-sm text-stone-700">
                    <span className="text-stone-400">Ngân sách:</span>{' '}
                    {formatPrice(item.quiz.budget.min)} – {formatPrice(item.quiz.budget.max)}
                  </p>
                </div>

                {/* Product thumbnails */}
                {item.recommendations.length > 0 && (
                  <div className="border-t border-stone-100 pt-4">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {item.recommendations.slice(0, 4).map(product => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          className="flex-shrink-0 w-20 group"
                        >
                          <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 group-hover:border-stone-300 transition-colors">
                            {product.images?.[0] ? (
                              <AppImage
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="label-text text-center leading-tight px-1">Ảnh</span>
                              </div>
                            )}
                          </div>
                          <p className="body-sm mt-1 truncate">{product.name}</p>
                        </Link>
                      ))}
                      {item.recommendations.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">
                          <span className="body-sm">+{item.recommendations.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {(data.pagination?.totalPages ?? 0) > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="body-sm">
                Trang {page} / {data.pagination?.totalPages}
              </span>
              <button
                disabled={page === (data.pagination?.totalPages ?? 0)}
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
