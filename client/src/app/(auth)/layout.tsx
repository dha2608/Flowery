import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RoseIcon, FloatingPetals, DotPattern } from '@/components/ui/botanicals';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30">
      {/* Background decorations */}
      <FloatingPetals count={5} />
      <DotPattern className="opacity-25" />

      {/* Warm gradient blobs */}
      <div
        className="bg-primary-100/30 pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-amber-100/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center p-4 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="bg-primary-600 shadow-primary-500/20 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg">
              <RoseIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-primary-600 font-serif text-2xl font-bold">Flowery</span>
              <p className="text-xs text-stone-400">Nền tảng đặt hoa thông minh</p>
            </div>
          </Link>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-8 shadow-xl shadow-stone-200/30 backdrop-blur-sm">
            {children}
          </div>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-sm text-stone-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-stone-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
