'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Info, X } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, Input, Spinner } from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useProfile, useUpdatePreferences } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS: Array<{ key: string; label: string; hex: string; border?: boolean }> = [
  { key: 'red', label: 'Đỏ', hex: '#ef4444' },
  { key: 'pink', label: 'Hồng', hex: '#ec4899' },
  { key: 'white', label: 'Trắng', hex: '#ffffff', border: true },
  { key: 'yellow', label: 'Vàng', hex: '#eab308' },
  { key: 'orange', label: 'Cam', hex: '#f97316' },
  { key: 'purple', label: 'Tím', hex: '#a855f7' },
  { key: 'blue', label: 'Xanh dương', hex: '#3b82f6' },
];

const EMOTIONS: Array<{ key: string; label: string }> = [
  { key: 'romantic', label: 'Lãng mạn' },
  { key: 'grateful', label: 'Biết ơn' },
  { key: 'joyful', label: 'Vui vẻ' },
  { key: 'sympathetic', label: 'Chia sẻ' },
  { key: 'respectful', label: 'Kính trọng' },
  { key: 'apologetic', label: 'Xin lỗi' },
  { key: 'celebratory', label: 'Chúc mừng' },
  { key: 'passionate', label: 'Đam mê' },
  { key: 'hopeful', label: 'Hy vọng' },
  { key: 'peaceful', label: 'Bình yên' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreferencesPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updatePreferences = useUpdatePreferences();

  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [favoriteEmotions, setFavoriteEmotions] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');

  // Sync from profile
  useEffect(() => {
    const p = profile?.preferences;
    if (!p) return;
    setFavoriteColors(p.favoriteColors ?? []);
    setFavoriteEmotions(p.favoriteEmotions ?? []);
    setBudgetMin(p.budget?.min ? String(p.budget.min) : '');
    setBudgetMax(p.budget?.max ? String(p.budget.max) : '');
    setAllergies(p.allergies ?? []);
  }, [profile]);

  const toggleColor = (key: string) =>
    setFavoriteColors((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );

  const toggleEmotion = (key: string) =>
    setFavoriteEmotions((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key],
    );

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies((prev) => [...prev, trimmed]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (item: string) => setAllergies((prev) => prev.filter((a) => a !== item));

  const handleSave = useCallback(async () => {
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    const budget = min > 0 && max > 0 && max >= min ? { min, max } : undefined;

    try {
      await updatePreferences.mutateAsync({
        favoriteColors,
        favoriteEmotions,
        budget,
        allergies,
      });
      toast.success('Đã lưu sở thích của bạn');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại. Vui lòng thử lại.');
    }
  }, [favoriteColors, favoriteEmotions, budgetMin, budgetMax, allergies, updatePreferences]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải…" />
      </div>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-lg font-serif">Sở thích của tôi</h1>
          <p className="body-base text-stone-500 mt-2 flex items-start gap-1.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
            Sở thích giúp AI Flowery gợi ý hoa phù hợp hơn cho từng dịp đặc biệt của bạn
          </p>
        </div>

        <div className="grid gap-6">
          {/* ── Favorite Colors ──────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Màu sắc yêu thích</h2>
              <p className="body-sm text-stone-500 mt-1">Chọn những màu bạn thích nhất</p>
            </div>
            <div className="flex flex-wrap gap-5">
              {COLORS.map((color) => {
                const selected = favoriteColors.includes(color.key);
                return (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => toggleColor(color.key)}
                    aria-pressed={selected}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        'block h-10 w-10 rounded-full transition-all duration-150',
                        color.border && 'border-2 border-stone-200',
                        selected
                          ? 'scale-110 ring-2 ring-primary-500 ring-offset-2'
                          : 'group-hover:scale-105',
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span
                      className={cn(
                        'text-xs transition-colors',
                        selected ? 'font-semibold text-primary-700' : 'text-stone-500',
                      )}
                    >
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Favorite Emotions ────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Cảm xúc muốn gửi gắm</h2>
              <p className="body-sm text-stone-500 mt-1">Chọn cảm xúc bạn hay muốn truyền tải qua hoa</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => {
                const selected = favoriteEmotions.includes(emotion.key);
                return (
                  <button
                    key={emotion.key}
                    type="button"
                    onClick={() => toggleEmotion(emotion.key)}
                    aria-pressed={selected}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150',
                      selected
                        ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                    )}
                  >
                    {emotion.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Budget ───────────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Ngân sách</h2>
              <p className="body-sm text-stone-500 mt-1">Khoảng chi tiêu thường xuyên cho mỗi bó hoa</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tối thiểu (VND)"
                type="number"
                inputMode="numeric"
                min={0}
                step={10000}
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="100,000"
              />
              <Input
                label="Tối đa (VND)"
                type="number"
                inputMode="numeric"
                min={0}
                step={10000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="500,000"
              />
            </div>
            {budgetMin && budgetMax && Number(budgetMax) < Number(budgetMin) && (
              <p className="mt-2 body-sm text-red-500">Ngân sách tối đa phải lớn hơn tối thiểu</p>
            )}
          </div>

          {/* ── Allergies ────────────────────────────────────────────────── */}
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="heading-sm font-serif">Dị ứng hoa</h2>
              <p className="body-sm text-stone-500 mt-1">Những loại hoa bạn không muốn nhận vì dị ứng</p>
            </div>
            <div className="grid gap-3">
              <div className="flex gap-2">
                <Input
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAllergy();
                    }
                  }}
                  placeholder="VD: Hoa lily, Phấn hoa… nhấn Enter để thêm"
                  className="flex-1"
                />
                <Button variant="outline" onClick={addAllergy} disabled={!allergyInput.trim()}>
                  Thêm
                </Button>
              </div>

              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm text-red-700 ring-1 ring-red-200"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeAllergy(item)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-red-100"
                        aria-label={`Xóa ${item}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <Button onClick={handleSave} isLoading={updatePreferences.isPending}>
                  Lưu sở thích
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
