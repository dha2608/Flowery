import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
