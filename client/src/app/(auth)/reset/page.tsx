'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Password Strength ────────────────────────────────────────────────────────

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
      className="mt-3 space-y-2"
    >
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= strength ? strengthColor : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 text-xs ${
              check.valid ? 'text-emerald-600' : 'text-stone-400'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                check.valid ? 'bg-emerald-100' : 'bg-stone-100'
              }`}
            >
              {check.valid && <Check className="w-2 h-2" />}
            </div>
            {check.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Reset Form ───────────────────────────────────────────────────────────────

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*[0-9])/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 1 chữ hoa và 1 số');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  // No token
  if (!token) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Link không hợp lệ</h2>
        <p className="text-sm text-stone-500 mb-6">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </p>
        <Link
          href="/forgot"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30"
        >
          Yêu cầu link mới
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Bảo mật tài khoản
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Đặt lại mật khẩu</h1>
        <p className="mt-2 text-sm text-stone-500">Tạo mật khẩu mới cho tài khoản của bạn</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mx-auto mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Thành công!</h2>
            <p className="text-sm text-stone-500 mb-6">
              Mật khẩu đã được đặt lại. Đang chuyển đến trang đăng nhập...
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm bg-white/50 border border-stone-200 focus:border-rose-400 focus:ring-rose-200 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={newPassword} />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm bg-white/50 border ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-300'
                        : confirmPassword && confirmPassword === newPassword
                          ? 'border-emerald-300'
                          : 'border-stone-200'
                    } focus:border-rose-400 focus:ring-rose-200 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-stone-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="mt-2 text-xs text-red-500">Mật khẩu không khớp</p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 disabled:opacity-60 shadow-lg shadow-rose-500/30"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </motion.button>
            </form>

            {/* Back to login */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-rose-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
