import type { Metadata } from 'next';
import RegisterFormWrapper from './register-form';

export const metadata: Metadata = {
  title: 'Đăng ký - Flowery',
  description: 'Tạo tài khoản Flowery để đặt hoa và nhận ưu đãi',
};

export default function RegisterPage() {
  return <RegisterFormWrapper />;
}
