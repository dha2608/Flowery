import type { Metadata, Viewport } from 'next';
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowery.vn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Flowery - Gửi Yêu Thương Qua Từng Cánh Hoa',
    template: '%s | Flowery',
  },
  description:
    'Nền tảng đặt hoa thông minh dựa trên cảm xúc. Tìm bó hoa hoàn hảo cho mọi dịp, mọi mối quan hệ. Giao hoa nhanh toàn quốc.',
  keywords: [
    'hoa',
    'đặt hoa',
    'giao hoa',
    'hoa tươi',
    'hoa sinh nhật',
    'hoa khai trương',
    'hoa chia buồn',
    'hoa tình yêu',
    'Flowery',
    'flower delivery Vietnam',
  ],
  authors: [{ name: 'Flowery', url: siteUrl }],
  creator: 'Flowery',
  publisher: 'Flowery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: 'Flowery',
    title: 'Flowery - Gửi Yêu Thương Qua Từng Cánh Hoa',
    description: 'Nền tảng đặt hoa thông minh dựa trên cảm xúc. Tìm bó hoa hoàn hảo cho mọi dịp.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flowery - Nền tảng giao hoa theo cảm xúc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowery - Gửi Yêu Thương Qua Từng Cánh Hoa',
    description: 'Nền tảng đặt hoa thông minh dựa trên cảm xúc.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add when available
    // google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1614' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${playfairDisplay.variable} min-h-screen font-sans`}
      >
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
