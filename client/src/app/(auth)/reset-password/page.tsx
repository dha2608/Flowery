'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// --- Inner form (needs useSearchParams -> wrapped in Suspense below) ----------

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // --- No token: invalid link --------------------------------------------------
  if (!token) {
    return (
      <div className="text-center py-2">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
        </div>
        <h1 className="font-serif text-xl font-bold text-stone-900 mb-3">Link không hợp lệ</h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Yêu cầu link mới
        </Link>
        <div className="mt-5">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // --- Valid token: show form --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);

    if (password.length < 8) {
      setClientError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setClientError('Mật khẩu xác nhận không khớp.');
      return;
    }

    await resetPassword.mutate(token, password);
  };

  const displayError = clientError ?? resetPassword.error;

  return (
    <>
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Đặt lại mật khẩu</h1>
        <p className="mt-1.5 text-sm text-stone-500">
          Tạo mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {displayError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
            Mật khẩu mới <span className="text-primary-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-describedby="reset-password-hint"
              className="w-full px-4 py-3 pr-11 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-0.5"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <p id="reset-password-hint" className="mt-1.5 text-xs text-stone-400">
            Ít nhất 8 ký tự
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Xác nhận mật khẩu mới <span className="text-primary-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-11 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-0.5"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={resetPassword.isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resetPassword.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Đang đặt lại...
            </>
          ) : (
            'Đặt lại mật khẩu'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Quay lại đăng nhập
        </Link>
      </div>
    </>
  );
}

// --- Page export (Suspense boundary for useSearchParams) ----------------------

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
