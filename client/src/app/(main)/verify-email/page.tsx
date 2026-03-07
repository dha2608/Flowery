'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Flower2 } from 'lucide-react';

import { Container } from '@/components/layout';
import { Button, Spinner } from '@/components/ui';
import { api, ApiError } from '@/lib/api';

// ─── States ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <Spinner size="lg" />
      <p className="text-gray-600 font-medium text-lg">Đang xác thực email...</p>
      <p className="text-gray-400 text-sm">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      {/* Green checkmark icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Email đã được xác thực thành công!</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và bắt đầu khám phá thế giới
          hoa cùng Flowery.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link href="/login">
          <Button size="lg" className="w-full sm:w-auto px-8">
            Đăng nhập ngay
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
            Về trang chủ
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Chào mừng bạn đến với Flowery — nơi cảm xúc được nói lên bằng ngôn ngữ của hoa
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onResend,
  resendStatus,
}: {
  message: string;
  onResend: () => void;
  resendStatus: 'idle' | 'sending' | 'sent' | 'error';
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      {/* Red X icon */}
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Xác thực không thành công</h2>
        <p className="text-red-600 font-medium">{message}</p>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Liên kết xác thực có thể đã hết hạn hoặc đã được sử dụng trước đó. Hãy yêu cầu gửi lại
          email xác thực mới.
        </p>
      </div>

      {/* Resend feedback */}
      {resendStatus === 'sent' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-sm text-green-700 font-medium">
          Đã gửi email xác thực mới. Vui lòng kiểm tra hộp thư của bạn.
        </div>
      )}
      {resendStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 font-medium">
          Gửi lại thất bại. Vui lòng thử lại sau.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-1">
        <Button
          size="lg"
          onClick={onResend}
          isLoading={resendStatus === 'sending'}
          disabled={resendStatus === 'sent'}
          className="w-full sm:w-auto px-8"
        >
          {resendStatus === 'sent' ? 'Đã gửi lại' : 'Gửi lại email xác thực'}
        </Button>
        <Link href="/login">
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
            Đăng nhập
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-400">
        Cần hỗ trợ?{' '}
        <Link href="/contact" className="text-primary-600 hover:underline">
          Liên hệ Flowery
        </Link>
      </p>
    </div>
  );
}

// ─── Content (reads searchParams) ─────────────────────────────────────────────

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('Token xác thực không hợp lệ hoặc đã hết hạn.');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Không tìm thấy token xác thực trong liên kết. Vui lòng kiểm tra lại email của bạn.');
      return;
    }

    api
      .post<{ message: string }>('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
      })
      .catch((err: unknown) => {
        setStatus('error');
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
        }
      });
  }, [token]);

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await api.post('/auth/resend-verification', {});
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'success') {
    return <SuccessState />;
  }

  return (
    <ErrorState
      message={errorMessage}
      onResend={handleResend}
      resendStatus={resendStatus}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top accent strip */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 via-pink-400 to-primary-600" />

      <Container className="flex-1 flex items-center justify-center py-16 max-w-lg">
        <div className="w-full">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-xl hover:opacity-80 transition-opacity">
              <Flower2 className="w-6 h-6" />
              <span>Flowery</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900">Xác Thực Email</h1>
              <p className="text-sm text-gray-500 mt-1">
                Đang xử lý yêu cầu xác thực tài khoản của bạn
              </p>
            </div>

            {/* Wrapped in Suspense so useSearchParams() works correctly */}
            <Suspense fallback={<LoadingState />}>
              <VerifyEmailContent />
            </Suspense>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Flowery · Nền tảng giao hoa thông minh Việt Nam
          </p>
        </div>
      </Container>
    </div>
  );
}
