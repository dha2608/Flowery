'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, Input, Modal, Spinner } from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  type Address,
  type AddressInput,
} from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

// ─── Empty blank form ─────────────────────────────────────────────────────────

const BLANK_FORM: AddressInput = {
  street: '',
  ward: '',
  district: '',
  city: '',
  isDefault: false,
};

// ─── Address Form (shared for Add / Edit) ────────────────────────────────────

interface AddressFormProps {
  value: AddressInput;
  onChange: (v: AddressInput) => void;
}

function AddressForm({ value, onChange }: AddressFormProps) {
  const set = (field: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [field]: e.target.value });

  return (
    <div className="grid gap-4">
      <Input
        label="Đường/Số nhà"
        placeholder="123 Đường Lê Lợi"
        value={value.street}
        onChange={set('street')}
        autoComplete="street-address"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phường/Xã"
          placeholder="Phường Bến Nghé"
          value={value.ward}
          onChange={set('ward')}
        />
        <Input
          label="Quận/Huyện"
          placeholder="Quận 1"
          value={value.district}
          onChange={set('district')}
        />
      </div>
      <Input
        label="Thành phố/Tỉnh"
        placeholder="TP. Hồ Chí Minh"
        value={value.city}
        onChange={set('city')}
        autoComplete="address-level2"
      />
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={value.isDefault ?? false}
          onChange={(e) => onChange({ ...value, isDefault: e.target.checked })}
          className="h-4 w-4 rounded border-stone-300 text-primary-600 accent-primary-600"
        />
        <span className="body-sm font-medium text-stone-700">Đặt làm mặc định</span>
      </label>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isUpdating,
}: AddressCardProps) {
  return (
    <div className={cn('card-base', address.isDefault ? 'border-primary-300 bg-primary-50/40' : '')}>
      <div className="flex items-start gap-4 p-4">
        {/* Icon */}
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
          <MapPin className="h-4 w-4 text-primary-600" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {address.isDefault && (
              <span className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-medium">
                Mặc định
              </span>
            )}
          </div>
          <p className="body-sm font-medium text-stone-900">{address.street}</p>
          <p className="mt-0.5 body-sm text-stone-500">
            {[address.ward, address.district, address.city].filter(Boolean).join(', ')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              onClick={() => onEdit(address)}
              disabled={isUpdating || isDeleting}
              className="h-8 px-2 text-stone-500 hover:text-primary-600"
            >
              Sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => onDelete(address)}
              isLoading={isDeleting}
              disabled={isUpdating || isDeleting}
              className="h-8 px-2 text-stone-500 hover:text-red-600"
            >
              Xóa
            </Button>
          </div>
          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address)}
              disabled={isUpdating || isDeleting}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-40"
            >
              Đặt làm mặc định
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteConfirmProps {
  address: Address | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmModal({ address, onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <Modal isOpen={!!address} onClose={onCancel} title="Xóa địa chỉ" size="sm">
      <p className="mb-1 body-sm text-stone-600">
        Bạn có chắc muốn xóa địa chỉ này không?
      </p>
      {address && (
        <p className="mb-5 rounded-lg bg-stone-50 px-3 py-2 body-sm text-stone-700">
          {address.street},{' '}
          {[address.ward, address.district, address.city].filter(Boolean).join(', ')}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isPending}>
          Hủy
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          isLoading={isPending}
          className="bg-red-600 hover:bg-red-700 text-white border-transparent"
        >
          Xóa địa chỉ
        </Button>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: addresses = [], isLoading } = useAddresses();

  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  // ── Modal state ───────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  // ── Form state ────────────────────────────────────────────────────────────
  const [addForm, setAddForm] = useState<AddressInput>(BLANK_FORM);
  const [editForm, setEditForm] = useState<AddressInput>(BLANK_FORM);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openEdit = useCallback((address: Address) => {
    setEditTarget(address);
    setEditForm({
      street: address.street,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
  }, []);

  const handleAdd = useCallback(async () => {
    if (!addForm.street.trim() || !addForm.city.trim()) {
      toast.error('Vui lòng nhập đường/số nhà và thành phố');
      return;
    }
    try {
      await addAddress.mutateAsync(addForm);
      toast.success('Đã thêm địa chỉ mới');
      setAddOpen(false);
      setAddForm(BLANK_FORM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Thêm địa chỉ thất bại');
    }
  }, [addForm, addAddress]);

  const handleEdit = useCallback(async () => {
    if (!editTarget) return;
    if (!editForm.street.trim() || !editForm.city.trim()) {
      toast.error('Vui lòng nhập đường/số nhà và thành phố');
      return;
    }
    try {
      await updateAddress.mutateAsync({ id: editTarget._id, data: editForm });
      toast.success('Đã cập nhật địa chỉ');
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cập nhật địa chỉ thất bại');
    }
  }, [editTarget, editForm, updateAddress]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteAddress.mutateAsync(deleteTarget._id);
      toast.success('Đã xóa địa chỉ');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xóa địa chỉ thất bại');
    }
  }, [deleteTarget, deleteAddress]);

  const handleSetDefault = useCallback(
    async (address: Address) => {
      try {
        await updateAddress.mutateAsync({ id: address._id, data: { isDefault: true } });
        toast.success('Đã đặt làm địa chỉ mặc định');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
      }
    },
    [updateAddress],
  );

  // ── Auth / loading gate ───────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải..." />
      </div>
    );
  }

  return (
    <Container className="py-10">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="heading-lg font-serif">Sổ địa chỉ</h1>
          <p className="body-base text-stone-500 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setAddForm(BLANK_FORM);
            setAddOpen(true);
          }}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      {/* Address list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Đang tải địa chỉ..." />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <MapPin className="h-7 w-7 text-primary-400" />
          </div>
          <h2 className="heading-sm font-serif">Chưa có địa chỉ nào</h2>
          <p className="body-base text-stone-500 mt-2 mb-6">
            Thêm địa chỉ để đặt hoa nhanh hơn
          </p>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setAddForm(BLANK_FORM);
              setAddOpen(true);
            }}
          >
            Thêm địa chỉ mới
          </Button>
        </div>
      ) : (
        <div className="grid max-w-2xl gap-3">
          {/* Sort: default first */}
          {[...addresses]
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onSetDefault={handleSetDefault}
                isDeleting={deleteAddress.isPending && deleteTarget?._id === address._id}
                isUpdating={updateAddress.isPending && editTarget?._id === address._id}
              />
            ))}
        </div>
      )}

      {/* ── Add address modal ───────────────────────────────────────────────── */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Thêm địa chỉ mới"
        size="md"
      >
        <div className="space-y-5">
          <AddressForm value={addForm} onChange={setAddForm} />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              disabled={addAddress.isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleAdd} isLoading={addAddress.isPending}>
              Thêm địa chỉ
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit address modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Chỉnh sửa địa chỉ"
        size="md"
      >
        <div className="space-y-5">
          <AddressForm value={editForm} onChange={setEditForm} />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={updateAddress.isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleEdit} isLoading={updateAddress.isPending}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete confirm modal ────────────────────────────────────────────── */}
      <DeleteConfirmModal
        address={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteAddress.isPending}
      />
    </Container>
  );
}
