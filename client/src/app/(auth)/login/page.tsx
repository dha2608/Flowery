import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập - Flowery',
  description: 'Đăng nhập vào tài khoản Flowery để đặt hoa và theo dõi đơn hàng',
};

export default function LoginPage() {
  return <LoginForm />;
}
