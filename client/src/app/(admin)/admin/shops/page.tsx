'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { Card, CardContent, Badge, Button, Spinner, Modal, Textarea } from '@/components/ui';
import { useAdminShops, useVerifyShop, useRejectShop, type AdminShop } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'verified', label: 'Đã xác minh' },
  { key: 'rejected', label: 'Từ chối' },
] as const;

const STATUS_BADGE: Record<AdminShop['status'], 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
};

const STATUS_LABEL: Record<AdminShop['status'], string> = {
  pending: 'Chờ duyệt',
  verified: 'Đã xác minh',
  rejected: 'Từ chối',
};

const LIMIT = 15;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminShopsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<AdminShop | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: res, isLoading } = useAdminShops({
    page,
    limit: LIMIT,
    status: status || undefined,
  });
  const shops: AdminShop[] = (res?.data as AdminShop[] | undefined) ?? [];
  const pagination = res?.pagination;

  const verifyShop = useVerifyShop();
  const rejectShop = useRejectShop();

  const handleVerify = (shop: AdminShop) => {
    verifyShop.mutate(shop._id);
  };

  const openRejectModal = (shop: AdminShop) => {
    setRejectTarget(shop);
    setRejectReason('');
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    rejectShop.mutate(
      { id: rejectTarget._id, reason: rejectReason },
      { onSuccess: () => setRejectTarget(null) }
    );
  };

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Status tabs */}
      <Card>
        <CardContent className="py-4">
          <div className="flex w-fit gap-1 rounded-lg bg-stone-100 p-1">
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
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" label="Đang tải..." />
            </div>
          ) : shops.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Không có cửa hàng nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Cửa hàng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Chủ shop</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Điện thoại</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Thành phố</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Đánh giá</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Đơn hàng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shops.map((shop) => (
                    <tr key={shop._id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="max-w-[180px]">
                          <p className="truncate font-medium text-gray-900">{shop.name}</p>
                          {shop.description && (
                            <p className="truncate text-xs text-gray-400">{shop.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{shop.owner.name}</p>
                        <p className="text-xs text-gray-400">{shop.owner.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {shop.phone ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {shop.address?.city ? (
                          <span className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {shop.address.city}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {shop.rating != null ? (
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {shop.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {(shop.totalOrders ?? 0).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[shop.status]} size="sm">
                          {STATUS_LABEL[shop.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {shop.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-500 text-white hover:bg-emerald-600"
                                onClick={() => handleVerify(shop)}
                                isLoading={
                                  verifyShop.isPending && verifyShop.variables === shop._id
                                }
                                leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
                              >
                                Xác minh
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => openRejectModal(shop)}
                                leftIcon={<XCircle className="h-3.5 w-3.5" />}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                          <Link href={`/admin/shops/${shop._id}/verify`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-stone-600 hover:bg-stone-100"
                              leftIcon={<Eye className="h-3.5 w-3.5" />}
                            >
                              Chi tiết
                            </Button>
                          </Link>
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
            {pagination.total.toLocaleString('vi-VN')} cửa hàng
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

      {/* Reject modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Từ chối cửa hàng"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Từ chối cửa hàng{' '}
            <span className="font-semibold text-gray-900">{rejectTarget?.name}</span>. Vui lòng nhập
            lý do để thông báo cho chủ shop.
          </p>
          <Textarea
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={rejectShop.isPending}>
              Từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
