'use client';

import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

import { Container } from '@/components/layout';
import { Button, Input, Select, Textarea } from '@/components/ui';

// ─── Data ──────────────────────────────────────────────────────────────────

const subjectOptions = [
  { value: '', label: 'Chọn chủ đề...' },
  { value: 'general', label: 'Câu hỏi chung' },
  { value: 'order', label: 'Hỗ trợ đơn hàng' },
  { value: 'partnership', label: 'Hợp tác kinh doanh' },
  { value: 'feedback', label: 'Góp ý & Phản hồi' },
  { value: 'other', label: 'Khác' },
];

const contactInfo = [
  {
    Icon: Mail,
    label: 'Email hỗ trợ',
    value: 'support@flowery.vn',
    href: 'mailto:support@flowery.vn',
    desc: 'Phản hồi trong vòng 4 giờ làm việc',
  },
  {
    Icon: Phone,
    label: 'Hotline',
    value: '1900 2468',
    href: 'tel:19002468',
    desc: 'Miễn phí cước gọi từ 8:00 – 22:00',
  },
  {
    Icon: MapPin,
    label: 'Địa chỉ',
    value: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    href: 'https://maps.google.com/?q=Nguyen+Hue+Ho+Chi+Minh',
    desc: 'Thứ 2 – Chủ nhật: 8:00 – 22:00',
  },
  {
    Icon: Clock,
    label: 'Giờ hoạt động',
    value: '8:00 – 22:00 hàng ngày',
    href: null,
    desc: 'Kể cả cuối tuần và ngày lễ',
  },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/flowery',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
    color: 'hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/flowery',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    ),
    color: 'hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50',
  },
  {
    label: 'Zalo',
    href: 'https://zalo.me/flowery',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V9h2v8zm4 0h-2V9h2v8z" />
      </svg>
    ),
    color: 'hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50',
  },
];

// ─── Form state ────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Helpers ──

  const setField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên.';
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
    }
    if (!form.subject) newErrors.subject = 'Vui lòng chọn chủ đề.';
    if (!form.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung tin nhắn.';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Tin nhắn cần ít nhất 10 ký tự.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gửi tin nhắn thất bại');
      }

      toast.success('Đã gửi tin nhắn thành công!', {
        description: 'Chúng tôi sẽ phản hồi trong vòng 24-48 giờ làm việc.',
        duration: 5000,
      });
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      toast.error('Không thể gửi tin nhắn', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="bg-stone-50 py-16">
        <Container className="max-w-3xl text-center">
          <p className="label-text mb-4">Liên hệ</p>
          <h1 className="heading-lg mb-4">Liên hệ với chúng tôi</h1>
          <p className="body-lg mx-auto max-w-xl text-stone-500">
            Có câu hỏi, góp ý hay muốn hợp tác? Đội ngũ Flowery luôn sẵn lòng lắng nghe bạn.
          </p>
        </Container>
      </section>

      <Container className="max-w-6xl py-16">
        <div className="grid gap-16 lg:grid-cols-5">
          {/* ── Contact form ── */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="heading-md mb-2">Gửi tin nhắn</h2>
              <p className="body-base text-stone-500">
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name + Email row */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={setField('name')}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  label="Địa chỉ email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={setField('email')}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <Input
                label="Số điện thoại (không bắt buộc)"
                type="tel"
                placeholder="0901 234 567"
                value={form.phone}
                onChange={setField('phone')}
                autoComplete="tel"
              />

              {/* Subject */}
              <Select
                label="Chủ đề"
                options={subjectOptions.filter((o) => o.value !== '')}
                placeholder="Chọn chủ đề..."
                value={form.subject}
                onChange={setField('subject')}
                error={errors.subject}
              />

              {/* Message */}
              <Textarea
                label="Nội dung tin nhắn"
                placeholder="Mô tả chi tiết câu hỏi hoặc yêu cầu của bạn tại đây..."
                rows={6}
                value={form.message}
                onChange={setField('message')}
                error={errors.message}
                autoGrow
              />

              {/* Character hint */}
              <p className="body-sm -mt-2 text-stone-500">
                {form.message.length} ký tự{form.message.length < 10 ? ' (tối thiểu 10)' : ''}
              </p>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full px-10 sm:w-auto"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </Button>
            </form>
          </div>

          {/* ── Contact info ── */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="heading-md mb-2">Thông tin liên hệ</h2>
              <p className="body-base text-stone-500">Nhiều cách để kết nối với Flowery.</p>
            </div>

            <div className="space-y-7">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <info.Icon
                    className="text-primary-600 mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="label-text mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="body-base hover:text-primary-600 font-medium break-all text-stone-900 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="body-base font-medium text-stone-900">{info.value}</p>
                    )}
                    <p className="body-sm mt-0.5 text-stone-500">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider my-8" />

            {/* Social links */}
            <div>
              <p className="label-text mb-4">Theo dõi chúng tôi</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition-all duration-150 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="body-sm mt-3 text-stone-500">
                Theo dõi để cập nhật ưu đãi, hoa theo mùa và mẹo chọn hoa mỗi ngày.
              </p>
            </div>

            <div className="divider my-8" />

            {/* Response time note */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="body-base mb-1 font-semibold text-stone-900">Thời gian phản hồi</p>
              <p className="body-sm leading-relaxed text-stone-500">
                Email và chat: trong vòng <strong>4 giờ</strong> làm việc. Hotline: ngay lập tức từ
                8:00 – 22:00. Chúng tôi đọc mọi phản hồi và liên tục cải thiện dịch vụ.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
