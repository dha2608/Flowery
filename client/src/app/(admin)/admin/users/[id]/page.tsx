'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Spinner,
  Avatar,
  Modal,
} from '@/components/ui';
import { useAdminUser, useToggleUserStatus, useDeleteUser } from '@/hooks/use-admin';
import { formatDate, cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  user: 'Người dùng',
  shop_owner: 'Chủ shop',
  admin: 'Admin',
};

const ROLE_BADGE: Record<string, 'default' | 'info' | 'warning' | 'danger'> = {
  user: 'default',
  shop_owner: 'info',
  admin: 'danger',
};

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: res, isLoading, isError } = useAdminUser(id);
  const user = res?.data;

  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const handleToggle = () => {
    if (!user) return;
    toggleStatus.mutate({ id: user._id, isActive: !user.isActive });
  };

  const handleDelete = () => {
    if (!user) return;
    deleteUser.mutate(user._id, {
      onSuccess: () => router.replace('/admin/users'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Không thể tải thông tin người dùng.</p>
        <Link href="/admin/users">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Danh sách người dùng
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Avatar src={user.avatar?.url} name={user.name} size="xl" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                  <Badge variant={ROLE_BADGE[user.role] ?? 'default'} className="mt-1">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </Badge>
                </div>
                <Badge variant={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                </Badge>
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Điện thoại"
                  value={user.phone ?? '—'}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Ngày tham gia"
                  value={formatDate(user.createdAt)}
                />
                <InfoRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="ID"
                  value={<span className="font-mono text-xs text-gray-500">{user._id}</span>}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                <Button
                  className={cn(
                    'w-full',
                    user.isActive
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  )}
                  onClick={handleToggle}
                  isLoading={toggleStatus.isPending}
                  leftIcon={
                    user.isActive ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )
                  }
                >
                  {user.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Xóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity stats */}
        <div className="space-y-4 lg:col-span-2">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Đơn hàng', value: user.ordersCount ?? 0 },
              { label: 'Đánh giá', value: user.reviewsCount ?? 0 },
              { label: 'Mối quan hệ', value: user.relationshipsCount ?? 0 },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="py-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="divide-y divide-gray-100">
                {[
                  { label: 'Mã người dùng', value: user._id },
                  { label: 'Vai trò', value: ROLE_LABELS[user.role] ?? user.role },
                  {
                    label: 'Trạng thái',
                    value: user.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa',
                  },
                  { label: 'Ngày đăng ký', value: formatDate(user.createdAt) },
                  {
                    label: 'Cập nhật lần cuối',
                    value: user.updatedAt ? formatDate(user.updatedAt) : '—',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-mono text-xs font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa tài khoản"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa tài khoản của{' '}
            <span className="font-semibold text-gray-900">{user.name}</span>? Hành động này{' '}
            <span className="font-medium text-red-600">không thể hoàn tác</span>.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteUser.isPending}>
              Xóa tài khoản
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
