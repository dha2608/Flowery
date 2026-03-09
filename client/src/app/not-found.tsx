import Link from 'next/link';
import { Home, Flower2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-16">
      <div className="mb-8 text-center">
        <span className="text-[10rem] leading-none font-bold text-stone-200 sm:text-[14rem]">
          404
        </span>
      </div>

      <div className="mb-12 max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-bold text-stone-800 sm:text-4xl">
          Trang này không tồn tại
        </h1>
        <p className="text-lg text-stone-500">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-colors"
        >
          <Home className="h-5 w-5" />
          Về trang chủ
        </Link>

        <Link
          href="/flowers"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-8 py-4 font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
        >
          <Flower2 className="h-5 w-5" />
          Khám phá hoa
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className="mb-4 text-sm text-stone-400">Hoặc bạn có thể thử:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/products', label: 'Sản phẩm' },
            { href: '/shops', label: 'Cửa hàng' },
            { href: '/quiz', label: 'Quiz tìm hoa' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
