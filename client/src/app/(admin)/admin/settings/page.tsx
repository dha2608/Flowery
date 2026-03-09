'use client';

import { useState, useCallback } from 'react';
import {
  Server,
  Info,
  Sliders,
  Flag,
  Shield,
  Save,
  RotateCcw,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformSettings {
  appName: string;
  contactEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
}

interface RateLimitSettings {
  apiRequestsPerMinute: number;
  authRequestsPerMinute: number;
  uploadRequestsPerHour: number;
  maxFileSize: number;
  sessionTimeout: number;
}

interface FeatureFlags {
  shopRegistration: boolean;
  aiRecommendation: boolean;
  subscription: boolean;
  eventReminder: boolean;
  productReview: boolean;
  liveChat: boolean;
  qrPayment: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderConfirmation: boolean;
  shopVerification: boolean;
  newUserWelcome: boolean;
  marketingEmails: boolean;
}

interface MaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  description,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader
        className={`pb-2 ${collapsible ? 'cursor-pointer select-none' : ''}`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base text-stone-800">
              <span className="text-stone-500">{icon}</span>
              {title}
            </CardTitle>
            {description && <p className="mt-1 text-xs text-stone-400">{description}</p>}
          </div>
          {collapsible && (
            <span className="text-stone-400">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="pt-2">{children}</CardContent>}
    </Card>
  );
}

// ─── Form Components ──────────────────────────────────────────────────────────

function FormField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none ${className}`}
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-sm text-gray-900 transition-colors focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none"
      />
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  danger = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  danger?: boolean;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
        aria-label={label}
      />
      <div
        className={`relative h-5 w-9 rounded-full bg-gray-200 transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] ${danger ? 'peer-checked:bg-red-500' : 'peer-checked:bg-emerald-500'} peer-checked:after:translate-x-4`}
      />
      <span className="text-xs text-gray-500">{checked ? 'Bật' : 'Tắt'}</span>
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2.5 text-sm last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ─── Default Values ───────────────────────────────────────────────────────────

const defaultPlatform: PlatformSettings = {
  appName: 'Flowery',
  contactEmail: 'support@flowery.vn',
  supportPhone: '1900 1234',
  defaultLanguage: 'vi-VN',
  timezone: 'Asia/Ho_Chi_Minh',
  currency: 'VND',
};

const defaultRateLimits: RateLimitSettings = {
  apiRequestsPerMinute: 100,
  authRequestsPerMinute: 10,
  uploadRequestsPerHour: 50,
  maxFileSize: 10,
  sessionTimeout: 7,
};

const defaultFeatures: FeatureFlags = {
  shopRegistration: true,
  aiRecommendation: true,
  subscription: true,
  eventReminder: true,
  productReview: true,
  liveChat: false,
  qrPayment: false,
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  orderConfirmation: true,
  shopVerification: true,
  newUserWelcome: true,
  marketingEmails: false,
};

const defaultMaintenance: MaintenanceSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings state
  const [platform, setPlatform] = useState<PlatformSettings>(defaultPlatform);
  const [rateLimits, setRateLimits] = useState<RateLimitSettings>(defaultRateLimits);
  const [features, setFeatures] = useState<FeatureFlags>(defaultFeatures);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>(defaultMaintenance);

  // Track changes
  const updatePlatform = useCallback((key: keyof PlatformSettings, value: string) => {
    setPlatform((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const updateRateLimit = useCallback((key: keyof RateLimitSettings, value: number) => {
    setRateLimits((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const updateFeature = useCallback((key: keyof FeatureFlags, value: boolean) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const updateNotification = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const updateMaintenance = useCallback(
    (key: keyof MaintenanceSettings, value: boolean | string) => {
      setMaintenance((prev) => ({ ...prev, [key]: value }));
      setHasChanges(true);
    },
    []
  );

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call - replace with actual API when backend supports it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Cài đặt đã được lưu', {
        description: 'Các thay đổi sẽ có hiệu lực ngay lập tức.',
      });
      setHasChanges(false);
    } catch {
      toast.error('Lưu cài đặt thất bại', {
        description: 'Vui lòng thử lại sau.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    setPlatform(defaultPlatform);
    setRateLimits(defaultRateLimits);
    setFeatures(defaultFeatures);
    setNotifications(defaultNotifications);
    setMaintenance(defaultMaintenance);
    setHasChanges(false);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-stone-500">Quản lý cấu hình và tính năng của nền tảng</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Khôi phục
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {hasChanges && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>Bạn có thay đổi chưa được lưu. Nhấn &quot;Lưu thay đổi&quot; để áp dụng.</p>
        </div>
      )}

      {/* ── Platform Settings ──────────────────────────────────────────── */}
      <Section
        icon={<Sliders className="h-5 w-5" />}
        title="Cài đặt nền tảng"
        description="Thông tin cơ bản của ứng dụng"
      >
        <FormField label="Tên ứng dụng" description="Hiển thị trên header và email">
          <TextInput
            value={platform.appName}
            onChange={(v) => updatePlatform('appName', v)}
            className="w-48"
          />
        </FormField>
        <FormField label="Email liên hệ" description="Email hỗ trợ chính">
          <TextInput
            value={platform.contactEmail}
            onChange={(v) => updatePlatform('contactEmail', v)}
            type="email"
            className="w-56"
          />
        </FormField>
        <FormField label="Số điện thoại hỗ trợ">
          <TextInput
            value={platform.supportPhone}
            onChange={(v) => updatePlatform('supportPhone', v)}
            className="w-40"
          />
        </FormField>
        <FormField label="Ngôn ngữ mặc định">
          <SelectInput
            value={platform.defaultLanguage}
            onChange={(v) => updatePlatform('defaultLanguage', v)}
            options={[
              { value: 'vi-VN', label: 'Tiếng Việt' },
              { value: 'en-US', label: 'English' },
            ]}
          />
        </FormField>
        <FormField label="Múi giờ">
          <SelectInput
            value={platform.timezone}
            onChange={(v) => updatePlatform('timezone', v)}
            options={[
              { value: 'Asia/Ho_Chi_Minh', label: 'GMT+7 (Việt Nam)' },
              { value: 'Asia/Bangkok', label: 'GMT+7 (Bangkok)' },
              { value: 'Asia/Singapore', label: 'GMT+8 (Singapore)' },
            ]}
          />
        </FormField>
        <FormField label="Tiền tệ">
          <SelectInput
            value={platform.currency}
            onChange={(v) => updatePlatform('currency', v)}
            options={[
              { value: 'VND', label: 'VND (₫)' },
              { value: 'USD', label: 'USD ($)' },
            ]}
          />
        </FormField>
      </Section>

      {/* ── Rate Limits ────────────────────────────────────────────────── */}
      <Section
        icon={<Shield className="h-5 w-5" />}
        title="Giới hạn tốc độ"
        description="Bảo vệ hệ thống khỏi lạm dụng"
        collapsible
      >
        <FormField label="API requests / phút" description="Giới hạn request API chung">
          <NumberInput
            value={rateLimits.apiRequestsPerMinute}
            onChange={(v) => updateRateLimit('apiRequestsPerMinute', v)}
            min={10}
            max={1000}
            suffix="req/min"
          />
        </FormField>
        <FormField label="Auth requests / phút" description="Giới hạn đăng nhập/đăng ký">
          <NumberInput
            value={rateLimits.authRequestsPerMinute}
            onChange={(v) => updateRateLimit('authRequestsPerMinute', v)}
            min={3}
            max={100}
            suffix="req/min"
          />
        </FormField>
        <FormField label="Upload requests / giờ" description="Giới hạn upload file">
          <NumberInput
            value={rateLimits.uploadRequestsPerHour}
            onChange={(v) => updateRateLimit('uploadRequestsPerHour', v)}
            min={10}
            max={500}
            suffix="req/hour"
          />
        </FormField>
        <FormField label="Kích thước file tối đa">
          <NumberInput
            value={rateLimits.maxFileSize}
            onChange={(v) => updateRateLimit('maxFileSize', v)}
            min={1}
            max={50}
            suffix="MB"
          />
        </FormField>
        <FormField label="Session timeout" description="Thời gian phiên đăng nhập">
          <NumberInput
            value={rateLimits.sessionTimeout}
            onChange={(v) => updateRateLimit('sessionTimeout', v)}
            min={1}
            max={30}
            suffix="ngày"
          />
        </FormField>
      </Section>

      {/* ── Feature Flags ──────────────────────────────────────────────── */}
      <Section
        icon={<Flag className="h-5 w-5" />}
        title="Tính năng"
        description="Bật/tắt tính năng hệ thống"
      >
        <FormField label="Đăng ký cửa hàng" description="Cho phép người dùng đăng ký làm chủ shop">
          <Toggle
            checked={features.shopRegistration}
            onChange={(v) => updateFeature('shopRegistration', v)}
            label="Đăng ký cửa hàng"
          />
        </FormField>
        <FormField
          label="Gợi ý AI cá nhân hóa"
          description="Gợi ý sản phẩm dựa trên lịch sử và sở thích"
        >
          <Toggle
            checked={features.aiRecommendation}
            onChange={(v) => updateFeature('aiRecommendation', v)}
            label="Gợi ý AI"
          />
        </FormField>
        <FormField
          label="Đặt hoa theo đăng ký"
          description="Cho phép đặt hoa định kỳ theo subscription"
        >
          <Toggle
            checked={features.subscription}
            onChange={(v) => updateFeature('subscription', v)}
            label="Subscription"
          />
        </FormField>
        <FormField label="Nhắc nhở sự kiện" description="Gửi thông báo nhắc nhở sự kiện tự động">
          <Toggle
            checked={features.eventReminder}
            onChange={(v) => updateFeature('eventReminder', v)}
            label="Event Reminder"
          />
        </FormField>
        <FormField
          label="Đánh giá sản phẩm"
          description="Cho phép người dùng đánh giá sản phẩm sau khi mua"
        >
          <Toggle
            checked={features.productReview}
            onChange={(v) => updateFeature('productReview', v)}
            label="Product Review"
          />
        </FormField>
        <FormField label="Chat trực tiếp" description="Tính năng chat giữa người dùng và chủ shop">
          <Toggle
            checked={features.liveChat}
            onChange={(v) => updateFeature('liveChat', v)}
            label="Live Chat"
          />
        </FormField>
        <FormField label="Thanh toán QR Code" description="Hỗ trợ thanh toán qua QR Code">
          <Toggle
            checked={features.qrPayment}
            onChange={(v) => updateFeature('qrPayment', v)}
            label="QR Payment"
          />
        </FormField>
      </Section>

      {/* ── Notification Settings ──────────────────────────────────────── */}
      <Section
        icon={<Bell className="h-5 w-5" />}
        title="Thông báo"
        description="Cấu hình email và thông báo hệ thống"
        collapsible
      >
        <FormField label="Email notifications" description="Bật/tắt toàn bộ email thông báo">
          <Toggle
            checked={notifications.emailNotifications}
            onChange={(v) => updateNotification('emailNotifications', v)}
            label="Email notifications"
          />
        </FormField>
        <FormField label="Xác nhận đơn hàng" description="Gửi email khi đơn hàng được tạo">
          <Toggle
            checked={notifications.orderConfirmation}
            onChange={(v) => updateNotification('orderConfirmation', v)}
            label="Order confirmation"
          />
        </FormField>
        <FormField label="Xác minh cửa hàng" description="Gửi email khi shop được duyệt/từ chối">
          <Toggle
            checked={notifications.shopVerification}
            onChange={(v) => updateNotification('shopVerification', v)}
            label="Shop verification"
          />
        </FormField>
        <FormField label="Chào mừng người dùng mới" description="Gửi email chào mừng khi đăng ký">
          <Toggle
            checked={notifications.newUserWelcome}
            onChange={(v) => updateNotification('newUserWelcome', v)}
            label="Welcome email"
          />
        </FormField>
        <FormField label="Email marketing" description="Gửi email khuyến mãi và tin tức">
          <Toggle
            checked={notifications.marketingEmails}
            onChange={(v) => updateNotification('marketingEmails', v)}
            label="Marketing emails"
          />
        </FormField>
      </Section>

      {/* ── Maintenance Mode ───────────────────────────────────────────── */}
      <Section
        icon={<Server className="h-5 w-5" />}
        title="Chế độ bảo trì"
        description="Khi bật, người dùng sẽ thấy trang thông báo bảo trì"
      >
        <FormField label="Chế độ bảo trì" description="Tạm ngừng hoạt động website">
          <Toggle
            checked={maintenance.maintenanceMode}
            onChange={(v) => updateMaintenance('maintenanceMode', v)}
            label="Maintenance mode"
            danger
          />
        </FormField>
        {maintenance.maintenanceMode && (
          <div className="border-b border-gray-100 py-3">
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Thông báo bảo trì
            </label>
            <textarea
              value={maintenance.maintenanceMessage}
              onChange={(e) => updateMaintenance('maintenanceMessage', e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none"
              placeholder="Nhập thông báo hiển thị cho người dùng..."
            />
          </div>
        )}
        {maintenance.maintenanceMode && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-600">
              Cảnh báo: Khi bật chế độ bảo trì, tất cả người dùng (trừ admin) sẽ không thể truy cập
              website.
            </p>
          </div>
        )}
      </Section>

      {/* ── System Info ────────────────────────────────────────────────── */}
      <Section
        icon={<Info className="h-5 w-5" />}
        title="Thông tin hệ thống"
        description="Thông tin kỹ thuật và trạng thái server"
        collapsible
        defaultOpen={false}
      >
        <InfoRow label="Phiên bản" value={<Badge size="sm">v1.0.0</Badge>} />
        <InfoRow
          label="Node.js"
          value={
            <Badge size="sm" variant="success">
              v20.x LTS
            </Badge>
          }
        />
        <InfoRow
          label="MongoDB"
          value={
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-600">Đang kết nối</span>
            </span>
          }
        />
        <InfoRow
          label="Next.js"
          value={
            <Badge size="sm" variant="info">
              v15
            </Badge>
          }
        />
        <InfoRow
          label="React"
          value={
            <Badge size="sm" variant="info">
              v19
            </Badge>
          }
        />
        <InfoRow
          label="Trạng thái"
          value={
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">Hoạt động bình thường</span>
            </span>
          }
        />
        <InfoRow label="Môi trường" value={<Badge size="sm">Production</Badge>} />
        <InfoRow label="Múi giờ server" value="Asia/Ho_Chi_Minh (GMT+7)" />
      </Section>

      {/* Bottom spacing for sticky save bar */}
      <div className="h-4" />
    </div>
  );
}
