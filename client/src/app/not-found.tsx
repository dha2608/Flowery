import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { PetalAccent, FloatingPetals, DotPattern, RoseIcon } from '@/components/ui/botanicals';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-white px-4 py-16">
      {/* Background decorations */}
      <FloatingPetals count={5} />
      <DotPattern className="opacity-30" />

      {/* 404 visual */}
      <div className="relative mb-8 text-center">
        <span className="text-[10rem] leading-none font-bold text-stone-100 select-none sm:text-[14rem]">
          404
        </span>
        {/* Flower accent on top of the numbers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/80 shadow-lg shadow-stone-200/50 backdrop-blur-sm">
            <PetalAccent className="text-primary-400 h-12 w-12" />
          </div>
        </div>
      </div>

      <div className="relative mb-12 max-w-lg text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold text-stone-800 sm:text-4xl">
          Trang này không tồn tại
        </h1>
        <p className="text-lg leading-relaxed text-stone-500">
          Có vẻ bông hoa bạn tìm đã bay đi nơi khác rồi.
          <br className="hidden sm:block" />
          Hãy thử quay về hoặc khám phá bộ sưu tập của chúng tôi.
        </p>
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="group bg-primary-600 hover:bg-primary-700 shadow-primary-500/25 inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
        >
          <Home className="h-5 w-5" />
          Về trang chủ
        </Link>

        <Link
          href="/flowers"
          className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-200 bg-white px-8 py-4 font-semibold text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm"
        >
          <RoseIcon className="h-5 w-5" />
          Khám phá hoa
        </Link>
      </div>

      <div className="relative mt-16 text-center">
        <p className="mb-4 text-sm font-medium text-stone-400">Bạn cũng có thể thử:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/products', label: 'Sản phẩm' },
            { href: '/shops', label: 'Cửa hàng' },
            { href: '/quiz', label: 'Quiz tìm hoa' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-all hover:border-stone-300 hover:text-stone-900 hover:shadow-sm"
            >
              {link.label}
              <ArrowRight className="h-3 w-3 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
