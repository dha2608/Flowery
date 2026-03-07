import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionPlanType = 'weekly' | 'biweekly' | 'monthly';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type SubscriptionPaymentMethod = 'vnpay' | 'momo' | 'zalopay' | 'bank_transfer';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

export interface SubscriptionPreferences {
  budget: { min: number; max: number };
  emotions: string[];
  colors: string[];
  excludeFlowers: string[];
  notes?: string;
}

export interface SubscriptionDeliveryAddress {
  recipientName: string;
  recipientPhone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  shopId:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
        logo?: { url: string; publicId?: string };
        address?: string;
        phone?: string;
        deliveryConfig?: unknown;
      };
  planType: SubscriptionPlanType;
  preferences: SubscriptionPreferences;
  deliveryAddress: SubscriptionDeliveryAddress;
  nextDeliveryDate: string;
  status: SubscriptionStatus;
  paymentMethod: string;
  totalDeliveries: number;
  pausedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPayload {
  shopId: string;
  planType: SubscriptionPlanType;
  preferences: SubscriptionPreferences;
  deliveryAddress: SubscriptionDeliveryAddress;
  paymentMethod: SubscriptionPaymentMethod;
}

export interface UpdateSubscriptionPayload {
  planType?: SubscriptionPlanType;
  preferences?: Partial<SubscriptionPreferences>;
  deliveryAddress?: Partial<SubscriptionDeliveryAddress>;
  paymentMethod?: SubscriptionPaymentMethod;
}

export interface SubscriptionFilters {
  page?: number;
  limit?: number;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: SubscriptionFilters) => [...subscriptionKeys.lists(), filters] as const,
  me: () => [...subscriptionKeys.all, 'me'] as const,
  detail: (id: string) => [...subscriptionKeys.all, id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** GET /subscriptions/plans — public, no auth required */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: async () => {
      const res = await api.get<SubscriptionPlan[]>('/subscriptions/plans');
      return res.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // plans rarely change
  });
}

/** GET /subscriptions?page&limit — paginated list (auth) */
export function useSubscriptions(filters: SubscriptionFilters = {}) {
  const { accessToken } = useAuthStore();
  const { page = 1, limit = 10 } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: async () => {
      const res = await api.get<Subscription[]>(
        `/subscriptions?${params.toString()}`,
        accessToken ?? undefined,
      );
      return {
        subscriptions: res.data ?? [],
        pagination: res.pagination,
      };
    },
  });
}

/** GET /subscriptions/me — active subscriptions only (auth) */
export function useMySubscriptions() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: subscriptionKeys.me(),
    queryFn: async () => {
      const res = await api.get<Subscription[]>(
        '/subscriptions/me',
        accessToken ?? undefined,
      );
      return res.data ?? [];
    },
  });
}

/** GET /subscriptions/:id — single subscription detail (auth) */
export function useSubscription(id: string) {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: async () => {
      const res = await api.get<Subscription>(
        `/subscriptions/${id}`,
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

/** POST /subscriptions — create a new subscription (auth) */
export function useCreateSubscription() {
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSubscriptionPayload) => {
      const res = await api.post<Subscription>(
        '/subscriptions',
        payload,
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
}

/** PUT /subscriptions/:id — update subscription (auth) */
export function useUpdateSubscription() {
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionPayload;
    }) => {
      const res = await api.put<Subscription>(
        `/subscriptions/${id}`,
        payload,
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

/** POST /subscriptions/:id/pause (auth) */
export function usePauseSubscription() {
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<Subscription>(
        `/subscriptions/${id}/pause`,
        {},
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

/** POST /subscriptions/:id/resume (auth) */
export function useResumeSubscription() {
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<Subscription>(
        `/subscriptions/${id}/resume`,
        {},
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

/** POST /subscriptions/:id/cancel — with optional reason (auth) */
export function useCancelSubscription() {
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await api.post<Subscription>(
        `/subscriptions/${id}/cancel`,
        { reason },
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.all });
      qc.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}
