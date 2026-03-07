'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Spinner,
} from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useRelationship,
  useUpdateRelationship,
  type RelationshipType,
  type ImportantDate,
} from '@/hooks/use-relationships';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

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
  tagClassName,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  tagClassName?: string;
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
          placeholder={placeholder ?? 'Nhập rồi nhấn Enter hoặc Thêm'}
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
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm',
                tagClassName ?? 'bg-stone-100 text-stone-700',
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="rounded-full p-0.5 hover:bg-black/10"
                aria-label={`Xóa ${tag}`}
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

export default function EditRelationshipPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: rel, isLoading, error } = useRelationship(id);
  const updateRel = useUpdateRelationship();

  // ─── Form state ─────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [type, setType] = useState<RelationshipType>('friend');
  const [birthday, setBirthday] = useState('');

  // Important dates
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateValue, setNewDateValue] = useState('');
  const [newDateRecurring, setNewDateRecurring] = useState(false);

  // Flower preferences
  const [favColors, setFavColors] = useState<string[]>([]);
  const [favFlowers, setFavFlowers] = useState<string[]>([]);
  const [dislikedFlowers, setDislikedFlowers] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  // ─── Pre-fill from fetched relationship ─────────────────────────────────────
  useEffect(() => {
    if (!rel) return;
    setName(rel.name);
    setType(rel.type);
    setBirthday(rel.birthday ? rel.birthday.slice(0, 10) : '');
    setImportantDates(rel.importantDates ?? []);
    setFavColors(rel.flowerPreferences?.favoriteColors ?? []);
    setFavFlowers(rel.flowerPreferences?.favoriteFlowers ?? []);
    setDislikedFlowers(rel.flowerPreferences?.dislikedFlowers ?? []);
    setAllergies(rel.flowerPreferences?.allergies ?? []);
  }, [rel]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleColor = (key: string) =>
    setFavColors((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );

  const addImportantDate = () => {
    if (!newDateTitle.trim() || !newDateValue) return;
    setImportantDates((prev) => [
      ...prev,
      { title: newDateTitle.trim(), date: newDateValue },
    ]);
    setNewDateTitle('');
    setNewDateValue('');
    setNewDateRecurring(false);
  };

  const removeImportantDate = (index: number) =>
    setImportantDates((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên');
      return;
    }
    try {
      await updateRel.mutateAsync({
        id,
        body: {
          name: name.trim(),
          type,
          birthday: birthday || undefined,
          importantDates: importantDates.length > 0 ? importantDates : undefined,
          flowerPreferences: {
            favoriteColors: favColors,
            favoriteFlowers: favFlowers,
            dislikedFlowers,
            allergies,
          },
        },
      });
      toast.success('Đã cập nhật mối quan hệ');
      router.push(`/relationships/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  // ─── Loading / Error ────────────────────────────────────────────────────────

  if (authLoading || isLoading) {
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
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Container className="py-10">
      {/* Back */}
      <Link
        href={`/relationships/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 body-sm text-stone-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại {rel.name}
      </Link>

      <div className="max-w-2xl">
        <h1 className="heading-lg font-serif mb-2">Chỉnh sửa mối quan hệ</h1>
        <p className="body-base text-stone-500 mb-8">Cập nhật thông tin của {rel.name}</p>

        <div className="grid gap-6">
          {/* ── Basic Info ───────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Thông tin cơ bản</h2>
              <p className="body-sm text-stone-500 mt-1">Tên, loại quan hệ và ngày sinh</p>
            </div>
            <div className="grid gap-4">
              <Input
                label="Tên *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Mẹ, Bạn Minh, Anh Tuấn…"
                autoFocus
              />
              <Select
                label="Loại quan hệ *"
                value={type}
                onChange={(e) => setType(e.target.value as RelationshipType)}
                options={RELATIONSHIP_TYPE_OPTIONS}
              />
              <Input
                label="Ngày sinh"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                helperText="Tùy chọn — dùng để nhắc nhở và gợi ý hoa"
              />
            </div>
          </div>

          {/* ── Important Dates ──────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Ngày quan trọng</h2>
              <p className="body-sm text-stone-500 mt-1">Kỷ niệm, lễ, hoặc dịp đặc biệt khác</p>
            </div>
            <div className="grid gap-4">
              {/* Existing dates */}
              {importantDates.length > 0 && (
                <ul className="grid gap-2">
                  {importantDates.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2"
                    >
                      <div>
                        <span className="body-sm font-medium text-stone-800">{d.title}</span>
                        <span className="ml-2 text-xs text-stone-500">{d.date}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImportantDate(i)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                        aria-label="Xóa ngày"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add new date */}
              <div className="rounded-lg border border-dashed border-stone-200 p-3 grid gap-2">
                <p className="label-text">Thêm ngày mới</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tên dịp (VD: Kỷ niệm yêu)"
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
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDateRecurring}
                      onChange={(e) => setNewDateRecurring(e.target.checked)}
                      className="h-4 w-4 rounded accent-primary-600"
                    />
                    <span className="body-sm text-stone-600">Lặp lại hàng năm</span>
                  </label>
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
              </div>
            </div>
          </div>

          {/* ── Flower Preferences ───────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Sở thích hoa</h2>
              <p className="body-sm text-stone-500 mt-1">Để AI gợi ý hoa phù hợp hơn cho người này</p>
            </div>
            <div className="grid gap-6">
              {/* Favourite colors */}
              <div>
                <p className="label-text mb-3">Màu yêu thích</p>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => {
                    const selected = favColors.includes(color.key);
                    return (
                      <button
                        key={color.key}
                        type="button"
                        onClick={() => toggleColor(color.key)}
                        aria-pressed={selected}
                        className="group flex flex-col items-center gap-1"
                      >
                        <span
                          className={cn(
                            'block h-8 w-8 rounded-full transition-all duration-150',
                            color.border && 'border border-stone-200',
                            selected
                              ? 'ring-2 ring-primary-500 ring-offset-2 scale-110'
                              : 'group-hover:scale-105',
                          )}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs text-stone-500">{color.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favourite flowers */}
              <div>
                <p className="label-text mb-2">Loại hoa yêu thích</p>
                <TagInput
                  tags={favFlowers}
                  onChange={setFavFlowers}
                  placeholder="VD: Hoa hồng, Hoa tulip…"
                  tagClassName="bg-primary-50 text-primary-700"
                />
              </div>

              {/* Disliked flowers */}
              <div>
                <p className="label-text mb-2">Loại hoa không thích</p>
                <TagInput
                  tags={dislikedFlowers}
                  onChange={setDislikedFlowers}
                  placeholder="VD: Hoa ly, Hoa cẩm chướng…"
                  tagClassName="bg-orange-50 text-orange-700"
                />
              </div>

              {/* Allergies */}
              <div>
                <p className="label-text mb-2">Dị ứng</p>
                <TagInput
                  tags={allergies}
                  onChange={setAllergies}
                  placeholder="VD: Phấn hoa hướng dương…"
                  tagClassName="bg-red-50 text-red-700"
                />
              </div>
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              isLoading={updateRel.isPending}
              disabled={!name.trim()}
              className="flex-1 sm:flex-none"
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(`/relationships/${id}`)}
              disabled={updateRel.isPending}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
