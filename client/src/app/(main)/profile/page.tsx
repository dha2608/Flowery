'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Camera, Settings, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout';
import { Avatar, Button, Input, Spinner } from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useProfile,
  useUpdateProfile,
  useUpdateAvatar,
  type UserAddress,
} from '@/hooks/use-profile';

export default function ProfilePage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Two independent mutations so loading states don't bleed between sections
  const updatePersonalInfo = useUpdateProfile();
  const updateAddress = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Local form state ────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<UserAddress>({
    street: '',
    ward: '',
    district: '',
    city: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Sync once profile loads
  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? '');
    setPhone(profile.phone ?? '');
    setAddress({
      street: profile.address?.street ?? '',
      ward: profile.address?.ward ?? '',
      district: profile.address?.district ?? '',
      city: profile.address?.city ?? '',
    });
  }, [profile]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSavePersonalInfo = useCallback(async () => {
    try {
      await updatePersonalInfo.mutateAsync({ name: name.trim(), phone: phone.trim() });
      toast.success('Đã lưu thông tin cá nhân');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại. Vui lòng thử lại.');
    }
  }, [name, phone, updatePersonalInfo]);

  const handleSaveAddress = useCallback(async () => {
    try {
      await updateAddress.mutateAsync({ address });
      toast.success('Đã lưu địa chỉ');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại. Vui lòng thử lại.');
    }
  }, [address, updateAddress]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Optimistic preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      try {
        await updateAvatar.mutateAsync(file);
        toast.success('Đã cập nhật ảnh đại diện');
      } catch (err) {
        setAvatarPreview(null);
        toast.error(err instanceof Error ? err.message : 'Tải ảnh thất bại. Vui lòng thử lại.');
      } finally {
        // Reset the input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [updateAvatar],
  );

  // ─── Loading gate ─────────────────────────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải hồ sơ…" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <Container className="py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="heading-lg font-serif">Tài khoản của tôi</h1>
        <p className="body-base text-stone-500 mt-1">Quản lý thông tin cá nhân và địa chỉ của bạn</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* ── Avatar ───────────────────────────────────────────────────────── */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h2 className="heading-sm font-serif">Ảnh đại diện</h2>
            <p className="body-sm text-stone-500 mt-1">Ảnh hiển thị trên hồ sơ và đơn hàng của bạn</p>
          </div>
          <div className="flex items-center gap-6">
            <Avatar
              src={avatarPreview ?? profile.avatar}
              name={profile.name}
              size="xl"
              className="ring-4 ring-primary-50"
            />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera className="h-4 w-4" />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={updateAvatar.isPending}
                disabled={updateAvatar.isPending}
              >
                Thay đổi ảnh
              </Button>
              <p className="mt-2 body-sm text-stone-400">PNG, JPG, GIF, WEBP — tối đa 5 MB</p>
            </div>
          </div>
        </div>

        {/* ── Personal info ────────────────────────────────────────────────── */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h2 className="heading-sm font-serif">Thông tin cá nhân</h2>
            <p className="body-sm text-stone-500 mt-1">Tên và số điện thoại liên hệ của bạn</p>
          </div>
          <div className="grid gap-4 mb-6">
            <Input
              label="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
            />
            <Input
              label="Email"
              value={profile.email}
              readOnly
              className="bg-stone-50 cursor-not-allowed text-stone-400"
              helperText="Email không thể thay đổi"
              autoComplete="email"
            />
            <Input
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901 234 567"
              type="tel"
              autoComplete="tel"
            />
          </div>
          <Button
            onClick={handleSavePersonalInfo}
            isLoading={updatePersonalInfo.isPending}
            disabled={!name.trim()}
          >
            Lưu thông tin
          </Button>
        </div>

        {/* ── Preferences link ─────────────────────────────────────────────── */}
        <Link href="/profile/preferences" className="group block">
          <div className="card-base card-hover p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary-500" />
                <h2 className="heading-sm font-serif">Tùy chỉnh sở thích</h2>
              </div>
              <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <p className="body-sm text-stone-500 mt-2">
              Cài đặt loại hoa yêu thích, ngân sách và thông báo cá nhân hoá
            </p>
          </div>
        </Link>

        {/* ── Address ──────────────────────────────────────────────────────── */}
        <div className="card-base p-6">
          <div className="mb-4">
            <h2 className="heading-sm font-serif">Địa chỉ giao hàng</h2>
            <p className="body-sm text-stone-500 mt-1">Địa chỉ mặc định khi đặt hoa</p>
          </div>
          <div className="grid gap-4 mb-6">
            <Input
              label="Địa chỉ (số nhà, tên đường)"
              value={address.street}
              onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
              placeholder="123 Đường Lê Lợi"
              autoComplete="street-address"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phường / Xã"
                value={address.ward}
                onChange={(e) => setAddress((a) => ({ ...a, ward: e.target.value }))}
                placeholder="Phường Bến Nghé"
              />
              <Input
                label="Quận / Huyện"
                value={address.district}
                onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))}
                placeholder="Quận 1"
              />
            </div>
            <Input
              label="Thành phố"
              value={address.city}
              onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
              placeholder="TP. Hồ Chí Minh"
              autoComplete="address-level2"
            />
          </div>
          <Button onClick={handleSaveAddress} isLoading={updateAddress.isPending}>
            Lưu địa chỉ
          </Button>
        </div>
      </div>
    </Container>
  );
}
