'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2, Mail, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

// ─── Google Icon ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ─── Input wrapper with icon ──────────────────────────────────────────────────

function InputField({
  icon: Icon,
  label,
  error,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="group relative">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-500">
          <Icon className="h-4 w-4" />
        </div>
        <input
          {...props}
          className={`w-full rounded-xl border bg-white/50 py-3.5 pr-4 pl-11 text-sm ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-stone-200 focus:border-rose-400 focus:ring-rose-200'
          } transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:outline-none`}
        />
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login.mutate(email, password, redirectTo);
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 px-3 py-1.5 text-xs font-medium text-rose-600">
          <Sparkles className="h-3 w-3" />
          Chào mừng trở lại
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Đăng nhập</h1>
        <p className="mt-2 text-sm text-stone-500">Tiếp tục hành trình với Flowery</p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {login.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            aria-live="polite"
            className="mb-6 flex items-start gap-3 overflow-hidden rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{login.error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google OAuth */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/google`}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-stone-200 bg-white px-4 py-3.5 font-medium text-stone-700 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
      >
        <GoogleIcon />
        Tiếp tục với Google
      </a>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="rounded-full bg-white/80 px-4 text-stone-400 backdrop-blur-sm">
            hoặc đăng nhập bằng email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <InputField
            icon={Mail}
            label="Email"
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ten@email.com"
            error={!!login.error}
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Mật khẩu
            </label>
            <Link
              href="/forgot"
              className="text-xs font-medium text-rose-500 transition-colors hover:text-rose-600"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-white/50 py-3.5 pr-12 pl-11 text-sm ${
                login.error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  : 'border-stone-200 focus:border-rose-400 focus:ring-rose-200'
              } transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={login.isLoading}
          className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-4 font-semibold text-white shadow-md shadow-rose-500/20 transition-all duration-200 hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:shadow-rose-500/25 focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {login.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-8 text-center text-sm text-stone-500">
        Chưa có tài khoản?{' '}
        <Link
          href="/register"
          className="font-semibold text-rose-500 transition-colors hover:text-rose-600"
        >
          Đăng ký ngay
        </Link>
      </p>
    </>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
