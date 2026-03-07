'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Heart, Star, Gift } from 'lucide-react';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/ui/scroll-reveal';

const emotions = [
  { key: 'romantic', label: 'Lãng mạn', desc: 'Tình yêu & lãng mạn', emoji: '💕', color: 'from-pink-400 to-rose-500' },
  { key: 'grateful', label: 'Biết ơn', desc: 'Lòng tri ân', emoji: '🙏', color: 'from-amber-400 to-orange-500' },
  { key: 'joyful', label: 'Vui vẻ', desc: 'Niềm vui & hạnh phúc', emoji: '🎉', color: 'from-yellow-400 to-amber-500' },
  { key: 'sympathetic', label: 'Chia sẻ', desc: 'Đồng cảm & an ủi', emoji: '🤗', color: 'from-blue-400 to-indigo-500' },
  { key: 'respectful', label: 'Kính trọng', desc: 'Sự tôn kính', emoji: '🎖️', color: 'from-purple-400 to-violet-500' },
  { key: 'apologetic', label: 'Xin lỗi', desc: 'Lời xin lỗi chân thành', emoji: '💐', color: 'from-teal-400 to-cyan-500' },
  { key: 'celebratory', label: 'Chúc mừng', desc: 'Khoảnh khắc đặc biệt', emoji: '🥳', color: 'from-green-400 to-emerald-500' },
  { key: 'passionate', label: 'Đam mê', desc: 'Nhiệt huyết & đam mê', emoji: '🔥', color: 'from-red-400 to-rose-600' },
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

const stats = [
  { value: '50K+', label: 'Khách hàng', icon: Heart },
  { value: '100+', label: 'Cửa hàng', icon: Star },
  { value: '10K+', label: 'Đơn hàng/tháng', icon: Gift },
];

// Floating particles for hero
const HERO_PARTICLES = ['🌸', '🌺', '🌷', '💐', '🌹', '🪻'];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        <div className="relative container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-100 shadow-sm mb-6"
              >
                <span className="text-sm">🌸</span>
                <span className="text-sm font-medium text-primary-600">Nền tảng đặt hoa thông minh</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 font-serif leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Gửi yêu thương
                <br />
                qua từng{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                    cánh hoa
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-3 bg-primary-200/50 -z-10 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-stone-600 mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Flowery giúp bạn tìm bó hoa hoàn hảo dựa trên cảm xúc, dịp đặc biệt và mối quan hệ của bạn.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:brightness-105 transition-all duration-200"
                >
                  Bắt đầu tìm hoa
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/flowers"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/80 backdrop-blur-sm text-stone-700 font-semibold rounded-full border border-stone-200 hover:bg-white hover:border-stone-300 transition-all duration-200"
                >
                  Khám phá bộ sưu tập
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex items-center gap-8 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                    <p className="text-sm text-stone-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative aspect-square">
                {/* Glass card background */}
                <div className="absolute inset-8 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl" />
                
                {/* Floating flower cards */}
                <motion.div
                  className="absolute top-4 right-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-4xl">🌹</span>
                  <p className="text-sm font-medium mt-2">Hoa Hồng</p>
                  <p className="text-xs text-stone-500">Tình yêu vĩnh cửu</p>
                </motion.div>

                <motion.div
                  className="absolute bottom-16 left-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <span className="text-4xl">🌸</span>
                  <p className="text-sm font-medium mt-2">Hoa Anh Đào</p>
                  <p className="text-xs text-stone-500">Vẻ đẹp thuần khiết</p>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 right-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-4 shadow-xl"
                  animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Sparkles className="w-6 h-6 mb-2" />
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
        
        <div className="relative container-wide">
          <ScrollReveal className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm font-medium text-primary-600 mb-4">
              <Heart className="w-4 h-4" />
              Chọn theo cảm xúc
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-serif">
              Bạn muốn gửi gắm điều gì?
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((emotion) => (
              <StaggerItem key={emotion.key}>
                <Link href={`/flowers?emotion=${emotion.key}`}>
                  <motion.div
                    className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-100 overflow-hidden cursor-pointer"
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${emotion.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
                    />
                    
                    <span className="text-3xl mb-3 block">{emotion.emoji}</span>
                    <h3 className="font-semibold text-stone-900 group-hover:text-primary-600 transition-colors">
                      {emotion.label}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">{emotion.desc}</p>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-4 h-4 text-primary-500" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding relative">
        <div className="container-wide">
          <ScrollReveal className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full text-sm font-medium text-secondary-600 mb-4">
              <Sparkles className="w-4 h-4" />
              Tại sao chọn Flowery?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-serif">
              Trải nghiệm đặt hoa hoàn hảo
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <motion.div
                  className="relative p-8 rounded-3xl bg-white border border-stone-100 overflow-hidden group"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
                  
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-200`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 p-12 md:p-16 text-center"
            >
              {/* Animated background shapes */}
              <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative">
                <span className="text-6xl mb-6 block">💐</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
                  Sẵn sàng gửi yêu thương?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                  Hãy để Flowery giúp bạn tìm bó hoa hoàn hảo cho người thân yêu
                </p>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                >
                  Bắt đầu ngay
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
