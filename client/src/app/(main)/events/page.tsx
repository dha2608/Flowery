'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, CalendarDays, RotateCcw, Bell, Clock } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, Spinner } from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useUpcomingEvents, useEvents, type EventType, type Event } from '@/hooks/use-events';
import { formatDate, cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birthday: 'Sinh nhật',
  anniversary: 'Kỷ niệm',
  holiday: 'Lễ tết',
  graduation: 'Tốt nghiệp',
  wedding: 'Đám cưới',
  custom: 'Tùy chỉnh',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getCountdownLabel(days: number): string {
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Còn 1 ngày';
  if (days > 0) return `Còn ${days} ngày`;
  return `Đã qua ${Math.abs(days)} ngày`;
}

function getRelationshipName(rel: Event['relationshipId']): string {
  if (!rel) return '';
  return typeof rel === 'string' ? '' : rel.name;
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, showCountdown }: { event: Event; showCountdown: boolean }) {
  const days = daysUntil(event.date);
  const relName = getRelationshipName(event.relationshipId);
  const isUrgent = days >= 0 && days <= 7;
  const isPast = days < 0;

  return (
    <Link href={`/events/${event._id}`} className="group block">
      <div
        className={cn(
          'card-base card-hover h-full transition-all',
          isUrgent && !isPast && 'border-orange-200 bg-orange-50/30',
        )}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-medium">
                  {EVENT_TYPE_LABELS[event.type]}
                </span>
                {event.isRecurring && (
                  <span title="Lặp hằng năm">
                    <RotateCcw className="h-3.5 w-3.5 text-stone-400" />
                  </span>
                )}
                {event.reminderSettings?.enabled && (
                  <span title="Nhắc nhở bật">
                    <Bell className="h-3.5 w-3.5 text-blue-400" />
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-stone-900 truncate">{event.title}</h3>
              {relName && (
                <p className="mt-0.5 body-sm text-stone-500">{relName}</p>
              )}
              <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(event.date)}
              </p>
            </div>

            {showCountdown && (
              <div
                className={cn(
                  'shrink-0 rounded-lg px-2.5 py-1.5 text-center min-w-[64px]',
                  isPast
                    ? 'bg-stone-100 text-stone-400'
                    : days <= 7
                      ? 'bg-orange-100 text-orange-700'
                      : days <= 30
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-stone-50 text-stone-600',
                )}
              >
                <Clock className="mx-auto h-4 w-4 mb-0.5 opacity-70" />
                <p className="text-xs font-semibold leading-tight whitespace-nowrap">
                  {getCountdownLabel(days)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const [view, setView] = useState<'upcoming' | 'all'>('upcoming');

  // Always fetch both — conditional hooks would break rules
  const upcomingQuery = useUpcomingEvents(30);
  const allQuery = useEvents({ limit: 50 });

  const isLoading =
    authLoading ||
    (view === 'upcoming' ? upcomingQuery.isLoading : allQuery.isLoading);

  const events =
    view === 'upcoming'
      ? (upcomingQuery.data ?? [])
      : (allQuery.data?.events ?? []);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg font-serif">Sự kiện &amp; Nhắc nhở</h1>
          <p className="body-base text-stone-500 mt-1">Theo dõi các dịp quan trọng với người thân yêu</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push('/events/new')}
          className="shrink-0"
        >
          Thêm sự kiện
        </Button>
      </div>

      {/* View Toggle */}
      <div className="mb-6 inline-flex rounded-lg bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => setView('upcoming')}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
            view === 'upcoming'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900',
          )}
        >
          Sắp tới
        </button>
        <button
          type="button"
          onClick={() => setView('all')}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
            view === 'all'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900',
          )}
        >
          Tất cả
        </button>
      </div>

      {/* Upcoming banner hint */}
      {view === 'upcoming' && events.length > 0 && (
        <p className="mb-4 body-sm text-stone-500">
          {events.length} sự kiện trong 30 ngày tới
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Đang tải…" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
            <CalendarDays className="h-10 w-10 text-stone-400" />
          </div>
          <h2 className="heading-sm font-serif">
            {view === 'upcoming' ? 'Không có sự kiện sắp tới' : 'Chưa có sự kiện nào'}
          </h2>
          <p className="body-base text-stone-500 mt-2 mb-6 max-w-sm mx-auto">
            {view === 'upcoming'
              ? 'Thêm sự kiện để nhận nhắc nhở trước những dịp quan trọng'
              : 'Bắt đầu theo dõi sinh nhật, kỷ niệm và các dịp đặc biệt'}
          </p>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push('/events/new')}
          >
            Thêm sự kiện
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <EventCard key={ev._id} event={ev} showCountdown={view === 'upcoming'} />
          ))}
        </div>
      )}
    </Container>
  );
}
