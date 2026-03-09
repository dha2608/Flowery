import Link from 'next/link';
import { Flower2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-stone-50">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-xl">
              <Flower2 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-primary-600 font-serif text-2xl font-bold">Flowery</span>
              <p className="text-xs text-stone-400">Nền tảng đặt hoa thông minh</p>
            </div>
          </Link>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            {children}
          </div>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-sm text-stone-400">
          <Link href="/" className="transition-colors hover:text-stone-600">
            &larr; Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
