'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Download,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Spinner,
  Modal,
} from '@/components/ui';
import {
  useAdminReviews,
  useToggleReviewVisibility,
  useDeleteReview,
  type AdminReview,
} from '@/hooks/use-admin';
import { formatDate, cn } from '@/lib/utils';
import { exportReviews } from '@/lib/export-csv';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'published', label: 'Hiển thị' },
  { key: 'hidden', label: 'Đã ẩn' },
] as const;

const LIMIT = 15;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4', i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-gray-500">{rating}/5</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  const { data: res, isLoading } = useAdminReviews({
    page,
    limit: LIMIT,
    status: status || undefined,
    search: search || undefined,
  });

  const reviews: AdminReview[] = (res?.data as AdminReview[] | undefined) ?? [];
  const pagination = res?.pagination;

  const toggleVisibility = useToggleReviewVisibility();
  const deleteReview = useDeleteReview();

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setPage(1);
  };

  const handleToggleVisibility = (review: AdminReview) => {
    toggleVisibility.mutate({ id: review._id, isHidden: !review.isHidden });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteReview.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Quản lý đánh giá</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Duyệt và quản lý tất cả đánh giá trên hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportReviews(reviews)}
          disabled={isLoading || reviews.length === 0}
        >
          <Download className="mr-1.5 h-4 w-4" />
          Xuất CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên người dùng, nội dung..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-72"
              />
              <Button size="sm" onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />}>
                Tìm
              </Button>
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStatusChange(tab.key)}
                  className={cn(
                    'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
                    status === tab.key
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-800'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-base">
            Danh sách đánh giá
            {pagination && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({pagination.total.toLocaleString('vi-VN')} đánh giá)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" label="Đang tải đánh giá..." />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {search
                  ? `Không tìm thấy đánh giá nào với từ khóa "${search}"`
                  : 'Chưa có đánh giá nào.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Người dùng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Sản phẩm / Shop
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Đánh giá</th>
                    <th className="max-w-xs px-4 py-3 text-left font-medium text-gray-500">
                      Nội dung
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Ngày</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reviews.map((review) => (
                    <tr
                      key={review._id}
                      className={cn(
                        'transition-colors hover:bg-gray-50/50',
                        review.isHidden && 'opacity-60'
                      )}
                    >
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {review.user.avatar?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={review.user.avatar.url}
                              alt={review.user.name}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                              {review.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="max-w-[120px] truncate font-medium text-gray-900">
                            {review.user.name}
                          </span>
                        </div>
                      </td>

                      {/* Product / Shop */}
                      <td className="px-4 py-3">
                        {review.product ? (
                          <div>
                            <p className="max-w-[140px] truncate font-medium text-gray-800">
                              {review.product.name}
                            </p>
                            <p className="text-xs text-gray-400">Sản phẩm</p>
                          </div>
                        ) : review.shop ? (
                          <div>
                            <p className="max-w-[140px] truncate font-medium text-gray-800">
                              {review.shop.name}
                            </p>
                            <p className="text-xs text-gray-400">Cửa hàng</p>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Star rating */}
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>

                      {/* Comment */}
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-2 text-gray-600" title={review.comment}>
                          {review.comment || (
                            <span className="text-gray-300 italic">Không có nội dung</span>
                          )}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-500">{formatDate(review.createdAt)}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge variant={review.isHidden ? 'warning' : 'success'} size="sm">
                          {review.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle visibility */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(review)}
                            isLoading={
                              toggleVisibility.isPending &&
                              toggleVisibility.variables?.id === review._id
                            }
                            title={review.isHidden ? 'Hiện đánh giá' : 'Ẩn đánh giá'}
                            className={cn(
                              review.isHidden
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-amber-600 hover:bg-amber-50'
                            )}
                          >
                            {review.isHidden ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(review)}
                            className="text-red-500 hover:bg-red-50"
                            title="Xóa đánh giá"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} &bull;{' '}
            {pagination.total.toLocaleString('vi-VN')} đánh giá
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xóa đánh giá"
        size="sm"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">Người dùng</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{deleteTarget?.user.name}</p>
            {deleteTarget && (
              <>
                <div className="mt-2 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < (deleteTarget.rating ?? 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                {deleteTarget.comment && (
                  <p className="mt-1.5 line-clamp-3 text-xs text-gray-600 italic">
                    &ldquo;{deleteTarget.comment}&rdquo;
                  </p>
                )}
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteReview.isPending}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
