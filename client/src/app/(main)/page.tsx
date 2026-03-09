'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/ui/scroll-reveal';
import {
  GradientText,
  Card3D,
  FloatingParticles,
  GlowEffect,
  AnimatedCounter,
  Spotlight,
} from '@/components/ui/premium-effects';

const emotions = [
  {
    key: 'romantic',
    label: 'Lãng mạn',
    desc: 'Tình yêu & lãng mạn',
    emoji: '💕',
    color: 'from-pink-400 to-rose-500',
  },
  {
    key: 'grateful',
    label: 'Biết ơn',
    desc: 'Lòng tri ân',
    emoji: '🙏',
    color: 'from-amber-400 to-orange-500',
  },
  {
    key: 'joyful',
    label: 'Vui vẻ',
    desc: 'Niềm vui & hạnh phúc',
    emoji: '🎉',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    key: 'sympathetic',
    label: 'Chia sẻ',
    desc: 'Đồng cảm & an ủi',
    emoji: '🤗',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    key: 'respectful',
    label: 'Kính trọng',
    desc: 'Sự tôn kính',
    emoji: '🎖️',
    color: 'from-purple-400 to-violet-500',
  },
  {
    key: 'apologetic',
    label: 'Xin lỗi',
    desc: 'Lời xin lỗi chân thành',
    emoji: '💐',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    key: 'celebratory',
    label: 'Chúc mừng',
    desc: 'Khoảnh khắc đặc biệt',
    emoji: '🥳',
    color: 'from-green-400 to-emerald-500',
  },
  {
    key: 'passionate',
    label: 'Đam mê',
    desc: 'Nhiệt huyết & đam mê',
    emoji: '🔥',
    color: 'from-red-400 to-rose-600',
  },
];

const features = [
  {
    title: 'Gợi ý thông minh',
    desc: 'AI phân tích cảm xúc, dịp và mối quan hệ để đề xuất bó hoa phù hợp nhất.',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Giao hàng nhanh',
    desc: 'Đặt hàng từ shop gần bạn, giao nhanh trong vòng 2 giờ tại nội thành.',
    icon: Truck,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Cam kết chất lượng',
    desc: 'Hoa tươi mỗi ngày từ các shop được xác minh và đánh giá bởi cộng đồng.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-green-600',
  },
];

// Floating particles for hero
const HERO_PARTICLES = ['🌸', '🌺', '🌷', '💐', '🌹', '🪻'];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Animated gradient background */}
        <div className="from-primary-50 to-secondary-50 absolute inset-0 bg-gradient-to-br via-white" />

        {/* Gradient orbs */}
        <motion.div
          className="bg-primary-200/40 absolute top-20 -left-32 h-96 w-96 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="bg-secondary-200/40 absolute -right-32 bottom-20 h-96 w-96 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {HERO_PARTICLES.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl opacity-40"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="container-wide section-padding relative">
          <div className="grid min-h-[70vh] items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="border-primary-100 mb-6 inline-flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm"
              >
                <span className="text-sm">🌸</span>
                <span className="text-primary-600 text-sm font-medium">
                  Nền tảng đặt hoa thông minh
                </span>
              </motion.div>

              <motion.h1
                className="mb-6 font-serif text-4xl leading-tight font-bold text-stone-900 md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Gửi yêu thương
                <br />
                qua từng{' '}
                <span className="relative">
                  <GradientText gradient="from-rose-500 via-pink-500 to-fuchsia-500" animate>
                    cánh hoa
                  </GradientText>
                  <motion.span
                    className="bg-primary-200/50 absolute -bottom-2 left-0 -z-10 h-3 w-full rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="mb-8 max-w-md text-lg text-stone-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Flowery giúp bạn tìm bó hoa hoàn hảo dựa trên cảm xúc, dịp đặc biệt và mối quan hệ
                của bạn.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/quiz"
                  className="from-primary-500 to-primary-600 shadow-primary-500/30 hover:shadow-primary-500/40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-105"
                >
                  Bắt đầu tìm hoa
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/flowers"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-6 py-3.5 font-semibold text-stone-700 backdrop-blur-sm transition-all duration-200 hover:border-stone-300 hover:bg-white"
                >
                  Khám phá bộ sưu tập
                </Link>
              </motion.div>

              {/* Stats with animated counters */}
              <motion.div
                className="mt-12 flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value={50} suffix="K+" duration={2} />
                  </p>
                  <p className="text-sm text-stone-500">Khách hàng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value={100} suffix="+" duration={2.2} />
                  </p>
                  <p className="text-sm text-stone-500">Cửa hàng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value={10} suffix="K+" duration={1.8} />
                  </p>
                  <p className="text-sm text-stone-500">Đơn hàng/tháng</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative aspect-square">
                {/* Glass card background */}
                <div className="absolute inset-8 rounded-[3rem] border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl" />

                {/* Floating flower cards */}
                <motion.div
                  className="absolute top-4 right-8 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-4xl">🌹</span>
                  <p className="mt-2 text-sm font-medium">Hoa Hồng</p>
                  <p className="text-xs text-stone-500">Tình yêu vĩnh cửu</p>
                </motion.div>

                <motion.div
                  className="absolute bottom-16 left-4 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-sm"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <span className="text-4xl">🌸</span>
                  <p className="mt-2 text-sm font-medium">Hoa Anh Đào</p>
                  <p className="text-xs text-stone-500">Vẻ đẹp thuần khiết</p>
                </motion.div>

                <motion.div
                  className="from-primary-500 to-primary-600 absolute top-1/2 right-4 rounded-2xl bg-gradient-to-r p-4 text-white shadow-xl"
                  animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Sparkles className="mb-2 h-6 w-6" />
                  <p className="text-sm font-medium">AI Gợi ý</p>
                  <p className="text-xs opacity-80">Phù hợp 98%</p>
                </motion.div>

                {/* Center flower */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-[120px]">💐</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emotions */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-stone-50/50 to-white" />

        <div className="container-wide relative">
          <ScrollReveal className="mb-12 text-center">
            <p className="bg-primary-50 text-primary-600 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <Heart className="h-4 w-4" />
              Chọn theo cảm xúc
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Bạn muốn gửi gắm điều gì?
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {emotions.map((emotion) => (
              <StaggerItem key={emotion.key}>
                <Link href={`/flowers?emotion=${emotion.key}`}>
                  <Card3D intensity={10}>
                    <Spotlight>
                      <motion.div
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-stone-100 bg-white/70 p-6 backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      >
                        {/* Gradient overlay on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${emotion.color} opacity-0 transition-opacity duration-200 group-hover:opacity-10`}
                        />

                        <span className="mb-3 block text-3xl transition-transform duration-300 group-hover:scale-110">
                          {emotion.emoji}
                        </span>
                        <h3 className="group-hover:text-primary-600 font-semibold text-stone-900 transition-colors">
                          {emotion.label}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">{emotion.desc}</p>

                        {/* Arrow indicator */}
                        <div className="absolute right-4 bottom-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                          <ArrowRight className="text-primary-500 h-4 w-4" />
                        </div>
                      </motion.div>
                    </Spotlight>
                  </Card3D>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding relative">
        <div className="container-wide">
          <ScrollReveal className="mb-12 text-center">
            <p className="bg-secondary-50 text-secondary-600 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Tại sao chọn Flowery?
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Trải nghiệm đặt hoa hoàn hảo
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <Card3D intensity={8}>
                  <Spotlight>
                    <div className="group relative overflow-hidden rounded-3xl border border-stone-100 bg-white/80 p-8 backdrop-blur-sm">
                      {/* Background gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                      />

                      <GlowEffect color={`rgba(244, 114, 182, 0.2)`} blur={40}>
                        <div
                          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                      </GlowEffect>

                      <h3 className="mb-3 text-xl font-bold text-stone-900">{feature.title}</h3>
                      <p className="leading-relaxed text-stone-600">{feature.desc}</p>
                    </div>
                  </Spotlight>
                </Card3D>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <div className="from-primary-500 via-primary-600 to-secondary-500 relative overflow-hidden rounded-[2rem] bg-gradient-to-r p-12 text-center md:p-16">
              {/* Floating particles in CTA */}
              <FloatingParticles
                particles={['✨', '💫', '⭐', '🌟']}
                count={12}
                minSize={12}
                maxSize={24}
              />

              {/* Animated background shapes */}
              <motion.div
                className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative">
                <motion.span
                  className="mb-6 block text-6xl"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  💐
                </motion.span>
                <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
                  Sẵn sàng gửi yêu thương?
                </h2>
                <p className="mx-auto mb-8 max-w-lg text-lg text-white/80">
                  Hãy để Flowery giúp bạn tìm bó hoa hoàn hảo cho người thân yêu
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/quiz"
                    className="text-primary-600 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold shadow-xl transition-all duration-200 hover:shadow-2xl"
                  >
                    Bắt đầu ngay
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
