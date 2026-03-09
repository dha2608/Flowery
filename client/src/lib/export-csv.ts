'use client';

/**
 * CSV Export utility for admin pages.
 * Converts arrays of objects to CSV and triggers browser download.
 */

type CsvValue = string | number | boolean | null | undefined;

interface ExportConfig<T> {
  /** Column definitions: header label → value accessor */
  columns: { header: string; accessor: (row: T) => CsvValue }[];
  /** Output filename (without .csv extension) */
  filename: string;
}

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export data to CSV file and trigger download.
 */
export function exportToCsv<T>(data: T[], config: ExportConfig<T>): void {
  const { columns, filename } = config;

  // BOM for UTF-8 support in Excel
  const BOM = '\uFEFF';

  // Header row
  const header = columns.map((col) => escapeCsvValue(col.header)).join(',');

  // Data rows
  const rows = data.map((row) => columns.map((col) => escapeCsvValue(col.accessor(row))).join(','));

  const csv = BOM + [header, ...rows].join('\n');

  // Create and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Pre-built export configs ─────────────────────────────────────────────────

interface UserExport {
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function exportUsers(users: UserExport[]) {
  exportToCsv(users, {
    filename: 'flowery-users',
    columns: [
      { header: 'Tên', accessor: (u) => u.name },
      { header: 'Email', accessor: (u) => u.email },
      { header: 'Số điện thoại', accessor: (u) => u.phone ?? '' },
      { header: 'Vai trò', accessor: (u) => u.role },
      { header: 'Trạng thái', accessor: (u) => (u.isActive ? 'Hoạt động' : 'Đã khóa') },
      { header: 'Ngày tạo', accessor: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN') },
    ],
  });
}

interface OrderExport {
  orderNumber: string;
  user: { name: string };
  shop: { name: string };
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export function exportOrders(orders: OrderExport[]) {
  exportToCsv(orders, {
    filename: 'flowery-orders',
    columns: [
      { header: 'Mã đơn', accessor: (o) => o.orderNumber },
      { header: 'Khách hàng', accessor: (o) => o.user?.name ?? '—' },
      { header: 'Cửa hàng', accessor: (o) => o.shop?.name ?? '—' },
      {
        header: 'Tổng tiền (VND)',
        accessor: (o) => o.totalAmount ?? 0,
      },
      { header: 'Trạng thái', accessor: (o) => STATUS_MAP[o.status] ?? o.status },
      { header: 'Thanh toán', accessor: (o) => o.paymentMethod ?? '—' },
      { header: 'Ngày tạo', accessor: (o) => new Date(o.createdAt).toLocaleDateString('vi-VN') },
    ],
  });
}

interface ShopExport {
  name: string;
  owner?: { name: string };
  status: string;
  isVerified: boolean;
  createdAt: string;
}

export function exportShops(shops: ShopExport[]) {
  exportToCsv(shops, {
    filename: 'flowery-shops',
    columns: [
      { header: 'Tên shop', accessor: (s) => s.name },
      { header: 'Chủ sở hữu', accessor: (s) => s.owner?.name ?? '—' },
      { header: 'Trạng thái', accessor: (s) => s.status },
      { header: 'Xác minh', accessor: (s) => (s.isVerified ? 'Đã xác minh' : 'Chưa xác minh') },
      { header: 'Ngày tạo', accessor: (s) => new Date(s.createdAt).toLocaleDateString('vi-VN') },
    ],
  });
}

interface ReviewExport {
  user: { name: string };
  product?: { name: string };
  shop?: { name: string };
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
}

export function exportReviews(reviews: ReviewExport[]) {
  exportToCsv(reviews, {
    filename: 'flowery-reviews',
    columns: [
      { header: 'Người dùng', accessor: (r) => r.user?.name ?? '—' },
      { header: 'Sản phẩm', accessor: (r) => r.product?.name ?? '—' },
      { header: 'Cửa hàng', accessor: (r) => r.shop?.name ?? '—' },
      { header: 'Đánh giá', accessor: (r) => `${r.rating}/5` },
      { header: 'Nội dung', accessor: (r) => r.comment },
      { header: 'Trạng thái', accessor: (r) => (r.isHidden ? 'Đã ẩn' : 'Hiển thị') },
      { header: 'Ngày tạo', accessor: (r) => new Date(r.createdAt).toLocaleDateString('vi-VN') },
    ],
  });
}
