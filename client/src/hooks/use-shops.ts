import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Product } from './use-products';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopImage {
  url: string;
  publicId?: string;
}

export interface Shop {
  _id: string;
  ownerId?: string;
  name: string;
  slug: string;
  description?: string;
  address: { street: string; ward: string; district: string; city: string };
  location?: { type: string; coordinates: [number, number] };
  phone: string;
  logo?: ShopImage;
  coverImage?: ShopImage;
  stats: {
    rating: number;
    totalReviews: number;
    totalOrders: number;
    totalProducts: number;
  };
  isVerified: boolean;
  isActive?: boolean;
  deliveryConfig: {
    maxDistance: number;
    baseFee: number;
    freeAboveAmount: number;
    estimatedTime: string;
  };
  operatingHours: Array<{
    day: number;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ShopFilters {
  page?: number;
  limit?: number;
  city?: string;
  isVerified?: boolean;
}

export interface ShopProductFilters {
  page?: number;
  limit?: number;
  category?: string;
}

/** Get shop logo or cover image URL */
export function getShopImageUrl(image?: ShopImage): string | null {
  return image?.url ?? null;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: (filters: ShopFilters) => [...shopKeys.lists(), filters] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (slug: string) => [...shopKeys.details(), slug] as const,
  products: (slug: string, filters: ShopProductFilters) =>
    [...shopKeys.all, 'products', slug, filters] as const,
};

const emptyPagination: ShopPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useShops(filters: ShopFilters = {}) {
  return useQuery({
    queryKey: shopKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.city) params.set('city', filters.city);
      if (filters.isVerified !== undefined) params.set('isVerified', String(filters.isVerified));
      const qs = params.toString();
      const res = await api.get<Shop[]>(`/shops${qs ? `?${qs}` : ''}`);
      return {
        shops: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
  });
}

export function useShop(slug: string) {
  return useQuery({
    queryKey: shopKeys.detail(slug),
    queryFn: async () => {
      const res = await api.get<Shop>(`/shops/${slug}`);
      return res.data ?? null;
    },
    enabled: Boolean(slug),
  });
}

export function useShopProducts(shopSlug: string, filters: ShopProductFilters = {}) {
  return useQuery({
    queryKey: shopKeys.products(shopSlug, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.category) params.set('category', filters.category);
      const qs = params.toString();
      const res = await api.get<Product[]>(`/shops/${shopSlug}/products${qs ? `?${qs}` : ''}`);
      return {
        products: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
    enabled: Boolean(shopSlug),
  });
}
