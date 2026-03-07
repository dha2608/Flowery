'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Bell } from 'lucide-react';
import { Container } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useEvent, useUpdateEvent, type EventType } from '@/hooks/use-events';
import { useRelationships } from '@/hooks/use-relationships';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'holiday', label: 'Ngày lễ' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const DAYS_BEFORE_OPTIONS = [1, 3, 7, 14, 30];

const CHANNELS: Array<{ key: string; label: string }> = [
  { key: 'email', label: 'Email' },
  { key: 'push', label: 'Thông báo đẩy' },
  { key: 'sms', label: 'Tin nhắn SMS' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditEventPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: event, isLoading: eventLoading, error } = useEvent(id);
  const updateEvent = useUpdateEvent();

  const { data: relsData, isLoading: relsLoading } = useRelationships({ limit: 100 });
  const relationships = relsData?.relationships ?? [];

  // ─── Form state ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('birthday');
  const [date, setDate] = useState('');
  const [relationshipId, setRelationshipId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');

  // Reminder
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [daysBefore, setDaysBefore] = useState<number[]>([]);
  const [channels, setChannels] = useState<string[]>(['email']);

  // ─── Pre-fill from fetched event ────────────────────────────────────────────
  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setType(event.type);
    setDate(event.date.slice(0, 10));
    setIsRecurring(event.isRecurring);

    // Resolve relationshipId (may be populated object or plain string)
    const relId =
      typeof event.relationshipId === 'string'
        ? event.relationshipId
        : event.relationshipId?._id ?? '';
    setRelationshipId(relId);

    // Reminder settings
    const rs = event.reminderSettings;
    setReminderEnabled(rs?.enabled ?? false);
    setDaysBefore(rs?.daysBefore ?? []);
    setChannels(rs?.channels?.length ? rs.channels : ['email']);
  }, [event]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleDayBefore = (day: number) =>
    setDaysBefore((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    );

  const toggleChannel = (key: string) =>
    setChannels((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên sự kiện');
      return;
    }
    if (!date) {
      toast.error('Vui lòng chọn ngày');
      return;
    }
    if (reminderEnabled && daysBefore.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khoảng thời gian nhắc nhở');
      return;
    }

    try {
      await updateEvent.mutateAsync({
        id,
        body: {
          title: title.trim(),
          type,
          date,
          relationshipId: relationshipId || undefined,
          isRecurring,
          reminderSettings: {
            enabled: reminderEnabled,
            daysBefore: reminderEnabled ? daysBefore : [],
            channels: reminderEnabled ? channels : [],
          },
        },
      });
      toast.success('Đã cập nhật sự kiện');
      router.push(`/events/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  // ─── Loading / Error ────────────────────────────────────────────────────────

  if (authLoading || eventLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải…" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <Container className="py-10">
        <p className="text-red-500">Không tìm thấy sự kiện.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/events')}>
          ← Quay lại danh sách
        </Button>
      </Container>
    );
  }

  const relationshipOptions = relationships.map((r) => ({
    value: r._id,
    label: r.name,
  }));

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Container className="py-10">
      {/* Back */}
      <Link
        href={`/events/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại sự kiện
      </Link>

      <div className="max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Chỉnh sửa sự kiện</h1>
        <p className="mb-8 text-gray-500">Cập nhật thông tin cho "{event.title}"</p>

        <div className="grid gap-6">
          {/* ── Event Info ───────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sự kiện</CardTitle>
              <CardDescription>Tên, loại và ngày diễn ra sự kiện</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                label="Tên sự kiện *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Sinh nhật của Mẹ"
                autoFocus
              />

              <Select
                label="Loại sự kiện *"
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                options={EVENT_TYPE_OPTIONS}
              />

              <Input
                label="Ngày *"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {/* Relationship picker */}
              {relsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Spinner size="sm" />
                  Đang tải danh sách mối quan hệ…
                </div>
              ) : relationships.length === 0 ? (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Bạn chưa có mối quan hệ nào.{' '}
                  <Link href="/relationships/new" className="underline font-medium">
                    Thêm ngay
                  </Link>
                </div>
              ) : (
                <Select
                  label="Mối quan hệ"
                  value={relationshipId}
                  onChange={(e) => setRelationshipId(e.target.value)}
                  options={[{ value: '', label: '— Không liên kết —' }, ...relationshipOptions]}
                  helperText="Tùy chọn — liên kết sự kiện với một người"
                />
              )}

              {/* Recurring */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">Lặp lại hàng năm</span>
              </label>
            </CardContent>
          </Card>

          {/* ── Reminder Settings ────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-400" />
                <CardTitle>Nhắc nhở</CardTitle>
              </div>
              <CardDescription>Cài đặt thông báo trước ngày sự kiện</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">Bật nhắc nhở</span>
              </label>

              {reminderEnabled && (
                <>
                  {/* Days before */}
                  <div>
                    <p className="mb-2 text-sm text-gray-600 font-medium">Nhắc trước:</p>
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
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
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

                  {/* Channels */}
                  <div>
                    <p className="mb-2 text-sm text-gray-600 font-medium">Kênh nhắc nhở:</p>
                    <div className="flex flex-wrap gap-4">
                      {CHANNELS.map((ch) => (
                        <label key={ch.key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={channels.includes(ch.key)}
                            onChange={() => toggleChannel(ch.key)}
                            className="h-4 w-4 rounded accent-primary-600"
                          />
                          <span className="text-sm text-gray-700">{ch.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Notes ────────────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
              <CardDescription>Thêm thông tin chi tiết về sự kiện (tùy chọn)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Đặt hoa trước 2 ngày, nhớ mua quà kèm…"
                rows={4}
                autoGrow
              />
            </CardContent>
          </Card>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              isLoading={updateEvent.isPending}
              disabled={!title.trim() || !date}
              className="flex-1 sm:flex-none"
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(`/events/${id}`)}
              disabled={updateEvent.isPending}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
