'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Spinner,
  Modal,
  Avatar,
} from '@/components/ui';
import {
  useAdminUsers,
  useToggleUserStatus,
  useDeleteUser,
  type AdminUser,
} from '@/hooks/use-admin';
import { formatDate, cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'user', label: 'Người dùng' },
  { key: 'shop_owner', label: 'Chủ shop' },
  { key: 'admin', label: 'Admin' },
] as const;

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

const LIMIT = 15;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const { data: res, isLoading } = useAdminUsers({ page, limit: LIMIT, role: role || undefined, search: search || undefined });
  const users: AdminUser[] = (res?.data as AdminUser[] | undefined) ?? [];
  const pagination = res?.pagination;

  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const handleSearch = useCallback(() => {
    setSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleRoleChange = (r: string) => {
    setRole(r);
    setPage(1);
  };

  const handleToggle = (user: AdminUser) => {
    toggleStatus.mutate({ id: user._id, isActive: !user.isActive });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-64"
              />
              <Button size="sm" onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />}>
                Tìm
              </Button>
            </div>

            {/* Role tabs */}
            <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
              {ROLE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleRoleChange(tab.key)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                    role === tab.key
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-800',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" label="Đang tải..." />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Không tìm thấy người dùng nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Người dùng</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Vai trò</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Điện thoại</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Ngày tham gia</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar?.url} name={user.name} size="sm" />
                          <div className="min-w-0">
                            <Link
                              href={`/admin/users/${user._id}`}
                              className="font-medium text-stone-900 hover:text-stone-600 transition-colors truncate block"
                            >
                              {user.name}
                            </Link>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ROLE_BADGE[user.role] ?? 'default'} size="sm">
                          {ROLE_LABELS[user.role] ?? user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.phone ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.isActive ? 'success' : 'danger'} size="sm">
                          {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggle(user)}
                            isLoading={
                              toggleStatus.isPending &&
                              toggleStatus.variables?.id === user._id
                            }
                            title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            className={cn(
                              user.isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50',
                            )}
                          >
                            {user.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(user)}
                            className="text-red-500 hover:bg-red-50"
                            title="Xóa người dùng"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} &bull;{' '}
            {pagination.total.toLocaleString('vi-VN')} người dùng
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xóa người dùng"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa người dùng{' '}
            <span className="font-semibold text-gray-900">{deleteTarget?.name}</span>? Hành động
            này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteUser.isPending}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
