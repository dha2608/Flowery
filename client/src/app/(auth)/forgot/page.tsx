'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

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
          Khôi phục tài khoản
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Quên mật khẩu?</h1>
        <p className="mt-2 text-sm text-stone-500 max-w-xs mx-auto">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
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
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Kiểm tra email!</h2>
            <p className="text-sm text-stone-500 mb-6">
              Chúng tôi đã gửi link đặt lại mật khẩu đến{' '}
              <span className="font-medium text-stone-700">{email}</span>
            </p>
            <p className="text-xs text-stone-400 mb-6">
              Không thấy email? Kiểm tra thư mục spam hoặc{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-rose-500 hover:text-rose-600 font-medium"
              >
                thử lại
              </button>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-500/30"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ten@email.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm bg-white/50 border border-stone-200 focus:border-rose-400 focus:ring-rose-200 focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-rose-500/30"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi link đặt lại mật khẩu'
                )}
              </motion.button>
            </form>

            {/* Back to login */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-rose-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
