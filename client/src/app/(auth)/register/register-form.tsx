'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(phone);
}

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

// ─── Password Strength Indicator ──────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Ít nhất 6 ký tự', valid: password.length >= 6 },
    { label: 'Có chữ hoa', valid: /[A-Z]/.test(password) },
    { label: 'Có số', valid: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthColor =
    strength === 0
      ? 'bg-stone-200'
      : strength === 1
        ? 'bg-red-400'
        : strength === 2
          ? 'bg-amber-400'
          : 'bg-emerald-400';

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 space-y-2"
    >
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? strengthColor : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      {/* Checks */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              check.valid ? 'text-emerald-600' : 'text-stone-400'
            }`}
          >
            <div
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors ${
                check.valid ? 'bg-emerald-100' : 'bg-stone-100'
              }`}
            >
              {check.valid && <Check className="h-2 w-2" />}
            </div>
            {check.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

export default function RegisterFormWrapper() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Track which fields have been touched for real-time validation
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
  });

  // Real-time validation
  const validation = useMemo(
    () => ({
      email: {
        error: touched.email && email && !isValidEmail(email),
        success: touched.email && email && isValidEmail(email),
      },
      phone: {
        error: touched.phone && phone && !isValidPhone(phone),
        success: touched.phone && phone && isValidPhone(phone),
      },
    }),
    [email, phone, touched]
  );

  const handleBlur = (field: 'email' | 'phone') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);

    // Client-side validation
    if (password.length < 6) {
      setClientError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setClientError('Mật khẩu phải có ít nhất 1 chữ hoa và 1 số');
      return;
    }
    if (phone && !/^(\+84|0)(3|5|7|8|9)\d{8}$/.test(phone)) {
      setClientError('Số điện thoại không hợp lệ (VD: 0912345678)');
      return;
    }
    if (password !== confirmPassword) {
      setClientError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!agreedToTerms) {
      setClientError('Bạn cần đồng ý với Điều khoản sử dụng để tiếp tục.');
      return;
    }

    await register.mutate(email, password, name, phone || undefined);
  };

  const displayError = clientError ?? register.error;

  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 px-3 py-1.5 text-xs font-medium text-rose-700">
          <Sparkles className="h-3 w-3" />
          Gia nhập cộng đồng
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Tạo tài khoản</h1>
        <p className="mt-2 text-sm text-stone-500">Tham gia Flowery — gửi yêu thương qua hoa</p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            aria-live="polite"
            className="mb-6 flex items-start gap-3 overflow-hidden rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{displayError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google OAuth */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/google`}
        className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 font-medium text-stone-700 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
      >
        <GoogleIcon />
        Đăng ký với Google
      </a>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="rounded-full bg-white/80 px-4 text-stone-400 backdrop-blur-sm">
            hoặc đăng ký bằng email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
            Họ và tên <span className="text-rose-700">*</span>
          </label>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-700">
              <User className="h-4 w-4" />
            </div>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border border-stone-200 bg-white/50 py-3.5 pr-4 pl-11 text-sm transition-all placeholder:text-stone-400 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
            Email <span className="text-rose-700">*</span>
          </label>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-700">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="ten@email.com"
              aria-invalid={validation.email.error ? 'true' : undefined}
              aria-describedby={validation.email.error ? 'email-error' : undefined}
              className={`w-full rounded-xl border bg-white/50 py-3.5 pr-4 pl-11 text-sm transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:outline-none ${
                validation.email.error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  : validation.email.success
                    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
                    : 'border-stone-200 focus:border-rose-400 focus:ring-rose-200'
              }`}
            />
            {validation.email.success && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
          </div>
          {validation.email.error && (
            <p id="email-error" className="mt-1.5 text-xs text-red-500" role="alert">
              Vui lòng nhập email hợp lệ
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-stone-700">
            Số điện thoại{' '}
            <span className="text-xs font-normal text-stone-400">(không bắt buộc)</span>
          </label>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-700">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="0912 345 678"
              aria-invalid={validation.phone.error ? 'true' : undefined}
              aria-describedby={validation.phone.error ? 'phone-error' : undefined}
              className={`w-full rounded-xl border bg-white/50 py-3.5 pr-4 pl-11 text-sm transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:outline-none ${
                validation.phone.error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  : validation.phone.success
                    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
                    : 'border-stone-200 focus:border-rose-400 focus:ring-rose-200'
              }`}
            />
            {validation.phone.success && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
          </div>
          {validation.phone.error && (
            <p id="phone-error" className="mt-1.5 text-xs text-red-500" role="alert">
              Số điện thoại không hợp lệ (VD: 0912345678)
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
            Mật khẩu <span className="text-rose-700">*</span>
          </label>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-700">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-stone-200 bg-white/50 py-3.5 pr-12 pl-11 text-sm transition-all placeholder:text-stone-400 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <AnimatePresence>
            <PasswordStrength password={password} />
          </AnimatePresence>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Xác nhận mật khẩu <span className="text-rose-700">*</span>
          </label>
          <div className="group relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-rose-700">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-white/50 py-3.5 pr-12 pl-11 text-sm ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                  : confirmPassword && confirmPassword === password
                    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
                    : 'border-stone-200 focus:border-rose-400 focus:ring-rose-200'
              } transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-2 text-xs text-red-500">Mật khẩu không khớp</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <div className="relative">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="peer sr-only"
            />
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`h-5 w-5 cursor-pointer rounded-md border-2 transition-all duration-200 ${
                agreedToTerms
                  ? 'border-rose-500 bg-gradient-to-br from-rose-500 to-pink-500'
                  : 'border-stone-300 bg-white hover:border-rose-400'
              } flex items-center justify-center`}
            >
              {agreedToTerms && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
          <label htmlFor="terms" className="cursor-pointer text-sm leading-snug text-stone-600">
            Tôi đồng ý với{' '}
            <Link
              href="/terms"
              className="font-medium text-rose-700 underline underline-offset-2 hover:text-rose-700"
              target="_blank"
            >
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link
              href="/privacy"
              className="font-medium text-rose-700 underline underline-offset-2 hover:text-rose-700"
              target="_blank"
            >
              Chính sách bảo mật
            </Link>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={register.isLoading}
          className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-4 font-semibold text-white shadow-md shadow-rose-500/20 transition-all duration-200 hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:shadow-rose-500/25 focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {register.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Đang đăng ký...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-8 text-center text-sm text-stone-500">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="font-semibold text-rose-700 transition-colors hover:text-rose-700"
        >
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
