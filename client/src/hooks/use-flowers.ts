import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlowerImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
}

export interface Flower {
  _id: string;
  name: { vi: string; en: string };
  scientificName?: string;
  slug: string;
  description?: { vi: string; en: string };
  meanings: string[];
  colors: string[];
  seasons: string[];
  images: FlowerImage[];
  careInstructions?: { vi: string; en: string };
  culturalSignificance?: { vi: string; en: string };
  popularityScore: number;
  isAvailable: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FlowerMeaning {
  _id: string;
  flowerId: string;
  emotion: string;
  occasion: string;
  relationship: string;
  culturalContext: string;
  aiWeight: number;
  usageCount: number;
  isActive: boolean;
}

export interface FlowerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type FlowerSortBy = 'popularityScore' | 'name' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FlowerFilters {
  page?: number;
  limit?: number;
  emotion?: string;
  occasion?: string;
  color?: string;
  season?: string;
  search?: string;
  sortBy?: FlowerSortBy;
  order?: SortOrder;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get primary image URL from flower images array */
export function getFlowerImageUrl(images: FlowerImage[]): string | null {
  if (!images?.length) return null;
  const primary = images.find((img) => img.isPrimary);
  return (primary ?? images[0]).url;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const flowerKeys = {
  all: ['flowers'] as const,
  lists: () => [...flowerKeys.all, 'list'] as const,
  list: (filters: FlowerFilters) => [...flowerKeys.lists(), filters] as const,
  search: (q: string) => [...flowerKeys.all, 'search', q] as const,
  details: () => [...flowerKeys.all, 'detail'] as const,
  detail: (slug: string) => [...flowerKeys.details(), slug] as const,
  byEmotion: (emotion: string) => [...flowerKeys.all, 'by-emotion', emotion] as const,
  byOccasion: (occasion: string) => [...flowerKeys.all, 'by-occasion', occasion] as const,
  meanings: (flowerId: string) => [...flowerKeys.all, 'meanings', flowerId] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

const emptyPagination: FlowerPagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

export function useFlowers(filters: FlowerFilters = {}) {
  return useQuery({
    queryKey: flowerKeys.list(filters),
    queryFn: async () => {
      // If search term present, use dedicated search endpoint
      if (filters.search) {
        const params = new URLSearchParams();
        params.set('q', filters.search);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));
        const res = await api.get<Flower[]>(`/flowers/search?${params.toString()}`);
        return {
          flowers: res.data ?? [],
          pagination: res.pagination ?? emptyPagination,
        };
      }

      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.emotion) params.set('emotion', filters.emotion);
      if (filters.occasion) params.set('occasion', filters.occasion);
      if (filters.color) params.set('color', filters.color);
      if (filters.season) params.set('season', filters.season);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.order) params.set('order', filters.order);
      const qs = params.toString();
      const res = await api.get<Flower[]>(`/flowers${qs ? `?${qs}` : ''}`);
      return {
        flowers: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
  });
}

export function useFlower(slug: string) {
  return useQuery({
    queryKey: flowerKeys.detail(slug),
    queryFn: async () => {
      const res = await api.get<Flower>(`/flowers/${slug}`);
      return res.data ?? null;
    },
    enabled: Boolean(slug),
  });
}

export function useFlowersByEmotion(emotion: string) {
  return useQuery({
    queryKey: flowerKeys.byEmotion(emotion),
    queryFn: async () => {
      const res = await api.get<Flower[]>(`/flowers/emotions/${emotion}`);
      return {
        flowers: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
    enabled: Boolean(emotion),
  });
}

export function useFlowersByOccasion(occasion: string) {
  return useQuery({
    queryKey: flowerKeys.byOccasion(occasion),
    queryFn: async () => {
      const res = await api.get<Flower[]>(`/flowers/occasions/${occasion}`);
      return {
        flowers: res.data ?? [],
        pagination: res.pagination ?? emptyPagination,
      };
    },
    enabled: Boolean(occasion),
  });
}

export function useFlowerMeanings(flowerId: string) {
  return useQuery({
    queryKey: flowerKeys.meanings(flowerId),
    queryFn: async () => {
      const res = await api.get<FlowerMeaning[]>(`/flowers/${flowerId}/meanings`);
      return res.data ?? [];
    },
    enabled: Boolean(flowerId),
  });
}
