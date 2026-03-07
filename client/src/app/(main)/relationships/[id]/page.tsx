'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  X,
  Calendar,
  Flower2,
  Heart,
  CalendarCheck,
  Check,
} from 'lucide-react';
import { Container } from '@/components/layout';
import {
  Avatar,
  Button,
  Input,
  Select,
  Modal,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useRelationship,
  useUpdateRelationship,
  useDeleteRelationship,
  type RelationshipType,
  type ImportantDate,
} from '@/hooks/use-relationships';
import { useEvents } from '@/hooks/use-events';
import { formatDate, cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<RelationshipType, string> = {
  family: 'Gia đình',
  friend: 'Bạn bè',
  lover: 'Người yêu',
  colleague: 'Đồng nghiệp',
  other: 'Khác',
};

const RELATIONSHIP_TYPE_OPTIONS = [
  { value: 'family', label: 'Gia đình' },
  { value: 'friend', label: 'Bạn bè' },
  { value: 'lover', label: 'Người yêu' },
  { value: 'colleague', label: 'Đồng nghiệp' },
  { value: 'other', label: 'Khác' },
];

const COLORS: Array<{ key: string; label: string; hex: string; border?: boolean }> = [
  { key: 'red', label: 'Đỏ', hex: '#ef4444' },
  { key: 'pink', label: 'Hồng', hex: '#ec4899' },
  { key: 'white', label: 'Trắng', hex: '#ffffff', border: true },
  { key: 'yellow', label: 'Vàng', hex: '#eab308' },
  { key: 'orange', label: 'Cam', hex: '#f97316' },
  { key: 'purple', label: 'Tím', hex: '#a855f7' },
  { key: 'blue', label: 'Xanh dương', hex: '#3b82f6' },
];

// ─── Tag Input helper ─────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? 'Nhập rồi nhấn Enter'}
          className="flex-1"
        />
        <Button variant="outline" size="sm" onClick={add} disabled={!input.trim()}>
          Thêm
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-sm text-stone-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="rounded-full p-0.5 hover:bg-stone-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RelationshipDetailPage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: rel, isLoading, error } = useRelationship(id);
  const updateRel = useUpdateRelationship();
  const deleteRel = useDeleteRelationship();

  // All events, filtered client-side for this relationship
  const { data: eventsData } = useEvents({ limit: 100 });
  const relatedEvents = (eventsData?.events ?? []).filter((ev) => {
    const rid = ev.relationshipId;
    return typeof rid === 'string' ? rid === id : rid._id === id;
  });

  // ─── Edit: basic info ──────────────────────────────────────────────────────
  const [editingInfo, setEditingInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<RelationshipType>('friend');
  const [editBirthday, setEditBirthday] = useState('');

  // ─── Important dates ───────────────────────────────────────────────────────
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateValue, setNewDateValue] = useState('');

  // ─── Flower preferences ────────────────────────────────────────────────────
  const [editingFlowers, setEditingFlowers] = useState(false);
  const [favColors, setFavColors] = useState<string[]>([]);
  const [favFlowers, setFavFlowers] = useState<string[]>([]);
  const [dislikedFlowers, setDislikedFlowers] = useState<string[]>([]);
  const [flowerAllergies, setFlowerAllergies] = useState<string[]>([]);

  // ─── Delete modal ──────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync state from relationship data
  useEffect(() => {
    if (!rel) return;
    setEditName(rel.name);
    setEditType(rel.type);
    setEditBirthday(rel.birthday ? rel.birthday.slice(0, 10) : '');
    setImportantDates(rel.importantDates ?? []);
    setFavColors(rel.flowerPreferences?.favoriteColors ?? []);
    setFavFlowers(rel.flowerPreferences?.favoriteFlowers ?? []);
    setDislikedFlowers(rel.flowerPreferences?.dislikedFlowers ?? []);
    setFlowerAllergies(rel.flowerPreferences?.allergies ?? []);
  }, [rel]);

  const handleSaveInfo = useCallback(async () => {
    if (!id) return;
    try {
      await updateRel.mutateAsync({
        id,
        body: {
          name: editName.trim(),
          type: editType,
          birthday: editBirthday || undefined,
        },
      });
      setEditingInfo(false);
      toast.success('Đã lưu thông tin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    }
  }, [id, editName, editType, editBirthday, updateRel]);

  const handleSaveDates = useCallback(async () => {
    if (!id) return;
    try {
      await updateRel.mutateAsync({ id, body: { importantDates } });
      toast.success('Đã lưu ngày đặc biệt');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    }
  }, [id, importantDates, updateRel]);

  const handleSaveFlowers = useCallback(async () => {
    if (!id) return;
    try {
      await updateRel.mutateAsync({
        id,
        body: {
          flowerPreferences: {
            favoriteColors: favColors,
            favoriteFlowers: favFlowers,
            dislikedFlowers,
            allergies: flowerAllergies,
          },
        },
      });
      setEditingFlowers(false);
      toast.success('Đã lưu sở thích hoa');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    }
  }, [id, favColors, favFlowers, dislikedFlowers, flowerAllergies, updateRel]);

  const addImportantDate = () => {
    if (!newDateTitle.trim() || !newDateValue) return;
    setImportantDates((prev) => [...prev, { title: newDateTitle.trim(), date: newDateValue }]);
    setNewDateTitle('');
    setNewDateValue('');
  };

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteRel.mutateAsync(id);
      toast.success('Đã xóa mối quan hệ');
      router.push('/relationships');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  }, [id, deleteRel, router]);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải…" />
      </div>
    );
  }

  if (error || !rel) {
    return (
      <Container className="py-10">
        <p className="body-base text-red-500">Không tìm thấy mối quan hệ.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/relationships')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 body-sm text-stone-500">
          <Link href="/relationships" className="hover:text-primary-600 transition-colors">
            Mối quan hệ
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">{rel.name}</span>
        </nav>

        <div className="grid gap-6 max-w-2xl">
          {/* ── Header card ──────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="flex items-start gap-4">
              <Avatar name={rel.name} size="xl" className="ring-4 ring-primary-50 shrink-0" />
              <div className="flex-1 min-w-0">
                {editingInfo ? (
                  <div className="grid gap-3">
                    <Input
                      label="Tên"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <Select
                      label="Quan hệ"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as RelationshipType)}
                      options={RELATIONSHIP_TYPE_OPTIONS}
                    />
                    <Input
                      label="Sinh nhật"
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveInfo}
                        isLoading={updateRel.isPending}
                        leftIcon={<Check className="h-3.5 w-3.5" />}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingInfo(false)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="heading-md font-serif">{rel.name}</h1>
                    <div className="mt-1.5">
                      <span className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-medium">
                        {TYPE_LABELS[rel.type]}
                      </span>
                    </div>
                    {rel.birthday && (
                      <p className="mt-2 flex items-center gap-1.5 body-sm text-stone-500">
                        <Calendar className="h-4 w-4" />
                        Sinh nhật: {formatDate(rel.birthday)}
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Pencil className="h-3.5 w-3.5" />}
                        onClick={() => setEditingInfo(true)}
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
            </div>
          </div>

          {/* ── Important Dates ──────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="h-4 w-4 text-stone-500" />
              <h2 className="heading-sm font-serif">Ngày đặc biệt</h2>
            </div>
            <div className="grid gap-4">
              {importantDates.length === 0 ? (
                <p className="body-sm text-stone-400">Chưa có ngày đặc biệt nào</p>
              ) : (
                <ul className="grid gap-2">
                  {importantDates.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2"
                    >
                      <div>
                        <span className="body-sm font-medium text-stone-800">{d.title}</span>
                        <span className="ml-2 text-xs text-stone-500">{formatDate(d.date)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setImportantDates((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="p-1 text-stone-400 hover:text-red-500"
                        aria-label="Xóa ngày"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add date row */}
              <div className="flex gap-2">
                <Input
                  placeholder="Tên dịp (VD: Kỷ niệm)"
                  value={newDateTitle}
                  onChange={(e) => setNewDateTitle(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={newDateValue}
                  onChange={(e) => setNewDateValue(e.target.value)}
                  className="w-40 shrink-0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={addImportantDate}
                  disabled={!newDateTitle.trim() || !newDateValue}
                >
                  Thêm
                </Button>
              </div>

              <Button size="sm" onClick={handleSaveDates} isLoading={updateRel.isPending}>
                Lưu ngày đặc biệt
              </Button>
            </div>
          </div>

          {/* ── Flower Preferences ───────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flower2 className="h-4 w-4 text-primary-500" />
                <h2 className="heading-sm font-serif">Sở thích hoa</h2>
              </div>
              {!editingFlowers && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  onClick={() => setEditingFlowers(true)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
            <div className="grid gap-5">
              {/* Colors */}
              <div>
                <p className="label-text mb-2">Màu yêu thích</p>
                {editingFlowers ? (
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((c) => {
                      const sel = favColors.includes(c.key);
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() =>
                            setFavColors((prev) =>
                              sel ? prev.filter((x) => x !== c.key) : [...prev, c.key],
                            )
                          }
                          className="flex flex-col items-center gap-1"
                        >
                          <span
                            className={cn(
                              'block h-8 w-8 rounded-full transition-all',
                              c.border && 'border border-stone-200',
                              sel ? 'ring-2 ring-primary-500 ring-offset-1 scale-110' : 'hover:scale-105',
                            )}
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs text-stone-500">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : favColors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {favColors.map((c) => {
                      const color = COLORS.find((x) => x.key === c);
                      return color ? (
                        <span key={c} className="inline-flex items-center gap-1.5 body-sm text-stone-700">
                          <span
                            className={cn(
                              'h-4 w-4 rounded-full',
                              color.border && 'border border-stone-200',
                            )}
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="body-sm text-stone-400">Chưa có</p>
                )}
              </div>

              {/* Favorite flowers */}
              <div>
                <p className="label-text mb-2">Loại hoa yêu thích</p>
                {editingFlowers ? (
                  <TagInput
                    tags={favFlowers}
                    onChange={setFavFlowers}
                    placeholder="VD: Hoa hồng, Hoa cúc…"
                  />
                ) : favFlowers.length > 0 ? (
                  <p className="body-sm text-stone-700">{favFlowers.join(', ')}</p>
                ) : (
                  <p className="body-sm text-stone-400">Chưa có</p>
                )}
              </div>

              {/* Disliked flowers */}
              <div>
                <p className="label-text mb-2">Loại hoa không thích</p>
                {editingFlowers ? (
                  <TagInput
                    tags={dislikedFlowers}
                    onChange={setDislikedFlowers}
                    placeholder="VD: Hoa ly, Hoa cẩm chướng…"
                  />
                ) : dislikedFlowers.length > 0 ? (
                  <p className="body-sm text-stone-700">{dislikedFlowers.join(', ')}</p>
                ) : (
                  <p className="body-sm text-stone-400">Chưa có</p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <p className="label-text mb-2">Dị ứng</p>
                {editingFlowers ? (
                  <TagInput
                    tags={flowerAllergies}
                    onChange={setFlowerAllergies}
                    placeholder="VD: Phấn hoa hướng dương…"
                  />
                ) : flowerAllergies.length > 0 ? (
                  <p className="body-sm text-red-600">{flowerAllergies.join(', ')}</p>
                ) : (
                  <p className="body-sm text-stone-400">Không có</p>
                )}
              </div>

              {editingFlowers && (
                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <Button size="sm" onClick={handleSaveFlowers} isLoading={updateRel.isPending}>
                    Lưu sở thích hoa
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingFlowers(false)}>
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Events ───────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-stone-500" />
                <h2 className="heading-sm font-serif">Sự kiện liên quan</h2>
              </div>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => router.push(`/events/new?rel=${id}`)}
              >
                Thêm sự kiện
              </Button>
            </div>
            {relatedEvents.length === 0 ? (
              <p className="body-sm text-stone-400">Chưa có sự kiện nào cho {rel.name}</p>
            ) : (
              <ul className="grid gap-2">
                {relatedEvents.slice(0, 5).map((ev) => (
                  <li key={ev._id}>
                    <Link
                      href={`/events/${ev._id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <p className="body-sm font-medium text-stone-800">{ev.title}</p>
                        <p className="text-xs text-stone-400">{formatDate(ev.date)}</p>
                      </div>
                      <ArrowLeft className="h-4 w-4 rotate-180 text-stone-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Find flowers CTA ─────────────────────────────────────────── */}
          <div className="card-base p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary-500" />
              <div>
                <p className="font-semibold text-stone-900">Tìm hoa cho {rel.name}</p>
                <p className="body-sm text-stone-500">AI sẽ gợi ý dựa trên sở thích của họ</p>
              </div>
            </div>
            <Button onClick={() => router.push('/quiz')} className="shrink-0">
              Bắt đầu
            </Button>
          </div>
        </div>
      </Container>

      {/* Delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa mối quan hệ"
        size="sm"
      >
        <div className="grid gap-4">
          <p className="body-sm text-stone-600">
            Bạn có chắc muốn xóa <strong>{rel.name}</strong>? Tất cả sự kiện liên quan cũng sẽ bị
            xóa. Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
              isLoading={deleteRel.isPending}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
