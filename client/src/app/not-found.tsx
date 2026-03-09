'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Flower2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      {/* Floating flowers background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {['🌸', '🌺', '🌷', '💐', '🌹', '🪻'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{ y: '100vh', x: `${15 + i * 15}%`, rotate: 0 }}
            animate={{
              y: '-100vh',
              rotate: 360,
              transition: {
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 2,
              },
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="relative inline-block">
            <span className="text-[10rem] leading-none font-bold text-rose-100 sm:text-[14rem]">
              404
            </span>
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-6xl sm:text-8xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌸
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-lg text-center"
        >
          <h1 className="mb-4 text-3xl font-bold text-stone-800 sm:text-4xl">
            Ôi! Trang này không tồn tại
          </h1>
          <p className="text-lg text-stone-600">
            Có vẻ như bông hoa bạn tìm đã bay đi mất rồi. Hãy quay về vườn hoa của chúng tôi nhé!
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30"
          >
            <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
            Về trang chủ
          </Link>

          <Link
            href="/flowers"
            className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-white px-8 py-4 font-semibold text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-50"
          >
            <Flower2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            Khám phá hoa
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-sm text-stone-500">Hoặc bạn có thể thử:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: '/products', label: 'Sản phẩm', icon: '🛒' },
              { href: '/shops', label: 'Cửa hàng', icon: '🏪' },
              { href: '/quiz', label: 'Quiz tìm hoa', icon: '✨' },
              { href: '/blog', label: 'Tạp chí', icon: '📖' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm transition-all hover:bg-white hover:text-rose-600 hover:shadow-md"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
