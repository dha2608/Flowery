import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Container } from '@/components/layout';
import { getAllSlugs, getCategoryLabel, getPopularPosts, getPostBySlug } from '@/lib/blog';

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Không tìm thấy bài viết | Flowery' };
  }

  return {
    title: `${post.title} | Blog Flowery`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const popularPosts = getPopularPosts().filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-100 py-12">
        <Container className="max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>

          {/* Category & meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="label-text">{getCategoryLabel(post.category)}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden="true" />
            <span className="text-xs text-stone-400">{post.readTime} phút đọc</span>
          </div>

          {/* Title */}
          <h1 className="heading-lg mb-6">{post.title}</h1>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-stone-900">{post.author}</p>
              <p className="text-xs text-stone-400">{formatDate(post.date)}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Featured Image ─────────────────────────────────────────────────── */}
      {post.image && (
        <div className="bg-stone-100">
          <Container className="max-w-4xl py-0">
            <div
              className="aspect-[21/9] bg-cover bg-center rounded-b-2xl"
              style={{ backgroundImage: `url(${post.image})` }}
            />
          </Container>
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <Container className="max-w-3xl py-12">
        <article
          className="prose prose-stone prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-stone-600
            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-stone-900
            prose-ul:my-4 prose-li:text-stone-600
            prose-blockquote:border-l-primary-500 prose-blockquote:bg-stone-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Share & Tags */}
        <div className="border-t border-stone-100 mt-12 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Chia sẻ:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://flowery.vn/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                aria-label="Chia sẻ Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>

            <Link
              href={`/blog?category=${post.category}`}
              className="text-sm text-primary-600 hover:underline"
            >
              Xem thêm bài viết {getCategoryLabel(post.category)}
            </Link>
          </div>
        </div>
      </Container>

      {/* ── Related Posts ──────────────────────────────────────────────────── */}
      {popularPosts.length > 0 && (
        <section className="bg-stone-50 border-t border-stone-100 py-12">
          <Container className="max-w-4xl">
            <h2 className="heading-md mb-8 text-center">Bài viết khác bạn có thể thích</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <div className="card-base card-hover overflow-hidden">
                    <div
                      className="aspect-[16/10] bg-stone-100 bg-cover bg-center"
                      style={{
                        backgroundImage: relatedPost.image ? `url(${relatedPost.image})` : undefined,
                      }}
                    />
                    <div className="p-4">
                      <p className="label-text mb-2">{getCategoryLabel(relatedPost.category)}</p>
                      <h3 className="text-sm font-medium text-stone-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
