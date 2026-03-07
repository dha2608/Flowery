'use client';

import Link from 'next/link';
import { Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Floating flowers for background
const FLOATING_FLOWERS = ['🌸', '🌺', '🌷', '💐', '🌹', '🪻', '🌼', '💮'];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 h-96 w-96 animate-pulse rounded-full bg-rose-300/30 blur-3xl" />
        <div className="absolute right-20 bottom-20 h-80 w-80 animate-pulse rounded-full bg-pink-300/30 blur-3xl delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Floating flowers */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {FLOATING_FLOWERS.map((flower, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            {flower}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 py-12">
        {/* Logo */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flower2 className="h-6 w-6 text-white" />
            </motion.div>
            <div className="text-left">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text font-serif text-2xl font-bold text-transparent">
                Flowery
              </span>
              <p className="text-xs text-stone-500">Gửi yêu thương qua từng cánh hoa</p>
            </div>
          </Link>
        </motion.div>

        {/* Auth card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-strong rounded-3xl border border-white/50 p-8 shadow-2xl shadow-rose-500/10">
            {children}
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.p
          className="mt-6 text-sm text-stone-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-stone-600 transition-colors hover:text-rose-700"
          >
            ← Quay về trang chủ
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
