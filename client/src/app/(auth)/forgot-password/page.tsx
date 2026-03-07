import type { Metadata } from 'next';
import ForgotPasswordFormWrapper from './forgot-password-form';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - Flowery',
  description: 'Đặt lại mật khẩu tài khoản Flowery của bạn',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFormWrapper />;
}
