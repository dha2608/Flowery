'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface UserPreferences {
  favoriteColors: string[];
  favoriteEmotions: string[];
  budget?: { min: number; max: number };
  allergies: string[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'shop_owner' | 'admin';
  avatar?: string;
  address?: UserAddress;
  preferences?: UserPreferences;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const profileQueryKey = ['profile'] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useProfile() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const res = await api.get<User>('/users/me');
      if (!res.data) throw new Error('Không có dữ liệu hồ sơ');
      return res.data;
    },
    enabled: !!token,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name?: string; phone?: string; address?: UserAddress }) =>
      api.put<{ user: User }>('/users/me', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      favoriteColors?: string[];
      favoriteEmotions?: string[];
      budget?: { min: number; max: number };
      allergies?: string[];
    }) => api.put<{ user: User }>('/users/me/preferences', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const token = useAuthStore.getState().accessToken;
      const res = await fetch('/api/v1/users/me/avatar', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Tải ảnh thất bại');
      return data as { success: boolean; data: { user: User } };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  });
}

// ─── Address Types ────────────────────────────────────────────────────────────

export interface Address {
  _id: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface AddressInput {
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

// ─── Address Hooks ────────────────────────────────────────────────────────────

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get<Address[]>('/users/me/addresses');
      return res.data ?? [];
    },
    enabled: !!useAuthStore.getState().accessToken,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddressInput) => {
      const res = await api.post<Address>('/users/me/addresses', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AddressInput> }) => {
      const res = await api.put<Address>(`/users/me/addresses/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/me/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/resend-verification', {});
      return res;
    },
  });
}
