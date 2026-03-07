'use client';

import { Server, Info, Sliders, Flag, Shield } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';

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
    <div className="flex items-center justify-between py-2.5 text-sm border-b border-gray-100 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function FeatureFlag({
  label,
  enabled,
  description,
}: {
  label: string;
  enabled: boolean;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex cursor-not-allowed items-center gap-2 opacity-60">
        <input
          type="checkbox"
          defaultChecked={enabled}
          disabled
          className="sr-only peer"
          aria-label={label}
        />
        <div
          className="
            relative h-5 w-9 rounded-full bg-gray-200
            after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4
            after:rounded-full after:bg-white after:transition-transform after:content-['']
            peer-checked:bg-stone-600
            peer-checked:after:translate-x-4
          "
        />
        <span className="text-xs text-gray-500">{enabled ? 'Bật' : 'Tắt'}</span>
      </label>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Trang cài đặt hiện ở chế độ chỉ xem. Các thay đổi sẽ được hỗ trợ trong phiên bản tiếp theo.
        </p>
      </div>

      {/* Platform Settings */}
      <Section icon={<Sliders className="h-5 w-5" />} title="Cài đặt nền tảng">
        <InfoRow label="Tên ứng dụng" value="Flowery" />
        <InfoRow label="Phiên bản" value={<Badge size="sm">v1.0.0</Badge>} />
        <InfoRow label="Email liên hệ" value="support@flowery.vn" />
        <InfoRow label="Ngôn ngữ mặc định" value="Tiếng Việt (vi-VN)" />
        <InfoRow label="Múi giờ" value="Asia/Ho_Chi_Minh (GMT+7)" />
        <InfoRow label="Tiền tệ" value="VND (₫)" />
      </Section>

      {/* Rate Limits */}
      <Section icon={<Shield className="h-5 w-5" />} title="Giới hạn tốc độ (Rate Limits)">
        <InfoRow label="API requests / phút" value="100 req/min" />
        <InfoRow label="Auth requests / phút" value="10 req/min" />
        <InfoRow label="Upload requests / giờ" value="50 req/hour" />
        <InfoRow label="Kích thước file tối đa" value="10 MB" />
        <InfoRow label="Session timeout" value="7 ngày" />
      </Section>

      {/* Feature Flags */}
      <Section icon={<Flag className="h-5 w-5" />} title="Tính năng (Feature Flags)">
        <FeatureFlag
          label="Đăng ký cửa hàng"
          enabled={true}
          description="Cho phép người dùng đăng ký làm chủ shop"
        />
        <FeatureFlag
          label="Gợi ý cá nhân hóa (AI)"
          enabled={true}
          description="Gợi ý sản phẩm dựa trên lịch sử và sở thích"
        />
        <FeatureFlag
          label="Đặt hoa theo đăng ký"
          enabled={true}
          description="Cho phép đặt hoa định kỳ theo subscription"
        />
        <FeatureFlag
          label="Nhắc nhở sự kiện"
          enabled={true}
          description="Gửi thông báo nhắc nhở sự kiện tự động"
        />
        <FeatureFlag
          label="Đánh giá sản phẩm"
          enabled={true}
          description="Cho phép người dùng đánh giá sản phẩm sau khi mua"
        />
        <FeatureFlag
          label="Chat trực tiếp"
          enabled={false}
          description="Tính năng chat giữa người dùng và chủ shop"
        />
        <FeatureFlag
          label="Thanh toán QR Code"
          enabled={false}
          description="Hỗ trợ thanh toán qua QR Code"
        />
      </Section>

      {/* Maintenance Mode */}
      <Section icon={<Server className="h-5 w-5" />} title="Chế độ bảo trì">
        <div className="flex items-center justify-between py-2.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Chế độ bảo trì</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Khi bật, người dùng sẽ thấy trang thông báo bảo trì
            </p>
          </div>
          <label className="relative inline-flex cursor-not-allowed items-center gap-2 opacity-60">
            <input type="checkbox" disabled className="sr-only peer" aria-label="Chế độ bảo trì" />
            <div
              className="
                relative h-5 w-9 rounded-full bg-gray-200
                after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4
                after:rounded-full after:bg-white after:transition-transform after:content-['']
                peer-checked:bg-red-500
                peer-checked:after:translate-x-4
              "
            />
            <span className="text-xs text-gray-500">Tắt</span>
          </label>
        </div>
      </Section>

      {/* System Info */}
      <Section icon={<Info className="h-5 w-5" />} title="Thông tin hệ thống">
        <InfoRow
          label="Node.js"
          value={<Badge size="sm" variant="success">v20.x LTS</Badge>}
        />
        <InfoRow
          label="MongoDB"
          value={
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-600 font-medium">Kết nối</span>
            </span>
          }
        />
        <InfoRow
          label="Next.js"
          value={<Badge size="sm" variant="info">v15</Badge>}
        />
        <InfoRow label="React" value={<Badge size="sm" variant="info">v19</Badge>} />
        <InfoRow
          label="Uptime"
          value={
            <span className="text-emerald-600 font-medium">Đang hoạt động</span>
          }
        />
        <InfoRow label="Môi trường" value={<Badge size="sm">Production</Badge>} />
      </Section>
    </div>
  );
}
