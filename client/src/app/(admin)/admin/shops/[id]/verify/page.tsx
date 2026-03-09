'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Truck,
  CreditCard,
  FileText,
  User,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Spinner,
  Textarea,
} from '@/components/ui';
import { useAdminShop, useVerifyShop, useRejectShop } from '@/hooks/use-admin';
import { formatDate } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const STATUS_BADGE: Record<string, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ duyệt',
  verified: 'Đã xác minh',
  rejected: 'Từ chối',
};

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-stone-800">
          <span className="text-stone-500">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-gray-900">{value ?? '—'}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminShopVerifyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data: res, isLoading, isError } = useAdminShop(id);
  const shop = res?.data;

  const verifyShop = useVerifyShop();
  const rejectShop = useRejectShop();

  const handleVerify = () => {
    verifyShop.mutate(id, {
      onSuccess: () => router.replace('/admin/shops'),
    });
  };

  const handleReject = () => {
    rejectShop.mutate(
      { id, reason: rejectReason },
      { onSuccess: () => router.replace('/admin/shops') }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin cửa hàng..." />
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Không thể tải thông tin cửa hàng.</p>
        <Link href="/admin/shops">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/shops"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Danh sách cửa hàng
        </Link>
        <Badge variant={STATUS_BADGE[shop.status] ?? 'default'}>
          {STATUS_LABEL[shop.status] ?? shop.status}
        </Badge>
      </div>

      {/* Basic Info */}
      <Section icon={<FileText className="h-5 w-5" />} title="Thông tin cửa hàng">
        {shop.logo?.url && (
          <div className="mb-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200">
              <AppImage src={shop.logo.url} alt={shop.name} className="object-cover" />
            </div>
          </div>
        )}
        <InfoRow label="Tên cửa hàng" value={shop.name} />
        <InfoRow label="Mô tả" value={shop.description} />
        <InfoRow label="Slug" value={<span className="font-mono text-xs">{shop.slug}</span>} />
        <InfoRow label="Giấy phép kinh doanh" value={shop.businessLicense} />
        <InfoRow label="Ngày đăng ký" value={formatDate(shop.createdAt)} />
        {shop.rejectionReason && (
          <InfoRow
            label="Lý do từ chối trước"
            value={<span className="text-red-600">{shop.rejectionReason}</span>}
          />
        )}
      </Section>

      {/* Owner Info */}
      <Section icon={<User className="h-5 w-5" />} title="Thông tin chủ shop">
        <InfoRow label="Họ tên" value={shop.owner.name} />
        <InfoRow label="Email" value={shop.owner.email} />
        <InfoRow label="Điện thoại" value={shop.owner.phone} />
        <InfoRow
          label="ID chủ shop"
          value={<span className="font-mono text-xs">{shop.owner._id}</span>}
        />
      </Section>

      {/* Contact & Address */}
      <Section icon={<MapPin className="h-5 w-5" />} title="Địa chỉ & Liên hệ">
        <InfoRow label="Điện thoại cửa hàng" value={shop.phone} />
        <InfoRow label="Đường" value={shop.address?.street} />
        <InfoRow label="Quận/Huyện" value={shop.address?.district} />
        <InfoRow label="Thành phố" value={shop.address?.city} />
        <InfoRow label="Tỉnh/Thành" value={shop.address?.province} />
      </Section>

      {/* Operating Hours */}
      {shop.operatingHours && shop.operatingHours.length > 0 && (
        <Section icon={<Clock className="h-5 w-5" />} title="Giờ hoạt động">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-left font-medium text-gray-500">Ngày</th>
                  <th className="py-2 text-center font-medium text-gray-500">Mở cửa</th>
                  <th className="py-2 text-center font-medium text-gray-500">Đóng cửa</th>
                  <th className="py-2 text-center font-medium text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shop.operatingHours.map((h) => (
                  <tr key={h.dayOfWeek} className="text-sm">
                    <td className="py-2.5 text-gray-700">
                      {DAY_NAMES[h.dayOfWeek] ?? `Ngày ${h.dayOfWeek}`}
                    </td>
                    <td className="py-2.5 text-center text-gray-600">{h.open}</td>
                    <td className="py-2.5 text-center text-gray-600">{h.close}</td>
                    <td className="py-2.5 text-center">
                      <Badge variant={h.isOpen ? 'success' : 'danger'} size="sm">
                        {h.isOpen ? 'Mở cửa' : 'Đóng cửa'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Delivery Config */}
      {shop.deliveryConfig && (
        <Section icon={<Truck className="h-5 w-5" />} title="Cấu hình giao hàng">
          <InfoRow
            label="Giao hàng"
            value={
              <Badge
                variant={shop.deliveryConfig.isDeliveryEnabled ? 'success' : 'default'}
                size="sm"
              >
                {shop.deliveryConfig.isDeliveryEnabled ? 'Có hỗ trợ' : 'Không hỗ trợ'}
              </Badge>
            }
          />
          {shop.deliveryConfig.isDeliveryEnabled && (
            <>
              <InfoRow
                label="Bán kính giao hàng"
                value={
                  shop.deliveryConfig.deliveryRadius
                    ? `${shop.deliveryConfig.deliveryRadius} km`
                    : undefined
                }
              />
              <InfoRow
                label="Đơn hàng tối thiểu"
                value={
                  shop.deliveryConfig.minimumOrderAmount != null
                    ? `${shop.deliveryConfig.minimumOrderAmount.toLocaleString('vi-VN')}đ`
                    : undefined
                }
              />
              <InfoRow
                label="Phí giao hàng"
                value={
                  shop.deliveryConfig.deliveryFee != null
                    ? `${shop.deliveryConfig.deliveryFee.toLocaleString('vi-VN')}đ`
                    : undefined
                }
              />
              <InfoRow
                label="Miễn phí giao từ"
                value={
                  shop.deliveryConfig.freeDeliveryThreshold != null
                    ? `${shop.deliveryConfig.freeDeliveryThreshold.toLocaleString('vi-VN')}đ`
                    : undefined
                }
              />
            </>
          )}
        </Section>
      )}

      {/* Bank Account */}
      {shop.bankAccount && (
        <Section icon={<CreditCard className="h-5 w-5" />} title="Tài khoản ngân hàng">
          <InfoRow label="Ngân hàng" value={shop.bankAccount.bankName} />
          <InfoRow label="Số tài khoản" value={shop.bankAccount.accountNumber} />
          <InfoRow label="Tên chủ tài khoản" value={shop.bankAccount.accountName} />
        </Section>
      )}

      {/* Action Buttons */}
      <Card className="border-2 border-dashed border-stone-200 bg-stone-50/30">
        <CardContent className="py-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Hành động xét duyệt</h3>

          {!showRejectForm ? (
            <div className="flex gap-3">
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={handleVerify}
                isLoading={verifyShop.isPending}
                leftIcon={<CheckCircle className="h-4 w-4" />}
                disabled={shop.status === 'verified'}
              >
                Xác minh cửa hàng
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectForm(true)}
                leftIcon={<XCircle className="h-4 w-4" />}
                disabled={shop.status === 'rejected'}
              >
                Từ chối
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Nhập lý do từ chối cửa hàng <span className="font-semibold">{shop.name}</span>:
              </p>
              <Textarea
                placeholder="Nhập lý do từ chối để thông báo cho chủ shop..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  isLoading={rejectShop.isPending}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Xác nhận từ chối
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
