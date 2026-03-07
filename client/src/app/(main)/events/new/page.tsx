'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useCreateEvent, type EventType } from '@/hooks/use-events';
import { useRelationships } from '@/hooks/use-relationships';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'holiday', label: 'Lễ tết' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const DAYS_BEFORE_OPTIONS = [1, 3, 7, 14, 30];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewEventPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledRelId = searchParams.get('rel') ?? '';

  const createEvent = useCreateEvent();
  const { data: relsData, isLoading: relsLoading } = useRelationships({ limit: 100 });
  const relationships = relsData?.relationships ?? [];

  // Form state
  const [relationshipId, setRelationshipId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<EventType>('birthday');
  const [isRecurring, setIsRecurring] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [daysBefore, setDaysBefore] = useState<number[]>([3, 7]);

  // Pre-fill relationship from query param
  useEffect(() => {
    if (prefilledRelId) setRelationshipId(prefilledRelId);
  }, [prefilledRelId]);

  const toggleDayBefore = (day: number) =>
    setDaysBefore((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    );

  // Auto-set title based on relationship + type
  useEffect(() => {
    if (!title && relationshipId && type !== 'custom') {
      const rel = relationships.find((r) => r._id === relationshipId);
      if (rel) {
        const label = EVENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? '';
        setTitle(`${label} của ${rel.name}`);
      }
    }
  }, [relationshipId, type, relationships, title]);

  const relationshipOptions = relationships.map((r) => ({
    value: r._id,
    label: r.name,
  }));

  const handleSubmit = async () => {
    if (!relationshipId) {
      toast.error('Vui lòng chọn người liên quan');
      return;
    }
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề sự kiện');
      return;
    }
    if (!date) {
      toast.error('Vui lòng chọn ngày');
      return;
    }

    try {
      await createEvent.mutateAsync({
        relationshipId,
        title: title.trim(),
        date,
        type,
        isRecurring,
        reminderSettings: {
          enabled: reminderEnabled,
          daysBefore: reminderEnabled ? daysBefore : [],
          channels: ['email'],
        },
      });
      toast.success('Đã thêm sự kiện mới');
      router.push('/events');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Thêm thất bại. Vui lòng thử lại.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Container className="py-10">
      {/* Back */}
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1.5 body-sm text-stone-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại sự kiện
      </Link>

      <div className="max-w-2xl">
        <h1 className="heading-lg font-serif mb-8">Thêm sự kiện mới</h1>

        <div className="grid gap-6">
          {/* ── Event Info ───────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Thông tin sự kiện</h2>
              <p className="body-sm text-stone-500 mt-1">Điền thông tin cơ bản về sự kiện</p>
            </div>
            <div className="grid gap-4">
              {/* Relationship picker */}
              {relsLoading ? (
                <div className="flex items-center gap-2 body-sm text-stone-500">
                  <Spinner size="sm" />
                  Đang tải danh sách mối quan hệ…
                </div>
              ) : relationships.length === 0 ? (
                <div className="rounded-lg bg-amber-50 px-4 py-3 body-sm text-amber-700">
                  Bạn chưa có mối quan hệ nào.{' '}
                  <Link href="/relationships/new" className="underline font-medium">
                    Thêm ngay
                  </Link>
                </div>
              ) : (
                <Select
                  label="Người liên quan *"
                  value={relationshipId}
                  onChange={(e) => setRelationshipId(e.target.value)}
                  options={relationshipOptions}
                  placeholder="Chọn người…"
                />
              )}

              <Input
                label="Tiêu đề sự kiện *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Sinh nhật của Mẹ"
              />

              <Input
                label="Ngày *"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Select
                label="Loại sự kiện *"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as EventType);
                  setTitle(''); // reset to allow auto-fill
                }}
                options={EVENT_TYPE_OPTIONS}
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary-600"
                />
                <span className="body-sm font-medium text-stone-700">
                  Lặp hằng năm (recurring)
                </span>
              </label>
            </div>
          </div>

          {/* ── Reminder Settings ────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Cài đặt nhắc nhở</h2>
              <p className="body-sm text-stone-500 mt-1">Nhận thông báo trước ngày sự kiện</p>
            </div>
            <div className="grid gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary-600"
                />
                <span className="body-sm font-medium text-stone-700">Bật nhắc nhở</span>
              </label>

              {reminderEnabled && (
                <div>
                  <p className="label-text mb-2">Nhắc trước:</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_BEFORE_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDayBefore(d)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                          daysBefore.includes(d)
                            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                        )}
                      >
                        {d === 1 ? '1 ngày' : `${d} ngày`}
                      </button>
                    ))}
                  </div>
                  {daysBefore.length === 0 && (
                    <p className="mt-1.5 text-xs text-amber-600">
                      Chọn ít nhất một khoảng thời gian nhắc nhở
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              isLoading={createEvent.isPending}
              disabled={!title.trim() || !date || !relationshipId}
              className="flex-1 sm:flex-none"
            >
              Lưu sự kiện
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/events')}
              disabled={createEvent.isPending}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
