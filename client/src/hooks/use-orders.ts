import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'zalopay' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  customizations?: Record<string, string>;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  shopId: { _id: string; name: string; slug: string };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    totalAmount: number;
  };
  status: OrderStatus;
  deliveryAddress: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  deliveryDate: string;
  giftMessage?: string;
  isAnonymous: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shopId: string;
  items: Array<{
    productId: string;
    quantity: number;
    customizations?: Array<{ name: string; selected: string }>;
  }>;
  deliveryAddress: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  deliveryDate: string;
  giftMessage?: string;
  isAnonymous?: boolean;
  paymentMethod: PaymentMethod;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useCreateOrder() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await api.post<Order>('/orders', payload, accessToken ?? undefined);
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrders(filters: OrderFilters = {}) {
  const { accessToken } = useAuthStore();
  const { page = 1, limit = 10, status } = filters;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);

  return useQuery({
    queryKey: ['orders', { page, limit, status }],
    queryFn: async () => {
      const res = await api.get<Order[]>(`/orders?${params.toString()}`, accessToken ?? undefined);
      return {
        orders: res.data ?? [],
        pagination: res.pagination,
      };
    },
  });
}

export function useOrder(id: string) {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await api.get<Order>(`/orders/${id}`, accessToken ?? undefined);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await api.post<Order>(
        `/orders/${id}/cancel`,
        { reason },
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
}

export function useOrderTracking(id: string) {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['orders', id, 'tracking'],
    queryFn: async () => {
      const res = await api.get<Array<{ status: string; timestamp: string; note?: string }>>(
        `/orders/${id}/tracking`,
        accessToken ?? undefined,
      );
      return res.data ?? [];
    },
    enabled: !!id,
  });
}
