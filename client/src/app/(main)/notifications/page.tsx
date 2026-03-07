'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Bell,
  BellOff,
  CheckCheck,
  Package,
  Calendar,
  Sparkles,
  Tag,
  Star,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  type NotificationType,
} from '@/hooks/use-notifications';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge, Card, CardContent, Spinner, Button } from '@/components/ui';
import { Container } from '@/components/layout';

// ─── Config ───────────────────────────────────────────────────────────────────

const NOTIFICATION_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  order_status: {
    icon: <Package className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-700',
    label: 'Đơn hàng',
  },
  event_reminder: {
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-700',
    label: 'Sự kiện',
  },
  ai_suggestion: {
    icon: <Sparkles className="h-4 w-4" />,
    color: 'bg-primary-100 text-primary-700',
    label: 'Gợi ý AI',
  },
  promo: {
    icon: <Tag className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-700',
    label: 'Khuyến mãi',
  },
  review_request: {
    icon: <Star className="h-4 w-4" />,
    color: 'bg-orange-100 text-orange-700',
    label: 'Đánh giá',
  },
  system: {
    icon: <Bell className="h-4 w-4" />,
    color: 'bg-stone-100 text-stone-700',
    label: 'Hệ thống',
  },
  subscription_renewal: {
    icon: <RefreshCw className="h-4 w-4" />,
    color: 'bg-green-100 text-green-700',
    label: 'Đăng ký',
  },
  shop_reply: {
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-teal-100 text-teal-700',
    label: 'Shop trả lời',
  },
};

const FILTER_TABS: Array<{ label: string; value: NotificationType | '' }> = [
  { label: 'Tất cả', value: '' },
  { label: 'Đơn hàng', value: 'order_status' },
  { label: 'Sự kiện', value: 'event_reminder' },
  { label: 'Khuyến mãi', value: 'promo' },
  { label: 'Hệ thống', value: 'system' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(dateStr);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth();
  const [activeType, setActiveType] = useState<NotificationType | ''>('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading, isError } = useNotifications({
    type: activeType || undefined,
    page,
    limit: 10,
  });

  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = response?.notifications ?? [];
  const pagination = response?.pagination;
  const unreadCount = response?.unreadCount ?? 0;

  // ── Event handlers ──────────────────────────────────────────────────────────

  function handleTabChange(value: NotificationType | '') {
    setActiveType(value);
    setPage(1);
  }

  async function handleNotificationClick(id: string, actionUrl?: string) {
    await markAsRead.mutateAsync(id);
    if (actionUrl) {
      router.push(actionUrl);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    await deleteNotification.mutateAsync(id);
  }

  async function handleMarkAllAsRead() {
    await markAllAsRead.mutateAsync();
  }

  // ── Auth loading ────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Spinner size="lg" label="Đang tải..." />
      </Container>
    );
  }

  return (
    <Container className="py-8 pb-16">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <Bell className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900">Thông báo</h1>
            {unreadCount > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex items-center gap-2"
          >
            {markAllAsRead.isPending ? (
              <Spinner size="sm" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* ── Filter tabs — underline style ───────────────────────────────────── */}
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-stone-200">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              'flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
              activeType === tab.value
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải thông báo..." />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-red-600">Không thể tải thông báo. Vui lòng thử lại.</p>
        </div>
      ) : notifications.length === 0 ? (
        /* ── Empty state ─────────────────────────────────────────────────── */
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="rounded-full bg-stone-100 p-10">
            <BellOff className="h-12 w-12 text-stone-300" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Không có thông báo nào</h3>
            <p className="mt-1 text-sm text-stone-500">
              {activeType
                ? 'Thử xem thông báo ở danh mục khác.'
                : 'Khi có thông báo mới, chúng sẽ xuất hiện ở đây.'}
            </p>
          </div>
        </div>
      ) : (
        /* ── Notification list ────────────────────────────────────────────── */
        <div className="space-y-2">
          {notifications.map((notification) => {
            const config = NOTIFICATION_CONFIG[notification.type] ?? {
              icon: <Bell className="h-4 w-4" />,
              color: 'bg-stone-100 text-stone-700',
              label: notification.type,
            };
            const actionUrl = notification.data?.actionUrl;

            return (
              <Card
                key={notification._id}
                hoverable
                onClick={() => handleNotificationClick(notification._id, actionUrl)}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-sm',
                  !notification.isRead && 'border-l-4 border-l-primary-400 bg-primary-50/30',
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* ── Type icon ──────────────────────────────────────── */}
                    <div
                      className={cn(
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
                        config.color,
                      )}
                    >
                      {config.icon}
                    </div>

                    {/* ── Body ───────────────────────────────────────────── */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            notification.isRead ? 'text-stone-700' : 'text-stone-900',
                          )}
                        >
                          {notification.title}
                        </span>
                        <Badge
                          variant="default"
                          className={cn('text-xs', config.color)}
                        >
                          {config.label}
                        </Badge>
                      </div>

                      <p
                        className={cn(
                          'text-sm leading-relaxed',
                          notification.isRead ? 'text-stone-500' : 'text-stone-700',
                        )}
                      >
                        {notification.message}
                      </p>

                      <p className="text-xs text-stone-400">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {/* ── Right side ─────────────────────────────────────── */}
                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      {/* Unread dot */}
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary-500" />
                      )}

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(e, notification._id)}
                        disabled={deleteNotification.isPending}
                        aria-label="Xóa thông báo"
                        className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Trước
          </button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-stone-200 text-stone-700 hover:bg-stone-50',
                  )}
                >
                  {p}
                </button>
              ))}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {pagination && pagination.total > 0 && (
        <p className="mt-4 text-center text-xs text-stone-400">
          Hiển thị {notifications.length} / {pagination.total} thông báo
        </p>
      )}
    </Container>
  );
}
