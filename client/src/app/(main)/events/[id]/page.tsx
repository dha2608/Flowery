'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CalendarDays,
  RotateCcw,
  Bell,
  Pencil,
  Trash2,
  Check,
  ExternalLink,
  Flower2,
  Clock,
} from 'lucide-react';
import { Container } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Modal,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useEvent, useUpdateEvent, useDeleteEvent, type EventType } from '@/hooks/use-events';
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

const EVENT_TYPE_OPTIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'holiday', label: 'Lễ tết' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const DAYS_BEFORE_OPTIONS = [1, 3, 7, 14, 30];

// ─── Helper ───────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: event, isLoading, error } = useEvent(id);
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  // ─── Edit state ────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editType, setEditType] = useState<EventType>('custom');
  const [editRecurring, setEditRecurring] = useState(false);
  const [editReminderEnabled, setEditReminderEnabled] = useState(false);
  const [editDaysBefore, setEditDaysBefore] = useState<number[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync from event
  useEffect(() => {
    if (!event) return;
    setEditTitle(event.title);
    setEditDate(event.date.slice(0, 10));
    setEditType(event.type);
    setEditRecurring(event.isRecurring);
    setEditReminderEnabled(event.reminderSettings?.enabled ?? false);
    setEditDaysBefore(event.reminderSettings?.daysBefore ?? []);
  }, [event]);

  const toggleDayBefore = (day: number) =>
    setEditDaysBefore((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    );

  const handleSave = useCallback(async () => {
    if (!id || !editTitle.trim()) return;
    try {
      await updateEvent.mutateAsync({
        id,
        body: {
          title: editTitle.trim(),
          date: editDate,
          type: editType,
          isRecurring: editRecurring,
          reminderSettings: {
            enabled: editReminderEnabled,
            daysBefore: editDaysBefore,
            channels: ['email'],
          },
        },
      });
      setEditing(false);
      toast.success('Đã cập nhật sự kiện');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    }
  }, [id, editTitle, editDate, editType, editRecurring, editReminderEnabled, editDaysBefore, updateEvent]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast.success('Đã xóa sự kiện');
      router.push('/events');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  }, [id, deleteEvent, router]);

  // ─── Loading / Error ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải…" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <Container className="py-10">
        <p className="body-base text-red-500">Không tìm thấy sự kiện.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/events')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Quay lại
        </Button>
      </Container>
    );
  }

  const relInfo =
    typeof event.relationshipId === 'string' ? null : event.relationshipId;
  const days = daysUntil(event.date);

  return (
    <>
      <Container className="py-10">
        {/* Back */}
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 body-sm text-stone-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Sự kiện &amp; Nhắc nhở
        </Link>

        <div className="grid gap-6 max-w-2xl">
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="card-base p-6">
            {editing ? (
              <div className="grid gap-4">
                <Input
                  label="Tiêu đề *"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Input
                  label="Ngày *"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <Select
                  label="Loại sự kiện"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as EventType)}
                  options={EVENT_TYPE_OPTIONS}
                />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editRecurring}
                      onChange={(e) => setEditRecurring(e.target.checked)}
                      className="h-4 w-4 rounded accent-primary-600"
                    />
                    <span className="body-sm font-medium text-stone-700">Lặp hằng năm</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    isLoading={updateEvent.isPending}
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                  >
                    Lưu
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-medium">
                        {EVENT_TYPE_LABELS[event.type]}
                      </span>
                      {event.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                          <RotateCcw className="h-3.5 w-3.5" />
                          Hằng năm
                        </span>
                      )}
                    </div>
                    <h1 className="heading-md font-serif">{event.title}</h1>
                    <p className="mt-1 flex items-center gap-1.5 body-sm text-stone-500">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(event.date)}
                    </p>

                    {/* Countdown */}
                    {days >= 0 && days <= 30 && (
                      <div
                        className={cn(
                          'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
                          days <= 7
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-primary-50 text-primary-700',
                        )}
                      >
                        <Clock className="h-4 w-4" />
                        {days === 0
                          ? 'Hôm nay'
                          : days === 1
                            ? 'Còn 1 ngày'
                            : `Còn ${days} ngày`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                    onClick={() => setEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Xóa
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* ── Linked Relationship ──────────────────────────────────────── */}
          {relInfo && (
            <div className="card-base p-6">
              <h2 className="heading-sm font-serif mb-3">Người liên quan</h2>
              <Link
                href={`/relationships/${relInfo._id}`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-stone-50 transition-colors -ml-3"
              >
                <span className="body-sm font-medium text-stone-800">{relInfo.name}</span>
                <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
              </Link>
            </div>
          )}

          {/* ── Reminder Settings ────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-stone-500" />
              <h2 className="heading-sm font-serif">Cài đặt nhắc nhở</h2>
            </div>
            <div className="grid gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editReminderEnabled}
                  onChange={(e) => {
                    setEditReminderEnabled(e.target.checked);
                    setEditing(true);
                  }}
                  className="h-4 w-4 rounded accent-primary-600"
                />
                <span className="body-sm font-medium text-stone-700">
                  {editReminderEnabled ? 'Nhắc nhở đang bật' : 'Bật nhắc nhở'}
                </span>
              </label>

              {editReminderEnabled && (
                <div>
                  <p className="label-text mb-2">Nhắc trước bao nhiêu ngày:</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_BEFORE_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          toggleDayBefore(d);
                          setEditing(true);
                        }}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                          editDaysBefore.includes(d)
                            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                        )}
                      >
                        {d} ngày
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editing && (
                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <Button size="sm" onClick={handleSave} isLoading={updateEvent.isPending}>
                    Lưu thay đổi
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── Order flowers CTA ────────────────────────────────────────── */}
          <div className="card-base p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Flower2 className="h-6 w-6 text-primary-500" />
              <div>
                <p className="font-semibold text-stone-900">Đặt hoa cho sự kiện này</p>
                <p className="body-sm text-stone-500">AI gợi ý hoa phù hợp cho {event.title}</p>
              </div>
            </div>
            <Button onClick={() => router.push('/quiz')} className="shrink-0">
              Tìm hoa
            </Button>
          </div>
        </div>
      </Container>

      {/* Delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa sự kiện"
        size="sm"
      >
        <div className="grid gap-4">
          <p className="body-sm text-stone-600">
            Bạn có chắc muốn xóa sự kiện <strong>{event.title}</strong>? Hành động này không thể
            hoàn tác.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
              isLoading={deleteEvent.isPending}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
