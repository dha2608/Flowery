'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Shop } from './use-shops';
import type { Product } from './use-products';
import type { Order, OrderStatus } from './use-orders';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
  todayOrders: number;
}

export interface ShopReview {
  _id: string;
  userId: { _id: string; name: string; avatar?: { url: string } };
  shopId: string;
  productId?: { _id: string; name: string };
  orderId?: string;
  rating: number;
  comment: string;
  images?: Array<{ url: string }>;
  reply?: { content: string; repliedAt: string };
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

/** Filters for the shop-owner product list (distinct from ShopProductFilters in use-shops) */
export interface ShopMgmtProductFilters {
  page?: number;
  limit?: number;
  category?: string;
}

export interface ShopReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: string;
  flowerComposition?: Array<{
    flowerId: string;
    quantity: number;
    color?: string;
  }>;
  images: Array<{ url: string; isPrimary: boolean }>;
  customizationOptions?: Array<{
    name: string;
    type: string;
    options?: string[];
    priceModifier?: number;
  }>;
  occasions: string[];
  emotions: string[];
  stock: { quantity: number; isUnlimited: boolean };
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface UpdateShopPayload {
  name?: string;
  description?: string;
  phone?: string;
  address?: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  deliveryConfig?: {
    maxDistance: number;
    baseFee: number;
    freeAboveAmount: number;
    estimatedTime: string;
  };
  operatingHours?: Array<{
    day: number;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const shopManagementKeys = {
  all: ['shop-management'] as const,
  myShop: () => [...shopManagementKeys.all, 'my-shop'] as const,
  stats: () => [...shopManagementKeys.all, 'stats'] as const,
  orders: (filters: ShopOrderFilters) =>
    [...shopManagementKeys.all, 'orders', filters] as const,
  products: (filters: ShopMgmtProductFilters) =>
    [...shopManagementKeys.all, 'products', filters] as const,
  reviews: (shopId: string, filters: ShopReviewFilters) =>
    [...shopManagementKeys.all, 'reviews', shopId, filters] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useMyShop() {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: shopManagementKeys.myShop(),
    queryFn: async () => {
      const res = await api.get<Shop>('/shops/my-shop', accessToken ?? undefined);
      return res.data ?? null;
    },
    enabled: !!accessToken,
  });
}

export function useShopStats() {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: shopManagementKeys.stats(),
    queryFn: async (): Promise<ShopStats> => {
      const token = accessToken ?? undefined;
      const [shopRes, pendingRes] = await Promise.all([
        api.get<Shop>('/shops/my-shop', token),
        api.get<Order[]>('/orders?status=pending&limit=1', token),
      ]);
      const shop = shopRes.data;
      return {
        totalProducts: shop?.stats.totalProducts ?? 0,
        totalOrders: shop?.stats.totalOrders ?? 0,
        totalRevenue: 0, // Requires a dedicated revenue endpoint
        averageRating: shop?.stats.rating ?? 0,
        pendingOrders: pendingRes.pagination?.total ?? 0,
        todayOrders: 0,
      };
    },
    enabled: !!accessToken,
  });
}

export function useShopOrders(filters: ShopOrderFilters = {}) {
  const { accessToken } = useAuthStore();
  const { page = 1, limit = 10, status } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);

  return useQuery({
    queryKey: shopManagementKeys.orders(filters),
    queryFn: async () => {
      const res = await api.get<Order[]>(
        `/orders?${params.toString()}`,
        accessToken ?? undefined,
      );
      return { orders: res.data ?? [], pagination: res.pagination };
    },
    enabled: !!accessToken,
  });
}

/** Fetch products owned by the authenticated shop owner */
export function useMyShopProducts(filters: ShopMgmtProductFilters = {}) {
  const { accessToken } = useAuthStore();
  const { page = 1, limit = 12, category } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set('category', category);

  return useQuery({
    queryKey: shopManagementKeys.products(filters),
    queryFn: async () => {
      const res = await api.get<Product[]>(
        `/products?${params.toString()}`,
        accessToken ?? undefined,
      );
      return { products: res.data ?? [], pagination: res.pagination };
    },
    enabled: !!accessToken,
  });
}

export function useShopReviews(shopId: string, filters: ShopReviewFilters = {}) {
  const { accessToken } = useAuthStore();
  const { page = 1, limit = 10, rating } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (rating) params.set('rating', String(rating));

  return useQuery({
    queryKey: shopManagementKeys.reviews(shopId, filters),
    queryFn: async () => {
      const res = await api.get<ShopReview[]>(
        `/reviews/shop/${shopId}?${params.toString()}`,
        accessToken ?? undefined,
      );
      return { reviews: res.data ?? [], pagination: res.pagination };
    },
    enabled: !!shopId && !!accessToken,
  });
}

export function useUpdateShop() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateShopPayload) => {
      const res = await api.put<Shop>('/shops/my-shop', payload, accessToken ?? undefined);
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopManagementKeys.myShop() });
      queryClient.invalidateQueries({ queryKey: shopManagementKeys.stats() });
    },
  });
}

export function useCreateProduct() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const res = await api.post<Product>('/products', payload, accessToken ?? undefined);
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...shopManagementKeys.all, 'products'] });
      queryClient.invalidateQueries({ queryKey: shopManagementKeys.stats() });
    },
  });
}

export function useUpdateProduct() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
      const res = await api.put<Product>(`/products/${id}`, payload, accessToken ?? undefined);
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...shopManagementKeys.all, 'products'] });
    },
  });
}

export function useDeleteProduct() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`, accessToken ?? undefined);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...shopManagementKeys.all, 'products'] });
      queryClient.invalidateQueries({ queryKey: shopManagementKeys.stats() });
    },
  });
}

export function useUpdateOrderStatus() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
    }) => {
      const res = await api.put<Order>(
        `/orders/${id}/status`,
        { status, note },
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...shopManagementKeys.all, 'orders'] });
    },
  });
}

export function useReplyReview() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await api.post<ShopReview>(
        `/reviews/${id}/reply`,
        { content },
        accessToken ?? undefined,
      );
      return res.data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...shopManagementKeys.all, 'reviews'] });
    },
  });
}
