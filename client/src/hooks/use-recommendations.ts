'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { ProductImage, Product } from './use-products';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizInput {
  occasion: string;
  relationship: string;
  emotion: string;
  colorPreferences: string[];
  budget: { min: number; max: number };
}

export interface RecommendedProduct {
  _id: string;
  shopId: { _id: string; name: string; slug: string };
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: string;
  images: ProductImage[];
  occasions: string[];
  emotions: string[];
  matchScore?: number;
  score?: number;
}

export interface QuizResult {
  rank: number;
  matchScore: number;
  scoreBreakdown: { occasion: number; emotion: number; color: number; price: number };
  reasons: string[];
  flower: Product;
  suggestedMessage: string;
}

interface HistoryItem {
  _id: string;
  quiz: QuizInput;
  recommendations: RecommendedProduct[];
  createdAt: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

const recommendationKeys = {
  all: ['recommendations'] as const,
  personalized: () => [...recommendationKeys.all, 'personalized'] as const,
  history: (filters?: { page?: number }) => [...recommendationKeys.all, 'history', filters] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useQuizRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: QuizInput) => {
      const res = await api.post<QuizResult[]>('/recommendations/quiz', input);
      return res.data ?? [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationKeys.history() });
    },
  });
}

export function usePersonalizedRecommendations(
  limit = 10,
  type: 'all' | 'upcoming_events' | 'trending' | 'reorder' = 'all',
) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...recommendationKeys.personalized(), limit, type],
    queryFn: async () => {
      const res = await api.get<RecommendedProduct[]>(
        `/recommendations/personalized?limit=${limit}&type=${type}`
      );
      return res.data ?? [];
    },
    enabled: isAuthenticated,
  });
}

export function useRecommendationHistory(page = 1, limit = 10) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: recommendationKeys.history({ page }),
    queryFn: async () => {
      const res = await api.get<HistoryItem[]>(
        `/recommendations/history?page=${page}&limit=${limit}`
      );
      return {
        history: res.data ?? [],
        pagination: res.pagination,
      };
    },
    enabled: isAuthenticated,
  });
}
