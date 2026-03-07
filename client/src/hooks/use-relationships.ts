'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RelationshipType = 'family' | 'friend' | 'lover' | 'colleague' | 'other';

export interface ImportantDate {
  title: string;
  date: string;
}

export interface FlowerPreferences {
  favoriteColors: string[];
  favoriteFlowers: string[];
  dislikedFlowers: string[];
  allergies: string[];
}

export interface Relationship {
  _id: string;
  userId: string;
  name: string;
  type: RelationshipType;
  birthday?: string;
  importantDates?: ImportantDate[];
  flowerPreferences?: FlowerPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipsFilters {
  page?: number;
  limit?: number;
  type?: RelationshipType | '';
}

export interface PaginatedRelationships {
  relationships: Relationship[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type CreateRelationshipBody = {
  name: string;
  type: RelationshipType;
  birthday?: string;
  importantDates?: ImportantDate[];
  flowerPreferences?: Partial<FlowerPreferences>;
};

export type UpdateRelationshipBody = Partial<CreateRelationshipBody>;

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const relationshipsQueryKey = ['relationships'] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useRelationships(filters: RelationshipsFilters = {}) {
  const { page = 1, limit = 50, type = '' } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) params.set('type', type);

  return useQuery({
    queryKey: [...relationshipsQueryKey, filters],
    queryFn: async () => {
      const res = await api.get<Relationship[]>(`/relationships?${params}`);
      return {
        relationships: res.data ?? [],
        pagination: res.pagination,
      };
    },
  });
}

export function useRelationship(id: string | undefined) {
  return useQuery({
    queryKey: [...relationshipsQueryKey, id],
    queryFn: async () => {
      const res = await api.get<Relationship>(`/relationships/${id}`);
      if (!res.data) throw new Error('Không tìm thấy mối quan hệ');
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRelationshipBody) =>
      api.post<{ relationship: Relationship }>('/relationships', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: relationshipsQueryKey }),
  });
}

export function useUpdateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRelationshipBody }) =>
      api.put<{ relationship: Relationship }>(`/relationships/${id}`, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: relationshipsQueryKey });
      qc.invalidateQueries({ queryKey: [...relationshipsQueryKey, id] });
    },
  });
}

export function useDeleteRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/relationships/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: relationshipsQueryKey }),
  });
}
