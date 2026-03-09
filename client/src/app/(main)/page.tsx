'use client';

import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Search } from 'lucide-react';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/ui/scroll-reveal';

const emotions = [
  {
    key: 'romantic',
    label: 'Lãng mạn',
    desc: 'Tình yêu & lãng mạn',
    bg: 'bg-rose-50 hover:bg-rose-100',
  },
  { key: 'grateful', label: 'Biết ơn', desc: 'Lòng tri ân', bg: 'bg-amber-50 hover:bg-amber-100' },
  {
    key: 'joyful',
    label: 'Vui vẻ',
    desc: 'Niềm vui & hạnh phúc',
    bg: 'bg-yellow-50 hover:bg-yellow-100',
  },
  {
    key: 'sympathetic',
    label: 'Chia sẻ',
    desc: 'Đồng cảm & an ủi',
    bg: 'bg-sky-50 hover:bg-sky-100',
  },
  {
    key: 'respectful',
    label: 'Kính trọng',
    desc: 'Sự tôn kính',
    bg: 'bg-violet-50 hover:bg-violet-100',
  },
  {
    key: 'apologetic',
    label: 'Xin lỗi',
    desc: 'Lời xin lỗi chân thành',
    bg: 'bg-teal-50 hover:bg-teal-100',
  },
  {
    key: 'celebratory',
    label: 'Chúc mừng',
    desc: 'Khoảnh khắc đặc biệt',
    bg: 'bg-green-50 hover:bg-green-100',
  },
  {
    key: 'passionate',
    label: 'Đam mê',
    desc: 'Nhiệt huyết & đam mê',
    bg: 'bg-red-50 hover:bg-red-100',
  },
];

const features = [
  {
    title: 'Gợi ý thông minh',
    desc: 'Phân tích cảm xúc, dịp và mối quan hệ để đề xuất bó hoa phù hợp nhất.',
    icon: Search,
  },
  {
    title: 'Giao hàng nhanh',
    desc: 'Đặt hàng từ shop gần bạn, giao nhanh trong vòng 2 giờ tại nội thành.',
    icon: Truck,
  },
  {
    title: 'Cam kết chất lượng',
    desc: 'Hoa tươi mỗi ngày từ các shop được xác minh và đánh giá bởi cộng đồng.',
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-50">
        <div className="container-wide section-padding">
          <div className="grid min-h-[70vh] items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <p className="text-primary-600 mb-4 text-sm font-medium tracking-wide uppercase">
                Nền tảng đặt hoa thông minh
              </p>

              <h1 className="mb-6 font-serif text-4xl leading-tight font-bold text-stone-900 md:text-5xl lg:text-6xl">
                Gửi yêu thương
                <br />
                qua từng <span className="text-primary-600">cánh hoa</span>
              </h1>

              <p className="mb-8 max-w-md text-lg leading-relaxed text-stone-600">
                Flowery giúp bạn tìm bó hoa hoàn hảo dựa trên cảm xúc, dịp đặc biệt và mối quan hệ
                của bạn.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/quiz"
                  className="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition-colors"
                >
                  Bắt đầu tìm hoa
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/flowers"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3.5 font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
                >
                  Khám phá bộ sưu tập
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 border-t border-stone-200 pt-8">
                <div>
                  <p className="text-2xl font-bold text-stone-900">50K+</p>
                  <p className="text-sm text-stone-500">Khách hàng</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900">100+</p>
                  <p className="text-sm text-stone-500">Cửa hàng</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900">10K+</p>
                  <p className="text-sm text-stone-500">Đơn hàng/tháng</p>
                </div>
              </div>
            </div>

            {/* Hero visual - clean, no emoji */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                <div className="absolute inset-8 rounded-3xl border border-stone-200 bg-white shadow-sm" />

                <div className="absolute top-8 right-12 rounded-xl border border-stone-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-stone-900">Hoa Hồng</p>
                  <p className="mt-1 text-xs text-stone-500">Tình yêu vĩnh cửu</p>
                  <p className="text-primary-600 mt-2 text-sm font-semibold">350.000đ</p>
                </div>

                <div className="absolute bottom-20 left-8 rounded-xl border border-stone-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-stone-900">Hoa Anh Đào</p>
                  <p className="mt-1 text-xs text-stone-500">Vẻ đẹp thuần khiết</p>
                  <p className="text-primary-600 mt-2 text-sm font-semibold">280.000đ</p>
                </div>

                <div className="bg-primary-600 absolute top-1/2 right-8 -translate-y-1/2 rounded-xl p-4 text-white shadow-sm">
                  <p className="text-sm font-medium">Gợi ý AI</p>
                  <p className="mt-1 text-xs text-white/70">Phù hợp 98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotions */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal className="mb-10 text-center">
            <p className="text-primary-600 mb-3 text-sm font-medium tracking-wide uppercase">
              Chọn theo cảm xúc
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Bạn muốn gửi gắm điều gì?
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {emotions.map((emotion) => (
              <StaggerItem key={emotion.key}>
                <Link href={`/flowers?emotion=${emotion.key}`}>
                  <div
                    className={`group rounded-xl ${emotion.bg} border border-transparent p-5 transition-all duration-200 hover:border-stone-200 hover:shadow-sm`}
                  >
                    <h3 className="font-semibold text-stone-900">{emotion.label}</h3>
                    <p className="mt-1 text-sm text-stone-500">{emotion.desc}</p>
                    <ArrowRight className="mt-3 h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-600" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-stone-50">
        <div className="container-wide">
          <ScrollReveal className="mb-10 text-center">
            <p className="text-primary-600 mb-3 text-sm font-medium tracking-wide uppercase">
              Tại sao chọn Flowery?
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Trải nghiệm đặt hoa hoàn hảo
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="rounded-2xl border border-stone-200 bg-white p-8">
                  <div className="bg-primary-50 text-primary-600 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-stone-900">{feature.title}</h3>
                  <p className="leading-relaxed text-stone-600">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <div className="bg-primary-600 rounded-2xl p-12 text-center md:p-16">
              <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
                Sẵn sàng gửi yêu thương?
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-lg text-white/80">
                Hãy để Flowery giúp bạn tìm bó hoa hoàn hảo cho người thân yêu
              </p>
              <Link
                href="/quiz"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold transition-colors hover:bg-stone-50"
              >
                Bắt đầu ngay
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
