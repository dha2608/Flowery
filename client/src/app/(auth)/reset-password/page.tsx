import type { Metadata } from 'next';
import ResetPasswordFormWrapper from './reset-password-form';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu - Flowery',
  description: 'Tạo mật khẩu mới cho tài khoản Flowery của bạn',
};

export default function ResetPasswordPage() {
  return <ResetPasswordFormWrapper />;
}
