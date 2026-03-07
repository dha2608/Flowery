'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');

    if (!accessToken || !userId) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    }

    // Fetch user profile with the token
    const fetchUser = async () => {
      try {
        // Temporarily set token to make authenticated request
        useAuthStore.getState().setAuth(null as never, accessToken, refreshToken || undefined);

        const res = await api.get<{
          _id: string;
          name: string;
          email: string;
          role: 'user' | 'shop_owner' | 'admin';
          avatar?: { url: string };
        }>('/users/me');
        const user = res.data;

        if (user) {
          setAuth(user, accessToken, refreshToken || undefined);
          router.replace('/dashboard');
        } else {
          setError('Không thể tải thông tin người dùng.');
        }
      } catch {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    };

    fetchUser();
  }, [searchParams, setAuth, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner className="h-8 w-8" />
      <p className="text-gray-600">Đang đăng nhập...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-gray-600">Đang xử lý...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
