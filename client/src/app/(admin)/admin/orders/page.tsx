'use client';

import { Fragment, useState, useCallback } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  XCircle,
  ArrowRightLeft,
  Package,
  MapPin,
  Phone,
  User,
  Store,
  Download,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Spinner,
  Modal,
  Textarea,
  Select,
} from '@/components/ui';
import {
  useAdminOrders,
  useAdminUpdateOrderStatus,
  useCancelOrder,
  type AdminOrder,
} from '@/hooks/use-admin';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { exportOrders } from '@/lib/export-csv';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'delivering', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
] as const;

type OrderStatus = AdminOrder['status'];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const STATUS_BADGE_VARIANT: Record<OrderStatus, 'warning' | 'info' | 'success' | 'danger'> = {
  pending: 'warning',
  confirmed: 'info',
  delivering: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

// Override "delivering" to orange — Badge accepts className for colour overrides
const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  pending: '',
  confirmed: '',
  delivering: 'bg-orange-100 text-orange-700 ring-orange-200',
  delivered: '',
  cancelled: '',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'delivering', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const PAYMENT_LABEL: Record<string, string> = {
  cod: 'Tiền mặt (COD)',
  bank_transfer: 'Chuyển khoản',
  online: 'Thanh toán online',
  momo: 'MoMo',
  vnpay: 'VNPay',
};

const LIMIT = 15;

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_BADGE_VARIANT[status]} size="sm" className={STATUS_BADGE_CLASS[status]}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function OrderDetailPanel({
  order,
  onCancel,
  onUpdateStatus,
  isCancelling,
  isUpdating,
}: {
  order: AdminOrder;
  onCancel: () => void;
  onUpdateStatus: () => void;
  isCancelling: boolean;
  isUpdating: boolean;
}) {
  const addr = order.shippingAddress;
  const addressParts = [addr?.address, addr?.district, addr?.city].filter(Boolean);
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled';

  return (
    <div className="border-t border-gray-100 bg-stone-50/60 px-6 py-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* ── Customer & Shipping ── */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <User className="h-3.5 w-3.5" />
              Khách hàng
            </h4>
            <p className="text-sm font-medium text-gray-900">{order.user?.name ?? '—'}</p>
            <p className="text-xs text-gray-500">{order.user?.email ?? '—'}</p>
            {order.user?.phone && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="h-3 w-3" />
                {order.user.phone}
              </p>
            )}
          </div>

          {addr && (
            <div className="space-y-1.5">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                <MapPin className="h-3.5 w-3.5" />
                Địa chỉ giao hàng
              </h4>
              {addr.recipientName && (
                <p className="text-sm font-medium text-gray-800">{addr.recipientName}</p>
              )}
              {addr.phone && (
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  {addr.phone}
                </p>
              )}
              {addressParts.length > 0 && (
                <p className="text-xs text-gray-600">{addressParts.join(', ')}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Order Items ── */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <Package className="h-3.5 w-3.5" />
            Sản phẩm ({order.items?.length ?? 0})
          </h4>
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800">
                    {item.product?.name ?? '—'}
                    {item.flower?.name?.vi && (
                      <span className="font-normal text-gray-400"> · {item.flower.name.vi}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <span className="whitespace-nowrap text-gray-700">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-sm font-semibold text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-rose-600">{formatPrice(order.totalAmount)}</span>
            </div>
            {order.paymentMethod && (
              <p className="mt-0.5 text-xs text-gray-400">
                Thanh toán: {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
              </p>
            )}
          </div>
        </div>

        {/* ── Info & Actions ── */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <Store className="h-3.5 w-3.5" />
              Thông tin đơn
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500">Cửa hàng</span>
                <span className="font-medium text-gray-800">{order.shop?.name ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500">Trạng thái</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500">Ngày đặt</span>
                <span className="text-gray-700">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {order.cancelReason && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <span className="font-semibold">Lý do hủy: </span>
              {order.cancelReason}
            </div>
          )}

          {order.note && (
            <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <span className="font-semibold">Ghi chú: </span>
              {order.note}
            </div>
          )}

          {!isTerminal && (
            <div className="flex flex-col gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={onUpdateStatus}
                isLoading={isUpdating}
                leftIcon={<ArrowRightLeft className="h-3.5 w-3.5" />}
                className="w-full"
              >
                Cập nhật trạng thái
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={onCancel}
                isLoading={isCancelling}
                leftIcon={<XCircle className="h-3.5 w-3.5" />}
                className="w-full"
              >
                Hủy đơn hàng
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Cancel modal
  const [cancelTarget, setCancelTarget] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Update status modal
  const [updateTarget, setUpdateTarget] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { data: res, isLoading } = useAdminOrders({
    page,
    limit: LIMIT,
    status: status || undefined,
    search: search || undefined,
  });

  const orders: AdminOrder[] = (res?.data as AdminOrder[] | undefined) ?? [];
  const pagination = res?.pagination;

  const cancelOrder = useCancelOrder();
  const updateOrderStatus = useAdminUpdateOrderStatus();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleStatusTab = (s: string) => {
    setStatus(s);
    setPage(1);
    setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openCancelModal = (order: AdminOrder) => {
    setCancelTarget(order);
    setCancelReason('');
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelOrder.mutate(
      { id: cancelTarget._id, reason: cancelReason },
      { onSuccess: () => setCancelTarget(null) }
    );
  };

  const openUpdateModal = (order: AdminOrder) => {
    setUpdateTarget(order);
    setNewStatus(order.status);
  };

  const handleUpdateStatus = () => {
    if (!updateTarget || !newStatus) return;
    updateOrderStatus.mutate(
      { id: updateTarget._id, status: newStatus },
      { onSuccess: () => setUpdateTarget(null) }
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Filters ── */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo mã đơn, tên khách..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-72"
              />
              <Button size="sm" onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />}>
                Tìm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportOrders(orders)}
                disabled={isLoading || orders.length === 0}
              >
                <Download className="mr-1.5 h-4 w-4" />
                Xuất CSV
              </Button>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 rounded-lg bg-stone-100 p-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStatusTab(tab.key)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
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

      {/* ── Table ── */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" label="Đang tải..." />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Package className="h-10 w-10 text-gray-200" />
              <p className="text-sm text-gray-400">Không tìm thấy đơn hàng nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Mã đơn</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Khách hàng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Cửa hàng</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Tổng tiền</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Ngày đặt</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const isExpanded = expandedId === order._id;
                    return (
                      <Fragment key={order._id}>
                        <tr
                          onClick={() => toggleExpand(order._id)}
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-stone-50/70',
                            isExpanded && 'bg-stone-50'
                          )}
                        >
                          {/* Order number */}
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-stone-700">
                              #{order.orderNumber}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{order.user?.name ?? '—'}</p>
                            <p className="text-xs text-gray-400">{order.user?.email ?? '—'}</p>
                          </td>

                          {/* Shop */}
                          <td className="px-4 py-3 text-gray-600">
                            {order.shop?.name ?? <span className="text-gray-300">—</span>}
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3 text-right font-semibold text-gray-800">
                            {formatPrice(order.totalAmount)}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={order.status} />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>

                          {/* Expand toggle */}
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </span>
                          </td>
                        </tr>

                        {/* Inline detail panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="p-0">
                              <OrderDetailPanel
                                order={order}
                                onCancel={() => openCancelModal(order)}
                                onUpdateStatus={() => openUpdateModal(order)}
                                isCancelling={
                                  cancelOrder.isPending && cancelOrder.variables?.id === order._id
                                }
                                isUpdating={
                                  updateOrderStatus.isPending &&
                                  updateOrderStatus.variables?.id === order._id
                                }
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} &bull;{' '}
            {pagination.total.toLocaleString('vi-VN')} đơn hàng
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

      {/* ── Cancel modal ── */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Hủy đơn hàng"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Hủy đơn hàng{' '}
            <span className="font-mono font-semibold text-gray-900">
              #{cancelTarget?.orderNumber}
            </span>
            . Vui lòng nhập lý do để thông báo cho khách hàng.
          </p>
          <Textarea
            placeholder="Nhập lý do hủy đơn..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setCancelTarget(null)}>
              Đóng
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={cancelOrder.isPending}
              disabled={!cancelReason.trim()}
            >
              Xác nhận hủy
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Update status modal ── */}
      <Modal
        isOpen={!!updateTarget}
        onClose={() => setUpdateTarget(null)}
        title="Cập nhật trạng thái đơn"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Đơn hàng{' '}
            <span className="font-mono font-semibold text-gray-900">
              #{updateTarget?.orderNumber}
            </span>
          </p>
          <Select
            label="Trạng thái mới"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setUpdateTarget(null)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStatus}
              isLoading={updateOrderStatus.isPending}
              disabled={!newStatus || newStatus === updateTarget?.status}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
