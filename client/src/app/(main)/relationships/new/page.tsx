'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useCreateRelationship, type RelationshipType, type ImportantDate } from '@/hooks/use-relationships';
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewRelationshipPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const createRel = useCreateRelationship();

  // Basic info
  const [name, setName] = useState('');
  const [type, setType] = useState<RelationshipType>('friend');
  const [birthday, setBirthday] = useState('');

  // Important dates
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateValue, setNewDateValue] = useState('');

  // Flower preferences
  const [favColors, setFavColors] = useState<string[]>([]);
  const [favFlowers, setFavFlowers] = useState<string[]>([]);
  const [flowerInput, setFlowerInput] = useState('');

  const toggleColor = (key: string) =>
    setFavColors((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );

  const addImportantDate = () => {
    if (!newDateTitle.trim() || !newDateValue) return;
    setImportantDates((prev) => [...prev, { title: newDateTitle.trim(), date: newDateValue }]);
    setNewDateTitle('');
    setNewDateValue('');
  };

  const addFlower = () => {
    const v = flowerInput.trim();
    if (v && !favFlowers.includes(v)) setFavFlowers((prev) => [...prev, v]);
    setFlowerInput('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên');
      return;
    }
    try {
      await createRel.mutateAsync({
        name: name.trim(),
        type,
        birthday: birthday || undefined,
        importantDates: importantDates.length > 0 ? importantDates : undefined,
        flowerPreferences:
          favColors.length > 0 || favFlowers.length > 0
            ? { favoriteColors: favColors, favoriteFlowers: favFlowers, dislikedFlowers: [], allergies: [] }
            : undefined,
      });
      toast.success('Đã thêm mối quan hệ mới');
      router.push('/relationships');
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
        href="/relationships"
        className="mb-6 inline-flex items-center gap-1.5 body-sm text-stone-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại mối quan hệ
      </Link>

      <div className="max-w-2xl">
        <h1 className="heading-lg font-serif mb-8">Thêm mối quan hệ mới</h1>

        <div className="grid gap-6">
          {/* ── Basic Info ───────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Thông tin cơ bản</h2>
              <p className="body-sm text-stone-500 mt-1">Tên và loại mối quan hệ</p>
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
                label="Quan hệ *"
                value={type}
                onChange={(e) => setType(e.target.value as RelationshipType)}
                options={RELATIONSHIP_TYPE_OPTIONS}
              />
              <Input
                label="Sinh nhật"
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
              <h2 className="heading-sm font-serif">Ngày đặc biệt</h2>
              <p className="body-sm text-stone-500 mt-1">Kỷ niệm, lễ, hoặc dịp quan trọng khác</p>
            </div>
            <div className="grid gap-4">
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

          {/* ── Flower Preferences ───────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Sở thích hoa</h2>
              <p className="body-sm text-stone-500 mt-1">Để AI gợi ý hoa phù hợp hơn cho người này</p>
            </div>
            <div className="grid gap-5">
              {/* Colors */}
              <div>
                <p className="label-text mb-3">Màu yêu thích</p>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => {
                    const sel = favColors.includes(color.key);
                    return (
                      <button
                        key={color.key}
                        type="button"
                        onClick={() => toggleColor(color.key)}
                        aria-pressed={sel}
                        className="group flex flex-col items-center gap-1"
                      >
                        <span
                          className={cn(
                            'block h-8 w-8 rounded-full transition-all duration-150',
                            color.border && 'border border-stone-200',
                            sel
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

              {/* Favorite flowers */}
              <div>
                <p className="label-text mb-2">Loại hoa yêu thích</p>
                <div className="flex gap-2">
                  <Input
                    value={flowerInput}
                    onChange={(e) => setFlowerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFlower();
                      }
                    }}
                    placeholder="VD: Hoa hồng, Hoa tulip…"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFlower}
                    disabled={!flowerInput.trim()}
                  >
                    Thêm
                  </Button>
                </div>
                {favFlowers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {favFlowers.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-sm text-primary-700"
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() => setFavFlowers((prev) => prev.filter((x) => x !== f))}
                          className="rounded-full p-0.5 hover:bg-primary-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              isLoading={createRel.isPending}
              disabled={!name.trim()}
              className="flex-1 sm:flex-none"
            >
              Lưu mối quan hệ
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/relationships')}
              disabled={createRel.isPending}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
