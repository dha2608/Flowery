'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | 'birthday'
  | 'anniversary'
  | 'holiday'
  | 'graduation'
  | 'wedding'
  | 'custom';

export interface ReminderSettings {
  enabled: boolean;
  daysBefore: number[];
  channels: string[];
}

export interface Event {
  _id: string;
  userId: string;
  relationshipId: { _id: string; name: string; type: string } | string;
  title: string;
  date: string;
  type: EventType;
  reminderSettings?: ReminderSettings;
  isRecurring: boolean;
  linkedOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsFilters {
  page?: number;
  limit?: number;
  upcoming?: boolean;
}

export interface PaginatedEvents {
  events: Event[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type CreateEventBody = {
  relationshipId: string;
  title: string;
  date: string;
  type: EventType;
  reminderSettings?: ReminderSettings;
  isRecurring?: boolean;
};

export type UpdateEventBody = Partial<CreateEventBody>;

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const eventsQueryKey = ['events'] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useEvents(filters: EventsFilters = {}) {
  const { page = 1, limit = 50, upcoming } = filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (upcoming === true) params.set('upcoming', 'true');

  return useQuery({
    queryKey: [...eventsQueryKey, filters],
    queryFn: async () => {
      const res = await api.get<Event[]>(`/events?${params}`);
      return {
        events: res.data ?? [],
        pagination: res.pagination,
      };
    },
  });
}

export function useUpcomingEvents(days = 30) {
  return useQuery({
    queryKey: [...eventsQueryKey, 'upcoming', days],
    queryFn: async () => {
      const res = await api.get<Event[]>(`/events/upcoming?days=${days}`);
      return res.data ?? [];
    },
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: [...eventsQueryKey, id],
    queryFn: async () => {
      const res = await api.get<Event>(`/events/${id}`);
      if (!res.data) throw new Error('Không tìm thấy sự kiện');
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEventBody) =>
      api.post<{ event: Event }>('/events', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsQueryKey }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEventBody }) =>
      api.put<{ event: Event }>(`/events/${id}`, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: eventsQueryKey });
      qc.invalidateQueries({ queryKey: [...eventsQueryKey, id] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventsQueryKey }),
  });
}
