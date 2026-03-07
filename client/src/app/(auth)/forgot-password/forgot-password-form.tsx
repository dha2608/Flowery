'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ForgotPasswordFormWrapper() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await forgotPassword.mutate(email);
    if (success) setSent(true);
  };

  // ─── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="text-center py-2">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" aria-hidden="true" />
          </div>
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900 mb-3">Kiểm tra email của bạn</h1>
        <p className="text-sm text-stone-500 leading-relaxed mb-2">
          Chúng tôi đã gửi link đặt lại mật khẩu đến
        </p>
        <p className="font-semibold text-stone-800 mb-6 break-all">{email}</p>
        <p className="text-xs text-stone-400 mb-8">
          Không thấy email? Kiểm tra thư mục spam hoặc{' '}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
          >
            thử lại
          </button>
          .
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  // ─── Form state ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="mb-7">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Quên mật khẩu</h1>
        <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
          Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>

      {/* Error */}
      {forgotPassword.error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{forgotPassword.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ten@email.com"
            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-stone-400"
          />
        </div>

        <button
          type="submit"
          disabled={forgotPassword.isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {forgotPassword.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Đang gửi...
            </>
          ) : (
            'Gửi link đặt lại'
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
