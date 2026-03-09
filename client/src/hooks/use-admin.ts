'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminStatsOverview {
  totalUsers: number;
  totalShops: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminStatsToday {
  newUsers: number;
  newOrders: number;
  revenue: number;
  newShops: number;
}

export interface AdminTopShop {
  _id: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

export interface AdminRecentOrder {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string };
  shop: { _id: string; name: string };
  amount: number;
  status: string;
  createdAt: string;
}

export interface AdminStats {
  overview: AdminStatsOverview;
  today: AdminStatsToday;
  topShops: AdminTopShop[];
  recentOrders: AdminRecentOrder[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'shop_owner' | 'admin';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  avatar?: { url: string };
  ordersCount?: number;
  reviewsCount?: number;
  relationshipsCount?: number;
}

export interface AdminShopAddress {
  street?: string;
  district?: string;
  city?: string;
  province?: string;
}

export interface AdminShopOperatingHours {
  dayOfWeek: number;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface AdminShopDeliveryConfig {
  isDeliveryEnabled: boolean;
  deliveryRadius?: number;
  minimumOrderAmount?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
}

export interface AdminShopBankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface AdminShop {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  phone?: string;
  address?: AdminShopAddress;
  businessLicense?: string;
  logo?: { url: string };
  coverImage?: { url: string };
  rating?: number;
  totalOrders?: number;
  operatingHours?: AdminShopOperatingHours[];
  deliveryConfig?: AdminShopDeliveryConfig;
  bankAccount?: AdminShopBankAccount;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminFlowerImage {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface AdminFlower {
  _id: string;
  name: { vi: string; en: string };
  scientificName?: string;
  slug: string;
  description: { vi: string; en: string };
  meanings: string[];
  colors: string[];
  seasons: ('spring' | 'summer' | 'autumn' | 'winter' | 'all_year')[];
  images: AdminFlowerImage[];
  careInstructions?: { vi: string; en: string };
  culturalSignificance?: { vi: string; en: string };
  popularityScore: number;
  isAvailable: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminFlowerInput {
  name: { vi: string; en: string };
  scientificName?: string;
  slug: string;
  description: { vi: string; en: string };
  meanings?: string[];
  colors: string[];
  seasons?: string[];
  images?: AdminFlowerImage[];
  careInstructions?: { vi: string; en: string };
  culturalSignificance?: { vi: string; en: string };
  popularityScore?: number;
  isAvailable?: boolean;
  tags?: string[];
}

export interface AdminFlowersParams {
  page?: number;
  limit?: number;
  search?: string;
  color?: string;
  season?: string;
  isAvailable?: boolean;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export interface AdminShopsParams {
  page?: number;
  limit?: number;
  status?: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => ['admin', 'stats'] as const,
  users: (params: AdminUsersParams = {}) => ['admin', 'users', params] as const,
  user: (id: string) => ['admin', 'users', id] as const,
  shops: (params: AdminShopsParams = {}) => ['admin', 'shops', params] as const,
  shop: (id: string) => ['admin', 'shops', id] as const,
  flowers: (params: AdminFlowersParams = {}) => ['admin', 'flowers', params] as const,
  flower: (id: string) => ['admin', 'flowers', id] as const,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildQs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => api.get<AdminStats>('/admin/stats'),
  });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () =>
      api.get<AdminUser[]>(
        `/admin/users${buildQs({ page: params.page, limit: params.limit, role: params.role, search: params.search })}`
      ),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => api.get<AdminUser>(`/admin/users/${id}`),
    enabled: !!id,
  });
}

// ─── Shops ────────────────────────────────────────────────────────────────────

export function useAdminShops(params: AdminShopsParams = {}) {
  return useQuery({
    queryKey: adminKeys.shops(params),
    queryFn: () =>
      api.get<AdminShop[]>(
        `/admin/shops${buildQs({ page: params.page, limit: params.limit, status: params.status })}`
      ),
  });
}

export function useAdminShop(id: string) {
  return useQuery({
    queryKey: adminKeys.shop(id),
    queryFn: () => api.get<AdminShop>(`/admin/shops/${id}`),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useVerifyShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put<AdminShop>(`/admin/shops/${id}/verify`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'shops'] });
    },
  });
}

export function useRejectShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.put<AdminShop>(`/admin/shops/${id}/reject`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'shops'] });
    },
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put<AdminUser>(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ─── Flowers ──────────────────────────────────────────────────────────────────

export function useAdminFlowers(params: AdminFlowersParams = {}) {
  return useQuery({
    queryKey: adminKeys.flowers(params),
    queryFn: () =>
      api.get<AdminFlower[]>(
        `/admin/flowers${buildQs({
          page: params.page,
          limit: params.limit,
          search: params.search,
          color: params.color,
          season: params.season,
          isAvailable: params.isAvailable !== undefined ? String(params.isAvailable) : undefined,
        })}`
      ),
  });
}

export function useAdminFlower(id: string) {
  return useQuery({
    queryKey: adminKeys.flower(id),
    queryFn: () => api.get<AdminFlower>(`/admin/flowers/${id}`),
    enabled: !!id,
  });
}

export function useCreateFlower() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminFlowerInput) => api.post<AdminFlower>('/admin/flowers', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'flowers'] });
    },
  });
}

export function useUpdateFlower() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminFlowerInput> }) =>
      api.put<AdminFlower>(`/admin/flowers/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'flowers'] });
    },
  });
}

export function useToggleFlowerAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put<AdminFlower>(`/admin/flowers/${id}/availability`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'flowers'] });
    },
  });
}

export function useDeleteFlower() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/admin/flowers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'flowers'] });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface AdminReview {
  _id: string;
  user: { _id: string; name: string; avatar?: { url: string } };
  product?: { _id: string; name: string };
  shop?: { _id: string; name: string };
  rating: number;
  comment: string;
  images?: { url: string }[];
  isHidden: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminReviewsParams {
  page?: number;
  limit?: number;
  status?: string; // 'published' | 'hidden'
  search?: string;
}

export function useAdminReviews(params: AdminReviewsParams = {}) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () =>
      api.get<AdminReview[]>(
        `/admin/reviews${buildQs({ page: params.page, limit: params.limit, status: params.status, search: params.search })}`
      ),
  });
}

export function useToggleReviewVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
      api.put<AdminReview>(`/admin/reviews/${id}/visibility`, { isHidden }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/admin/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface AdminOrderItem {
  product: { _id: string; name: string };
  flower?: { _id: string; name: { vi: string } };
  quantity: number;
  price: number;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string; phone?: string };
  shop: { _id: string; name: string };
  items: AdminOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
  shippingAddress?: {
    recipientName?: string;
    phone?: string;
    address?: string;
    district?: string;
    city?: string;
  };
  paymentMethod?: string;
  note?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useAdminOrders(params: AdminOrdersParams = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () =>
      api.get<AdminOrder[]>(
        `/admin/orders${buildQs({ page: params.page, limit: params.limit, status: params.status, search: params.search })}`
      ),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => api.get<AdminOrder>(`/admin/orders/${id}`),
    enabled: !!id,
  });
}

export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put<AdminOrder>(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.put<AdminOrder>(`/admin/orders/${id}/cancel`, { cancelReason: reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}
