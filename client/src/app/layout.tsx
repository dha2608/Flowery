import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/query-provider';
import { RouteProgress } from '@/components/ui/route-progress';
import { Suspense } from 'react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'Flowery - Gửi Yêu Thương Qua Từng Cánh Hoa',
  description: 'Nền tảng đặt hoa thông minh dựa trên cảm xúc. Tìm bó hoa hoàn hảo cho mọi dịp, mọi mối quan hệ.',
  keywords: ['hoa', 'đặt hoa', 'giao hoa', 'Flowery', 'flower delivery', 'Vietnam'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} ${playfairDisplay.variable} min-h-screen font-sans`}>
        <QueryProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
