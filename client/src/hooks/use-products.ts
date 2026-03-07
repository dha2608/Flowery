import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  shopId: { _id: string; name: string; slug: string } | string;
  flowerId?: { _id: string; name: { vi: string; en: string }; slug: string } | string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: 'single_flower' | 'bouquet' | 'arrangement' | 'basket' | 'box' | 'subscription_pack' | 'custom';
  flowerComposition?: Array<{
    flowerId: string;
    quantity: number;
    color?: string;
  }>;
  images: ProductImage[];
  customizationOptions?: Array<{
    name: string;
    type: string;
    options?: string[];
    priceModifier?: number;
  }>;
  occasions: string[];
  emotions: string[];
  stock: { quantity: number; isUnlimited: boolean };
  isAvailable: boolean;
  totalSold?: number;
  averageRating?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type ProductSortBy = 'price' | 'createdAt' | 'popularity';
export type SortOrder = 'asc' | 'desc';

export interface ProductFilters {
  page?: number;
  limit?: number;
  shopId?: string;
  category?: string;
  emotion?: string;
  occasion?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSortBy;
  order?: SortOrder;
  flowerId?: string;
  search?: string;
}

/** Get primary image URL from product images array */
export function getProductImageUrl(images: ProductImage[]): string | null {
  if (!images?.length) return null;
  const primary = images.find((img) => img.isPrimary);
  return (primary ?? images[0]).url;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

const emptyPagination: ProductPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      // If search term present, use search endpoint
      if (filters.search) {
        const params = new URLSearchParams();
        params.set('q', filters.search);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));
        const res = await api.get<Product[]>(`/products/search?${params.toString()}`);
        return {
          products: res.data ?? [],
          pagination: res.pagination ?? emptyPagination,
        };
      }

      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.shopId) params.set('shopId', filters.shopId);
      if (filters.category) params.set('category', filters.category);
      if (filters.emotion) params.set('emotion', filters.emotion);
      if (filters.occasion) params.set('occasion', filters.occasion);
      if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
      if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.order) params.set('order', filters.order);
      if (filters.flowerId) params.set('flowerId', filters.flowerId);
      const qs = params.toString();
      const res = await api.get<Product[]>(`/products${qs ? `?${qs}` : ''}`);
      return {
        products: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${slug}`);
      return res.data ?? null;
    },
    enabled: Boolean(slug),
  });
}
