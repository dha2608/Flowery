'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, ImageOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateProduct } from '@/hooks/use-shop-management';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { value: 'single_flower', label: 'Hoa đơn' },
  { value: 'bouquet', label: 'Bó hoa' },
  { value: 'arrangement', label: 'Cắm bình' },
  { value: 'basket', label: 'Giỏ hoa' },
  { value: 'box', label: 'Hộp hoa' },
  { value: 'subscription_pack', label: 'Gói đăng ký' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const CUSTOMIZATION_TYPES = [
  { value: 'color', label: 'Màu sắc' },
  { value: 'size', label: 'Kích cỡ' },
  { value: 'message', label: 'Lời nhắn' },
  { value: 'ribbon', label: 'Ruy băng' },
  { value: 'wrapping', label: 'Bao bì' },
  { value: 'other', label: 'Khác' },
];

const OCCASIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'holiday', label: 'Ngày lễ' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'mothersday', label: 'Ngày của Mẹ' },
  { value: 'congratulations', label: 'Chúc mừng' },
  { value: 'funeral', label: 'Chia buồn' },
  { value: 'romance', label: 'Tình yêu' },
  { value: 'thankyou', label: 'Cảm ơn' },
  { value: 'apology', label: 'Xin lỗi' },
];

const EMOTIONS = [
  { value: 'romantic', label: 'Lãng mạn' },
  { value: 'grateful', label: 'Biết ơn' },
  { value: 'joyful', label: 'Vui vẻ' },
  { value: 'sympathetic', label: 'Đồng cảm' },
  { value: 'respectful', label: 'Kính trọng' },
  { value: 'apologetic', label: 'Xin lỗi' },
  { value: 'celebratory', label: 'Chúc mừng' },
  { value: 'passionate', label: 'Đam mê' },
  { value: 'hopeful', label: 'Hy vọng' },
  { value: 'peaceful', label: 'Bình yên' },
  { value: 'friendly', label: 'Thân thiện' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageEntry {
  url: string;
  isPrimary: boolean;
}

interface FlowerEntry {
  flowerId: string;
  quantity: string;
  color: string;
}

interface CustomOption {
  name: string;
  type: string;
  options: string; // comma-separated
  priceModifier: string;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ─── Tag toggle ───────────────────────────────────────────────────────────────

function TagToggle({
  items,
  selected,
  onChange,
}: {
  items: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item.value);
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => toggle(item.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-all',
              active
                ? 'bg-rose-500 text-white ring-rose-500 shadow-sm'
                : 'bg-white text-gray-600 ring-gray-200 hover:ring-rose-300 hover:text-rose-600',
            )}
          >
            {active && <Check className="h-3 w-3" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  // ── Basic info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // ── Pricing & stock
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [stockQuantity, setStockQuantity] = useState('0');

  // ── Images
  const [images, setImages] = useState<ImageEntry[]>([{ url: '', isPrimary: true }]);

  // ── Flower composition
  const [flowers, setFlowers] = useState<FlowerEntry[]>([]);

  // ── Occasions & emotions
  const [occasions, setOccasions] = useState<string[]>([]);
  const [emotions, setEmotions] = useState<string[]>([]);

  // ── Customization
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);

  // ── Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const setImagePrimary = (idx: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === idx })),
    );
  };

  const updateImage = (idx: number, url: string) => {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, url } : img)));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Ensure at least one primary
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const addImage = () => {
    setImages((prev) => [...prev, { url: '', isPrimary: false }]);
  };

  const addFlower = () => {
    setFlowers((prev) => [...prev, { flowerId: '', quantity: '1', color: '' }]);
  };

  const updateFlower = (idx: number, field: keyof FlowerEntry, value: string) => {
    setFlowers((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    );
  };

  const removeFlower = (idx: number) => {
    setFlowers((prev) => prev.filter((_, i) => i !== idx));
  };

  const addCustomOption = () => {
    setCustomOptions((prev) => [
      ...prev,
      { name: '', type: 'color', options: '', priceModifier: '0' },
    ]);
  };

  const updateCustomOption = (idx: number, field: keyof CustomOption, value: string) => {
    setCustomOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt)),
    );
  };

  const removeCustomOption = (idx: number) => {
    setCustomOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Tên sản phẩm không được để trống';
    if (!category) errs.category = 'Vui lòng chọn danh mục';
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum < 1000) {
      errs.price = 'Giá gốc phải từ 1.000đ trở lên';
    }
    if (salePrice) {
      const salePriceNum = Number(salePrice);
      if (isNaN(salePriceNum) || salePriceNum <= 0) {
        errs.salePrice = 'Giá khuyến mãi phải lớn hơn 0';
      } else if (salePriceNum >= priceNum) {
        errs.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
      }
    }
    const validImages = images.filter((img) => img.url.trim() !== '');
    if (validImages.length === 0) {
      errs.images = 'Cần ít nhất 1 URL hình ảnh hợp lệ';
    }
    if (!isUnlimited) {
      const qty = Number(stockQuantity);
      if (isNaN(qty) || qty < 0) errs.stock = 'Số lượng không hợp lệ';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const validImages = images.filter((img) => img.url.trim() !== '');
    // Ensure one primary
    const hasAnyPrimary = validImages.some((img) => img.isPrimary);
    if (!hasAnyPrimary && validImages.length > 0) {
      validImages[0].isPrimary = true;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: {
        quantity: isUnlimited ? 0 : Number(stockQuantity),
        isUnlimited,
      },
      images: validImages,
      flowerComposition:
        flowers.length > 0
          ? flowers
              .filter((f) => f.flowerId.trim())
              .map((f) => ({
                flowerId: f.flowerId.trim(),
                quantity: Math.max(1, Number(f.quantity)),
                color: f.color.trim() || undefined,
              }))
          : undefined,
      occasions,
      emotions,
      customizationOptions:
        customOptions.length > 0
          ? customOptions
              .filter((opt) => opt.name.trim())
              .map((opt) => ({
                name: opt.name.trim(),
                type: opt.type,
                options: opt.options
                  ? opt.options.split(',').map((s) => s.trim()).filter(Boolean)
                  : undefined,
                priceModifier: Number(opt.priceModifier) || 0,
              }))
          : undefined,
    };

    try {
      await createProduct.mutateAsync(payload);
      toast.success('Thêm sản phẩm thành công!');
      router.push('/shop/products');
    } catch {
      toast.error('Thêm sản phẩm thất bại. Vui lòng thử lại.');
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      {/* ── Section 1: Basic Info ──────────────────────────────────────── */}
      <Section title="Thông tin cơ bản">
        <Input
          label="Tên sản phẩm *"
          placeholder="VD: Bó hoa hồng đỏ Valentine 24 bông"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Textarea
          label="Mô tả sản phẩm"
          placeholder="Mô tả chi tiết về sản phẩm, đặc điểm nổi bật..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          autoGrow
        />

        <Select
          label="Danh mục *"
          placeholder="Chọn danh mục"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORY_OPTIONS}
          error={errors.category}
        />
      </Section>

      {/* ── Section 2: Pricing & Stock ─────────────────────────────────── */}
      <Section title="Giá & Kho hàng">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Giá gốc (VNĐ) *"
            type="number"
            placeholder="VD: 250000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            min="1000"
            step="1000"
          />
          <Input
            label="Giá khuyến mãi (VNĐ)"
            type="number"
            placeholder="Để trống nếu không giảm giá"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            error={errors.salePrice}
            min="1000"
            step="1000"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsUnlimited(!isUnlimited)}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors cursor-pointer',
                isUnlimited ? 'border-rose-500 bg-rose-500' : 'border-gray-300 bg-white',
              )}
            >
              {isUnlimited && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-700">
              Không giới hạn số lượng
            </span>
          </label>

          {!isUnlimited && (
            <Input
              label="Số lượng trong kho"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              error={errors.stock}
              min="0"
              step="1"
            />
          )}
        </div>
      </Section>

      {/* ── Section 3: Images ─────────────────────────────────────────── */}
      <Section title="Hình ảnh sản phẩm">
        {errors.images && (
          <p className="text-sm text-red-600" role="alert">{errors.images}</p>
        )}

        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {/* Preview */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {img.url ? (
                  <AppImage
                    src={img.url}
                    alt={`Ảnh ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageOff className="h-6 w-6 text-gray-300" />
                )}
              </div>

              {/* URL input */}
              <div className="flex-1">
                <Input
                  placeholder={`URL hình ảnh ${idx + 1}`}
                  value={img.url}
                  onChange={(e) => updateImage(idx, e.target.value)}
                />
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setImagePrimary(idx)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium transition-colors',
                      img.isPrimary ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500',
                    )}
                  >
                    <div
                      className={cn(
                        'h-3.5 w-3.5 rounded-full border-2',
                        img.isPrimary ? 'border-rose-500 bg-rose-500' : 'border-gray-300',
                      )}
                    />
                    {img.isPrimary ? 'Ảnh đại diện' : 'Đặt làm ảnh chính'}
                  </button>
                </div>
              </div>

              {/* Remove */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="mt-1 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Xóa ảnh"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={addImage}
        >
          Thêm hình ảnh
        </Button>
      </Section>

      {/* ── Section 4: Occasions & Emotions ───────────────────────────── */}
      <Section title="Dịp & Cảm xúc">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Phù hợp với dịp</p>
          <TagToggle
            items={OCCASIONS}
            selected={occasions}
            onChange={setOccasions}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Cảm xúc muốn truyền tải</p>
          <TagToggle
            items={EMOTIONS}
            selected={emotions}
            onChange={setEmotions}
          />
        </div>
      </Section>

      {/* ── Section 5: Flower Composition ─────────────────────────────── */}
      <Section title="Thành phần hoa (tuỳ chọn)">
        {flowers.length > 0 ? (
          <div className="space-y-3">
            {flowers.map((flower, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
              >
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input
                    placeholder="ID loài hoa"
                    value={flower.flowerId}
                    onChange={(e) => updateFlower(idx, 'flowerId', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Số lượng"
                    value={flower.quantity}
                    onChange={(e) => updateFlower(idx, 'quantity', e.target.value)}
                    min="1"
                  />
                  <Input
                    placeholder="Màu sắc"
                    value={flower.color}
                    onChange={(e) => updateFlower(idx, 'color', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFlower(idx)}
                  className="mt-1 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Thêm các loài hoa tạo nên sản phẩm này (không bắt buộc)
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={addFlower}
        >
          Thêm loài hoa
        </Button>
      </Section>

      {/* ── Section 6: Customization Options ──────────────────────────── */}
      <Section title="Tùy chọn cá nhân hóa (tuỳ chọn)">
        {customOptions.length > 0 ? (
          <div className="space-y-3">
            {customOptions.map((opt, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Tùy chọn {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomOption(idx)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Tên tùy chọn"
                    placeholder="VD: Màu ruy băng"
                    value={opt.name}
                    onChange={(e) => updateCustomOption(idx, 'name', e.target.value)}
                  />
                  <Select
                    label="Loại"
                    value={opt.type}
                    onChange={(e) => updateCustomOption(idx, 'type', e.target.value)}
                    options={CUSTOMIZATION_TYPES}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Các lựa chọn (cách bằng dấu phẩy)"
                    placeholder="VD: Đỏ, Trắng, Hồng"
                    value={opt.options}
                    onChange={(e) => updateCustomOption(idx, 'options', e.target.value)}
                    helperText="Bỏ trống nếu là nhập tự do"
                  />
                  <Input
                    label="Phụ phí thêm (VNĐ)"
                    type="number"
                    placeholder="0"
                    value={opt.priceModifier}
                    onChange={(e) =>
                      updateCustomOption(idx, 'priceModifier', e.target.value)
                    }
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Cho phép khách hàng cá nhân hóa sản phẩm (màu sắc, kích thước, lời nhắn...)
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={addCustomOption}
        >
          Thêm tùy chọn
        </Button>
      </Section>

      {/* ── Submit Bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={createProduct.isPending}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          isLoading={createProduct.isPending}
          className="bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400 text-white min-w-[140px]"
        >
          {createProduct.isPending ? 'Đang lưu...' : 'Đăng sản phẩm'}
        </Button>
      </div>
    </form>
  );
}
