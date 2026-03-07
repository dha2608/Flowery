'use client';

import { useState, useCallback, type FormEvent } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Flower2,
  X,
  Leaf,
  Palette,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Spinner,
  Modal,
  Select,
  Textarea,
} from '@/components/ui';
import { formatDate, cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';
import {
  useAdminFlowers,
  useCreateFlower,
  useUpdateFlower,
  useToggleFlowerAvailability,
  useDeleteFlower,
  type AdminFlower,
  type AdminFlowerInput,
} from '@/hooks/use-admin';

const LIMIT = 15;

const SEASON_OPTIONS = [
  { value: '', label: 'Tất cả mùa' },
  { value: 'spring', label: 'Xuân' },
  { value: 'summer', label: 'Hạ' },
  { value: 'autumn', label: 'Thu' },
  { value: 'winter', label: 'Đông' },
  { value: 'all_year', label: 'Quanh năm' },
];

const SEASON_LABELS: Record<string, string> = {
  spring: 'Xuân',
  summer: 'Hạ',
  autumn: 'Thu',
  winter: 'Đông',
  all_year: 'Quanh năm',
};

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Đang bán' },
  { value: 'false', label: 'Ngừng bán' },
];

// ── Default form state ─────────────────────────────────────────────────────
const emptyForm: AdminFlowerInput = {
  name: { vi: '', en: '' },
  slug: '',
  description: { vi: '', en: '' },
  colors: [],
  seasons: ['all_year'],
  meanings: [],
  images: [],
  tags: [],
  isAvailable: true,
  popularityScore: 0,
};

export default function AdminFlowersPage() {
  // ── Filters ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [season, setSeason] = useState('');
  const [availability, setAvailability] = useState('');

  // ── Modal state ────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminFlower | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFlower | null>(null);
  const [form, setForm] = useState<AdminFlowerInput>(emptyForm);

  // ── Inline chip inputs ─────────────────────────────────────────────────
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');

  // ── Data hooks ─────────────────────────────────────────────────────────
  const { data, isLoading } = useAdminFlowers({
    page,
    limit: LIMIT,
    search: search || undefined,
    season: season || undefined,
    isAvailable: availability !== '' ? availability === 'true' : undefined,
  });

  const createFlower = useCreateFlower();
  const updateFlower = useUpdateFlower();
  const toggleAvailability = useToggleFlowerAvailability();
  const deleteFlower = useDeleteFlower();

  const flowers = data?.data ?? [];
  const pagination = data?.pagination;

  // ── Helpers ────────────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setColorInput('');
    setTagInput('');
    setMeaningInput('');
    setFormOpen(true);
  };

  const openEdit = (flower: AdminFlower) => {
    setEditTarget(flower);
    setForm({
      name: flower.name,
      scientificName: flower.scientificName,
      slug: flower.slug,
      description: flower.description,
      colors: [...flower.colors],
      seasons: [...flower.seasons],
      meanings: [...flower.meanings],
      images: [...flower.images],
      tags: [...flower.tags],
      isAvailable: flower.isAvailable,
      popularityScore: flower.popularityScore,
      careInstructions: flower.careInstructions,
      culturalSignificance: flower.culturalSignificance,
    });
    setColorInput('');
    setTagInput('');
    setMeaningInput('');
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      await updateFlower.mutateAsync({ id: editTarget._id, data: form });
    } else {
      await createFlower.mutateAsync(form);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteFlower.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  };

  const addChip = (
    list: string[] | undefined,
    value: string,
    setter: (list: string[]) => void,
    inputSetter: (v: string) => void,
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const arr = list ?? [];
    if (!arr.includes(trimmed)) setter([...arr, trimmed]);
    inputSetter('');
  };

  const removeChip = (list: string[] | undefined, idx: number, setter: (list: string[]) => void) => {
    setter((list ?? []).filter((_, i) => i !== idx));
  };

  const toggleSeason = (s: string) => {
    const current = form.seasons ?? [];
    setForm({
      ...form,
      seasons: current.includes(s) ? current.filter((x) => x !== s) : [...current, s],
    });
  };

  const isMutating = createFlower.isPending || updateFlower.isPending;

  // ── Slug auto-generator ────────────────────────────────────────────────
  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Filters ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc tag..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Season */}
            <Select
              options={SEASON_OPTIONS}
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                setPage(1);
              }}
            />

            {/* Availability */}
            <Select
              options={AVAILABILITY_OPTIONS}
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
            />

            {/* Create */}
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Thêm hoa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="lg" />
            </div>
          ) : flowers.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Flower2 className="mx-auto h-10 w-10 mb-2 opacity-40" />
              <p>Không tìm thấy hoa nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/60">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Hoa</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Màu sắc</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Mùa</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Ngày tạo</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {flowers.map((f) => (
                    <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name + image */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {f.images?.[0]?.url ? (
                            <AppImage
                              src={f.images[0].url}
                              alt={f.name.vi}
                              className="w-10 h-10 rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                              <Flower2 className="w-5 h-5 text-rose-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{f.name.vi}</p>
                            <p className="text-xs text-gray-400">{f.name.en}</p>
                          </div>
                        </div>
                      </td>
                      {/* Colors */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {f.colors.slice(0, 3).map((c) => (
                            <Badge key={c} variant="default" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                          {f.colors.length > 3 && (
                            <Badge variant="default" className="text-xs">
                              +{f.colors.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      {/* Season */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {f.seasons.map((s) => (
                            <Badge key={s} variant="default" className="text-xs">
                              {SEASON_LABELS[s] || s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      {/* Availability */}
                      <td className="px-4 py-3">
                        <Badge variant={f.isAvailable ? 'success' : 'danger'}>
                          {f.isAvailable ? 'Đang bán' : 'Ngừng bán'}
                        </Badge>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(f.createdAt)}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-blue-600"
                            onClick={() => openEdit(f)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              f.isAvailable
                                ? 'text-gray-500 hover:text-amber-600'
                                : 'text-gray-500 hover:text-emerald-600',
                            )}
                            onClick={() => toggleAvailability.mutate(f._id)}
                          >
                            {f.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => setDeleteTarget(f)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ──────────────────────────────────────────── */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Hiển thị {flowers.length} / {pagination.total} hoa
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="flex items-center text-sm text-gray-600 px-2">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Create / Edit Modal ─────────────────────────────────────── */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto p-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTarget ? 'Chỉnh sửa hoa' : 'Thêm hoa mới'}
          </h2>

          {/* Name vi / en */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tên (VI) *</label>
              <Input
                required
                value={form.name.vi}
                onChange={(e) => {
                  const vi = e.target.value;
                  setForm({
                    ...form,
                    name: { ...form.name, vi },
                    slug: editTarget ? form.slug : autoSlug(vi),
                  });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tên (EN) *</label>
              <Input
                required
                value={form.name.en}
                onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
              />
            </div>
          </div>

          {/* Scientific name + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tên khoa học</label>
              <Input
                value={form.scientificName ?? ''}
                onChange={(e) => setForm({ ...form, scientificName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Slug *</label>
              <Input
                required
                pattern="[a-z0-9-]+"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
          </div>

          {/* Description vi / en */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả (VI) *</label>
              <Textarea
                required
                rows={3}
                value={form.description.vi}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, vi: e.target.value } })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả (EN) *</label>
              <Textarea
                required
                rows={3}
                value={form.description.en}
                onChange={(e) =>
                  setForm({ ...form, description: { ...form.description, en: e.target.value } })
                }
              />
            </div>
          </div>

          {/* Colors (chip input) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              <Palette className="w-3.5 h-3.5 inline mr-1" />
              Màu sắc *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.colors ?? []).map((c, i) => (
                <Badge key={i} variant="default" className="gap-1 pr-1">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeChip(form.colors, i, (v) => setForm({ ...form, colors: v }))}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Nhập màu rồi nhấn Enter..."
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addChip(form.colors, colorInput, (v) => setForm({ ...form, colors: v }), setColorInput);
                }
              }}
            />
          </div>

          {/* Seasons (toggle buttons) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              <Leaf className="w-3.5 h-3.5 inline mr-1" />
              Mùa
            </label>
            <div className="flex flex-wrap gap-2">
              {['spring', 'summer', 'autumn', 'winter', 'all_year'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSeason(s)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition-colors',
                    (form.seasons ?? []).includes(s)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40',
                  )}
                >
                  {SEASON_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Meanings (chip input) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Ý nghĩa</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.meanings ?? []).map((m, i) => (
                <Badge key={i} variant="default" className="gap-1 pr-1">
                  {m}
                  <button
                    type="button"
                    onClick={() =>
                      removeChip(form.meanings, i, (v) => setForm({ ...form, meanings: v }))
                    }
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Nhập ý nghĩa rồi nhấn Enter..."
              value={meaningInput}
              onChange={(e) => setMeaningInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addChip(
                    form.meanings,
                    meaningInput,
                    (v) => setForm({ ...form, meanings: v }),
                    setMeaningInput,
                  );
                }
              }}
            />
          </div>

          {/* Tags (chip input) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags ?? []).map((t, i) => (
                <Badge key={i} variant="default" className="gap-1 pr-1">
                  {t}
                  <button
                    type="button"
                    onClick={() => removeChip(form.tags, i, (v) => setForm({ ...form, tags: v }))}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Nhập tag rồi nhấn Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addChip(form.tags, tagInput, (v) => setForm({ ...form, tags: v }), setTagInput);
                }
              }}
            />
          </div>

          {/* Image URL (simple input) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">URL ảnh chính</label>
            <Input
              type="url"
              placeholder="https://..."
              value={form.images?.[0]?.url ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  images: e.target.value
                    ? [{ url: e.target.value, isPrimary: true }]
                    : [],
                })
              }
            />
          </div>

          {/* Availability + Popularity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={form.isAvailable ?? true}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700">
                Đang bán
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Điểm phổ biến</label>
              <Input
                type="number"
                min={0}
                value={form.popularityScore ?? 0}
                onChange={(e) => setForm({ ...form, popularityScore: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? <Spinner size="sm" /> : editTarget ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa <strong>{deleteTarget?.name.vi}</strong>? Hành động này không thể hoàn
            tác và sẽ xóa cả dữ liệu ý nghĩa liên quan.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteFlower.isPending}
            >
              {deleteFlower.isPending ? <Spinner size="sm" /> : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
