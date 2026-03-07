'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'order_status'
  | 'event_reminder'
  | 'ai_suggestion'
  | 'promo'
  | 'review_request'
  | 'system'
  | 'subscription_renewal'
  | 'shop_reply';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    orderId?: string;
    eventId?: string;
    shopId?: string;
    productId?: string;
    actionUrl?: string;
  };
  channels: string[];
  isRead: boolean;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch paginated notifications with optional type/read/page/limit filters.
 * The server returns `unreadCount` alongside standard pagination fields.
 */
export function useNotifications(filters: NotificationFilters = {}) {
  const { accessToken } = useAuthStore();
  const { type, isRead, page = 1, limit = 10 } = filters;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) params.set('type', type);
  if (isRead !== undefined) params.set('isRead', String(isRead));

  return useQuery({
    queryKey: notificationKeys.list({ type, isRead, page, limit }),
    queryFn: async () => {
      const res = await api.get<Notification[]>(
        `/notifications?${params.toString()}`,
        accessToken ?? undefined,
      );
      return {
        notifications: res.data ?? [],
        pagination: res.pagination as NotificationPagination | undefined,
        // unreadCount lives alongside data/pagination in the response body
        unreadCount: ((res as unknown as Record<string, unknown>).unreadCount as number) ?? 0,
      };
    },
  });
}

/**
 * Lightweight hook for reading the unread notification count.
 * Suitable for nav badges — fetches a single record and extracts `unreadCount`.
 */
export function useUnreadCount() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const res = await api.get<Notification[]>(
        '/notifications?limit=1&isRead=false',
        accessToken ?? undefined,
      );
      return ((res as unknown as Record<string, unknown>).unreadCount as number) ?? 0;
    },
    staleTime: 30_000, // re-fetch at most every 30 s
  });
}

/** Mark a single notification as read by id. */
export function useMarkAsRead() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<Notification>(
        `/notifications/${id}/read`,
        {},
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/** Mark every unread notification as read in one request. */
export function useMarkAllAsRead() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.put<{ message: string; modifiedCount: number }>(
        '/notifications/read-all',
        {},
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/** Permanently delete a notification by id. */
export function useDeleteNotification() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{ message: string }>(
        `/notifications/${id}`,
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
