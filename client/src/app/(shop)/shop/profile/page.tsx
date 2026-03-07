'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useMyShop, useUpdateShop } from '@/hooks/use-shop-management';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Shop } from '@/hooks/use-shops';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = [
  { day: 1, label: 'Thứ 2' },
  { day: 2, label: 'Thứ 3' },
  { day: 3, label: 'Thứ 4' },
  { day: 4, label: 'Thứ 5' },
  { day: 5, label: 'Thứ 6' },
  { day: 6, label: 'Thứ 7' },
  { day: 0, label: 'Chủ nhật' },
];

interface HourEntry {
  day: number;
  open: string;
  close: string;
  isClosed: boolean;
}

function makeDefaultHours(): HourEntry[] {
  return DAY_NAMES.map(({ day }) => ({
    day,
    open: '08:00',
    close: '20:00',
    isClosed: false,
  }));
}

function hoursFromShop(shop: Shop): HourEntry[] {
  const defaults = makeDefaultHours();
  return defaults.map((def) => {
    const found = shop.operatingHours.find((h) => h.day === def.day);
    return found
      ? { day: def.day, open: found.open, close: found.close, isClosed: found.isClosed }
      : def;
  });
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopProfilePage() {
  const { data: shop, isLoading } = useMyShop();
  const updateShop = useUpdateShop();

  // ── Section 1: Basic info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  // ── Address
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  // ── Section 2: Operating hours
  const [hours, setHours] = useState<HourEntry[]>(makeDefaultHours());

  // ── Section 3: Delivery config
  const [maxDistance, setMaxDistance] = useState('');
  const [baseFee, setBaseFee] = useState('');
  const [freeAboveAmount, setFreeAboveAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  // ── Section 4: Bank account
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // ── Pre-fill from shop data
  useEffect(() => {
    if (!shop) return;
    setName(shop.name ?? '');
    setDescription(shop.description ?? '');
    setPhone(shop.phone ?? '');
    setStreet(shop.address?.street ?? '');
    setWard(shop.address?.ward ?? '');
    setDistrict(shop.address?.district ?? '');
    setCity(shop.address?.city ?? '');
    setHours(hoursFromShop(shop));
    setMaxDistance(String(shop.deliveryConfig?.maxDistance ?? ''));
    setBaseFee(String(shop.deliveryConfig?.baseFee ?? ''));
    setFreeAboveAmount(String(shop.deliveryConfig?.freeAboveAmount ?? ''));
    // estimatedTime is stored as a string like "30" minutes
    setEstimatedTime(String(shop.deliveryConfig?.estimatedTime ?? ''));
  }, [shop]);

  const updateHour = (day: number, field: keyof HourEntry, value: string | boolean) => {
    setHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, [field]: value } : h)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateShop.mutateAsync({
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        phone: phone.trim() || undefined,
        address: {
          street: street.trim(),
          ward: ward.trim(),
          district: district.trim(),
          city: city.trim(),
        },
        operatingHours: hours,
        deliveryConfig:
          maxDistance || baseFee || freeAboveAmount || estimatedTime
            ? {
                maxDistance: Number(maxDistance) || 0,
                baseFee: Number(baseFee) || 0,
                freeAboveAmount: Number(freeAboveAmount) || 0,
                estimatedTime: estimatedTime.trim() || '30',
              }
            : undefined,
        bankAccount:
          bankName || accountNumber || accountHolder
            ? {
                bankName: bankName.trim(),
                accountNumber: accountNumber.trim(),
                accountHolder: accountHolder.trim(),
              }
            : undefined,
      });
      toast.success('Lưu thông tin cửa hàng thành công!');
    } catch {
      toast.error('Lưu thất bại. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-sm text-gray-400">Đang tải thông tin cửa hàng...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Section 1: Thông tin cơ bản ───────────────────────────────── */}
      <Section title="Thông tin cơ bản">
        <Input
          label="Tên cửa hàng"
          placeholder="Tên cửa hàng của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          label="Mô tả"
          placeholder="Giới thiệu về cửa hàng của bạn..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          autoGrow
        />
        <Input
          label="Số điện thoại"
          placeholder="VD: 0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Số nhà, tên đường"
            placeholder="VD: 123 Nguyễn Huệ"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <Input
            label="Phường / Xã"
            placeholder="VD: Phường Bến Nghé"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
          <Input
            label="Quận / Huyện"
            placeholder="VD: Quận 1"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <Input
            label="Tỉnh / Thành phố"
            placeholder="VD: TP. Hồ Chí Minh"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </Section>

      {/* ── Section 2: Giờ hoạt động ──────────────────────────────────── */}
      <Section title="Giờ hoạt động">
        <div className="space-y-3">
          {DAY_NAMES.map(({ day, label }) => {
            const entry = hours.find((h) => h.day === day) ?? {
              day,
              open: '08:00',
              close: '20:00',
              isClosed: false,
            };
            return (
              <div
                key={day}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors',
                  entry.isClosed
                    ? 'border-gray-100 bg-gray-50/50'
                    : 'border-rose-100 bg-rose-50/30',
                )}
              >
                {/* Day name */}
                <span className="w-20 shrink-0 text-sm font-medium text-gray-700">{label}</span>

                {/* Closed toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <div
                    onClick={() => updateHour(day, 'isClosed', !entry.isClosed)}
                    className={cn(
                      'h-5 w-5 flex items-center justify-center rounded border-2 transition-colors cursor-pointer',
                      entry.isClosed
                        ? 'border-red-400 bg-red-400'
                        : 'border-gray-300 bg-white',
                    )}
                  >
                    {entry.isClosed && (
                      <svg
                        className="h-3 w-3 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M2 6h8" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">Đóng</span>
                </label>

                {/* Time inputs */}
                {entry.isClosed ? (
                  <span className="flex-1 text-sm text-gray-400 italic text-center">
                    Nghỉ
                  </span>
                ) : (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="time"
                      value={entry.open}
                      onChange={(e) => updateHour(day, 'open', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                    <span className="text-sm text-gray-400">—</span>
                    <input
                      type="time"
                      value={entry.close}
                      onChange={(e) => updateHour(day, 'close', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Section 3: Giao hàng ──────────────────────────────────────── */}
      <Section title="Cấu hình giao hàng">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Khoảng cách giao tối đa (km)"
            type="number"
            placeholder="VD: 10"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            min="0"
            step="1"
          />
          <Input
            label="Phí giao hàng cơ bản (VNĐ)"
            type="number"
            placeholder="VD: 30000"
            value={baseFee}
            onChange={(e) => setBaseFee(e.target.value)}
            min="0"
            step="1000"
          />
          <Input
            label="Miễn phí giao trên (VNĐ)"
            type="number"
            placeholder="VD: 300000"
            value={freeAboveAmount}
            onChange={(e) => setFreeAboveAmount(e.target.value)}
            min="0"
            step="1000"
          />
          <Input
            label="Thời gian giao dự kiến (phút)"
            type="number"
            placeholder="VD: 45"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            min="1"
            step="5"
          />
        </div>
      </Section>

      {/* ── Section 4: Tài khoản ngân hàng ───────────────────────────── */}
      <Section title="Tài khoản ngân hàng">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Tên ngân hàng"
            placeholder="VD: Vietcombank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <Input
            label="Số tài khoản"
            placeholder="VD: 0123456789"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <div className="sm:col-span-2">
            <Input
              label="Tên chủ tài khoản"
              placeholder="VD: NGUYEN VAN A"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ── Save button ───────────────────────────────────────────────── */}
      <div className="flex justify-end rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <Button
          type="submit"
          isLoading={updateShop.isPending}
          leftIcon={<Save className="h-4 w-4" />}
          className="bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400 text-white min-w-[160px]"
        >
          {updateShop.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
}
