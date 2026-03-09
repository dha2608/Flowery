'use client';

import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Sparkles, Star, Clock, Heart } from 'lucide-react';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/ui/scroll-reveal';
import {
  PetalAccent,
  RoseIcon,
  FloatingPetals,
  VineDivider,
  SectionHeading,
  DotPattern,
} from '@/components/ui/botanicals';

// ─── Emotion data with SVG flower icons & warm colors ─────────────────────────

const emotions = [
  {
    key: 'romantic',
    label: 'Lãng mạn',
    desc: 'Hoa hồng đỏ, tulip, mẫu đơn',
    color: 'rose',
    bgFrom: 'from-rose-50',
    bgTo: 'to-pink-50',
    border: 'border-rose-100',
    accent: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
  {
    key: 'grateful',
    label: 'Biết ơn',
    desc: 'Hoa cúc, hoa ly, hoa lan',
    color: 'amber',
    bgFrom: 'from-amber-50',
    bgTo: 'to-orange-50',
    border: 'border-amber-100',
    accent: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  {
    key: 'joyful',
    label: 'Vui vẻ',
    desc: 'Hoa hướng dương, cúc vạn thọ',
    color: 'yellow',
    bgFrom: 'from-yellow-50',
    bgTo: 'to-amber-50',
    border: 'border-yellow-100',
    accent: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  {
    key: 'sympathetic',
    label: 'Chia sẻ',
    desc: 'Hoa lily trắng, hoa cẩm chướng',
    color: 'sky',
    bgFrom: 'from-sky-50',
    bgTo: 'to-blue-50',
    border: 'border-sky-100',
    accent: 'text-sky-600',
    iconBg: 'bg-sky-100',
  },
  {
    key: 'respectful',
    label: 'Kính trọng',
    desc: 'Hoa lan hồ điệp, sen trắng',
    color: 'violet',
    bgFrom: 'from-violet-50',
    bgTo: 'to-purple-50',
    border: 'border-violet-100',
    accent: 'text-violet-600',
    iconBg: 'bg-violet-100',
  },
  {
    key: 'celebratory',
    label: 'Chúc mừng',
    desc: 'Mix hoa rực rỡ, baby breath',
    color: 'emerald',
    bgFrom: 'from-emerald-50',
    bgTo: 'to-green-50',
    border: 'border-emerald-100',
    accent: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
];

const features = [
  {
    title: 'Gợi ý bằng AI',
    desc: 'Trả lời vài câu hỏi về cảm xúc, dịp và mối quan hệ — Flowery sẽ gợi ý bó hoa phù hợp nhất.',
    icon: Sparkles,
    accent: 'from-primary-500 to-rose-500',
  },
  {
    title: 'Giao hàng 2 giờ',
    desc: 'Đặt hàng từ shop gần bạn nhất. Hoa tươi mỗi ngày, giao tận tay trong vòng 2 giờ.',
    icon: Truck,
    accent: 'from-secondary-500 to-amber-500',
  },
  {
    title: 'Shop đã xác minh',
    desc: 'Mỗi cửa hàng đều được xác minh chất lượng và đánh giá bởi cộng đồng Flowery.',
    icon: ShieldCheck,
    accent: 'from-accent-500 to-emerald-500',
  },
];

const testimonials = [
  {
    text: 'Bó hoa đẹp hơn mình tưởng tượng. Bạn gái thích lắm!',
    author: 'Minh T.',
    role: 'Khách hàng tại TP.HCM',
    rating: 5,
  },
  {
    text: 'Giao hàng nhanh, hoa tươi. Sẽ quay lại đặt thường xuyên.',
    author: 'Lan P.',
    role: 'Khách hàng tại Hà Nội',
    rating: 5,
  },
  {
    text: 'Tính năng gợi ý AI rất hay, giúp mình chọn đúng hoa cho mẹ.',
    author: 'Hùng N.',
    role: 'Khách hàng tại Đà Nẵng',
    rating: 5,
  },
];

// ─── Homepage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ════════ Hero ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-white">
        {/* Background decorations */}
        <FloatingPetals count={8} />
        <DotPattern className="opacity-40" />

        <div className="container-wide section-padding relative">
          <div className="grid min-h-[75vh] items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left content */}
            <div className="max-w-xl">
              <ScrollReveal>
                <div className="border-primary-100 bg-primary-50/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                  <RoseIcon className="text-primary-500 h-4 w-4" />
                  <span className="text-primary-700 text-sm font-medium">
                    Nền tảng đặt hoa #1 Việt Nam
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="mb-6 font-serif text-4xl leading-[1.15] font-bold text-stone-900 md:text-5xl lg:text-6xl">
                  Gửi yêu thương
                  <br />
                  qua từng{' '}
                  <span className="relative inline-block">
                    <span className="text-primary-600 relative z-10">cánh hoa</span>
                    <span
                      className="bg-primary-100/60 absolute -bottom-1 left-0 h-3 w-full rounded"
                      aria-hidden="true"
                    />
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="mb-8 max-w-md text-lg leading-relaxed text-stone-500">
                  Flowery giúp bạn tìm bó hoa hoàn hảo dựa trên cảm xúc, dịp đặc biệt và mối quan hệ
                  của bạn.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/quiz"
                    className="group bg-primary-600 hover:bg-primary-700 shadow-primary-500/25 hover:shadow-primary-500/30 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    Bắt đầu tìm hoa
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/flowers"
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-7 py-3.5 font-semibold text-stone-700 backdrop-blur-sm transition-all hover:border-stone-300 hover:bg-white hover:shadow-sm"
                  >
                    Khám phá bộ sưu tập
                  </Link>
                </div>
              </ScrollReveal>

              {/* Stats */}
              <ScrollReveal delay={0.4}>
                <div className="mt-12 flex items-center gap-8 border-t border-stone-200/60 pt-8">
                  {[
                    { value: '50K+', label: 'Khách hàng' },
                    { value: '100+', label: 'Cửa hàng' },
                    { value: '10K+', label: 'Đơn/tháng' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                      <p className="text-sm text-stone-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Hero visual */}
            <ScrollReveal delay={0.2} variant="scaleIn" className="relative hidden lg:block">
              <div className="relative aspect-square">
                {/* Warm gradient background */}
                <div className="from-primary-50 absolute inset-4 rounded-[2rem] bg-gradient-to-br via-rose-50 to-amber-50" />
                <div className="absolute inset-8 rounded-3xl border border-white/80 bg-white/60 shadow-xl shadow-stone-200/50 backdrop-blur-sm" />

                {/* Product card 1 */}
                <div className="absolute top-6 right-8 z-10 rounded-2xl border border-stone-100 bg-white p-5 shadow-lg shadow-stone-200/40 transition-shadow duration-300 ease-out hover:shadow-xl hover:shadow-stone-200/50">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                    <PetalAccent className="h-6 w-6 text-rose-400" />
                  </div>
                  <p className="font-medium text-stone-900">Hoa Hồng Ecuador</p>
                  <p className="mt-0.5 text-xs text-stone-400">Tình yêu vĩnh cửu</p>
                  <p className="text-primary-600 mt-2 text-sm font-bold">350.000đ</p>
                </div>

                {/* Product card 2 */}
                <div className="absolute bottom-16 left-4 z-10 rounded-2xl border border-stone-100 bg-white p-5 shadow-lg shadow-stone-200/40 transition-shadow duration-300 ease-out hover:shadow-xl hover:shadow-stone-200/50">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <PetalAccent className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="font-medium text-stone-900">Bó Hoa Mùa Thu</p>
                  <p className="mt-0.5 text-xs text-stone-400">Ấm áp & biết ơn</p>
                  <p className="text-primary-600 mt-2 text-sm font-bold">280.000đ</p>
                </div>

                {/* AI suggestion badge */}
                <div className="from-primary-500 shadow-primary-500/30 absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-2xl bg-gradient-to-br to-rose-600 p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-sm font-semibold">Gợi ý AI</p>
                  </div>
                  <p className="mt-1 text-xs text-white/80">Phù hợp 98% với bạn</p>
                </div>

                {/* Rating badge */}
                <div className="absolute right-16 bottom-8 z-10 flex items-center gap-1.5 rounded-full border border-amber-100 bg-white px-3 py-1.5 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-stone-700">4.9</span>
                  <span className="text-xs text-stone-400">(2.1k)</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ════════ Emotions ════════ */}
      <section className="section-padding relative">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeading
              title="Bạn muốn gửi gắm điều gì?"
              subtitle="Chọn cảm xúc và để Flowery tìm những bông hoa nói thay lời bạn"
            />
          </ScrollReveal>

          <StaggerReveal className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
            {emotions.map((emotion) => (
              <StaggerItem key={emotion.key}>
                <Link href={`/flowers?emotion=${emotion.key}`} className="block">
                  <div
                    className={`group relative overflow-hidden rounded-2xl border ${emotion.border} bg-gradient-to-br ${emotion.bgFrom} ${emotion.bgTo} p-6 transition-[box-shadow,border-color] duration-300 ease-out hover:shadow-lg hover:shadow-stone-200/50`}
                  >
                    {/* Icon */}
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${emotion.iconBg}`}
                    >
                      <PetalAccent className={`h-5 w-5 ${emotion.accent}`} />
                    </div>

                    <h3 className="text-lg font-semibold text-stone-900">{emotion.label}</h3>
                    <p className="mt-1 text-sm text-stone-500">{emotion.desc}</p>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center gap-1.5">
                      <span className={`text-xs font-medium ${emotion.accent}`}>Xem hoa</span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 ${emotion.accent} transition-transform group-hover:translate-x-1`}
                      />
                    </div>

                    {/* Hover corner glow */}
                    <div
                      className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/40 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ════════ Features ════════ */}
      <section className="section-padding relative overflow-hidden bg-stone-50">
        <DotPattern className="opacity-30" />

        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeading
              title="Trải nghiệm đặt hoa hoàn hảo"
              subtitle="Flowery mang đến dịch vụ đặt hoa thông minh, nhanh chóng và đáng tin cậy"
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.15}>
                <div className="group relative overflow-hidden rounded-2xl border border-stone-100 bg-white p-8 transition-[box-shadow,border-color] duration-300 ease-out hover:border-stone-200 hover:shadow-lg hover:shadow-stone-200/40">
                  {/* Gradient icon */}
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} shadow-sm`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-stone-900">{feature.title}</h3>
                  <p className="leading-relaxed text-stone-500">{feature.desc}</p>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${feature.accent} transition-all duration-500 group-hover:w-full`}
                    aria-hidden="true"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ How it works ════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeading
              title="Đặt hoa trong 3 bước"
              subtitle="Đơn giản, nhanh chóng, và luôn đúng ý bạn"
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Chọn cảm xúc',
                desc: 'Bạn muốn gửi gắm điều gì? Lãng mạn, biết ơn, hay chúc mừng?',
                icon: Heart,
              },
              {
                step: '02',
                title: 'Chọn bó hoa',
                desc: 'Flowery gợi ý những bó hoa phù hợp nhất từ các shop gần bạn.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Nhận hoa tận nơi',
                desc: 'Hoa tươi được giao trong 2 giờ, kèm thiệp và thông điệp của bạn.',
                icon: Clock,
              },
            ].map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.15}>
                <div className="relative text-center">
                  {/* Step number */}
                  <span className="mb-4 inline-block font-serif text-5xl font-bold text-stone-100">
                    {step.step}
                  </span>
                  <div className="bg-primary-50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <step.icon className="text-primary-600 h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-stone-900">{step.title}</h3>
                  <p className="text-stone-500">{step.desc}</p>

                  {/* Connector line (not on last) */}
                  {i < 2 && (
                    <div
                      className="pointer-events-none absolute top-12 right-0 hidden h-px w-1/2 -translate-x-0 bg-gradient-to-r from-stone-200 to-transparent md:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <VineDivider className="container-wide" />

      {/* ════════ Testimonials ════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeading
              title="Khách hàng nói gì?"
              subtitle="Hàng nghìn khách hàng tin tưởng Flowery mỗi ngày"
            />
          </ScrollReveal>

          <StaggerReveal className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.author}>
                <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                  {/* Stars */}
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 leading-relaxed text-stone-600">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                    <div className="bg-primary-50 text-primary-600 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
                      {t.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{t.author}</p>
                      <p className="text-xs text-stone-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <div className="from-primary-600 via-primary-500 relative overflow-hidden rounded-3xl bg-gradient-to-br to-rose-500 p-12 text-center md:p-16">
              {/* Background decoration */}
              <FloatingPetals count={6} className="text-white opacity-[0.08]" />

              <div className="relative z-10">
                <PetalAccent className="mx-auto mb-4 h-8 w-8 text-white/60" />
                <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
                  Sẵn sàng gửi yêu thương?
                </h2>
                <p className="mx-auto mb-8 max-w-lg text-lg text-white/80">
                  Hãy để Flowery giúp bạn tìm bó hoa hoàn hảo cho người thân yêu
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/quiz"
                    className="group text-primary-600 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 font-bold shadow-lg transition-all hover:bg-stone-50 hover:shadow-xl"
                  >
                    Bắt đầu tìm hoa
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/flowers"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
                  >
                    Xem bộ sưu tập
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
