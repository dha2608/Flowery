import Link from 'next/link';

import { Container } from '@/components/layout';
import {
  BLOG_CATEGORIES,
  getAllPosts,
  getCategoryLabel,
  getFeaturedPost,
  getPopularPosts,
  type BlogPost,
} from '@/lib/blog';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Blog | Flowery',
  description:
    'Khám phá thế giới hoa qua những bài viết chuyên sâu về ý nghĩa hoa, mẹo chăm sóc, xu hướng và hướng dẫn tặng hoa tại Việt Nam.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturedArticle({ article }: { article: BlogPost }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="card-base card-hover overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div
            className="aspect-[16/9] md:aspect-auto md:min-h-72 bg-stone-100 bg-cover bg-center"
            style={{ backgroundImage: article.image ? `url(${article.image})` : undefined }}
          />

          {/* Content */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="label-text">{getCategoryLabel(article.category)}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden="true" />
              <span className="label-text">Nổi bật</span>
            </div>

            <h2 className="heading-md mb-3 group-hover:text-primary-600 transition-colors">
              {article.title}
            </h2>

            <p className="body-base mb-6 line-clamp-3">{article.excerpt}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900">{article.author}</p>
                <p className="text-xs text-stone-400">
                  {formatDate(article.date)} · {article.readTime} phút đọc
                </p>
              </div>
            </div>

            <span className="btn-primary w-fit">Đọc thêm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: BlogPost }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <div className="card-base card-hover overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div
          className="aspect-[16/9] bg-stone-100 flex-shrink-0 bg-cover bg-center"
          style={{ backgroundImage: article.image ? `url(${article.image})` : undefined }}
        />

        {/* Content */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-center gap-2">
            <span className="label-text">{getCategoryLabel(article.category)}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden="true" />
            <span className="text-xs text-stone-400">{article.readTime} phút đọc</span>
          </div>

          <h3 className="font-medium text-stone-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
            {article.title}
          </h3>

          <p className="body-sm line-clamp-3">{article.excerpt}</p>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-stone-200 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-stone-700">{article.author}</p>
              <p className="text-xs text-stone-400">{formatDate(article.date)}</p>
            </div>
          </div>
          <span className="text-xs text-stone-400 group-hover:text-primary-600 group-hover:underline transition-colors">
            Đọc thêm
          </span>
        </div>
      </div>
    </Link>
  );
}

function PopularArticleCard({ article }: { article: BlogPost }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex items-start gap-3 py-3 border-b border-stone-100 last:border-0 hover:opacity-75 transition-opacity"
    >
      <div
        className="w-14 h-14 rounded-xl bg-stone-100 flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: article.image ? `url(${article.image})` : undefined }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-1">
          {article.title}
        </p>
        <p className="text-xs text-stone-400">
          {article.readTime} phút đọc · {formatDate(article.date)}
        </p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeCategory =
    typeof params.category === 'string' && params.category ? params.category : 'all';

  // Get posts from markdown files
  const allPosts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const popularPosts = getPopularPosts();

  const regularPosts = allPosts.filter((post) => {
    if (post.featured) return false;
    if (activeCategory === 'all') return true;
    return post.category === activeCategory;
  });

  const filteredFeatured =
    activeCategory === 'all' || featuredPost?.category === activeCategory ? featuredPost : null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-100 py-12">
        <Container className="max-w-3xl text-center">
          <h1 className="heading-lg mb-3">Blog</h1>
          <p className="body-base max-w-xl mx-auto">
            Góc nhìn chuyên sâu về thế giới hoa — từ văn hóa, ý nghĩa, đến mẹo chăm sóc và xu hướng
            tặng hoa hiện đại tại Việt Nam.
          </p>
        </Container>
      </section>

      {/* ── Category Tabs ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <Container className="max-w-7xl">
          <div className="flex items-center overflow-x-auto">
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/blog' : `?category=${cat.id}`}
                className={cn(
                  'py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-600',
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <Container className="max-w-7xl py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Left: Articles ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured article */}
            {filteredFeatured && (
              <div>
                <p className="label-text mb-5">Bài viết nổi bật</p>
                <FeaturedArticle article={filteredFeatured} />
              </div>
            )}

            {/* Article grid */}
            {regularPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <p className="label-text">
                    {activeCategory === 'all'
                      ? 'Bài viết mới nhất'
                      : BLOG_CATEGORIES.find((c) => c.id === activeCategory)?.label}
                  </p>
                  <span className="text-xs text-stone-400">{regularPosts.length} bài viết</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {regularPosts.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!filteredFeatured && regularPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="heading-sm mb-2">Chưa có bài viết nào</p>
                <p className="body-sm mb-6">
                  Danh mục này chưa có bài viết. Hãy thử danh mục khác.
                </p>
                <Link href="/blog" className="btn-secondary">
                  Xem tất cả bài viết
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="space-y-8">
            {/* Popular articles */}
            {popularPosts.length > 0 && (
              <div className="card-base p-6">
                <p className="label-text mb-5">Bài viết phổ biến</p>
                <div>
                  {popularPosts.map((article) => (
                    <PopularArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="card-base p-6">
              <p className="heading-sm mb-2">Nhận bản tin</p>
              <p className="body-sm mb-4">
                Cập nhật bài viết mới nhất về hoa, mẹo chăm sóc và xu hướng tặng hoa hàng tuần.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-2.5 text-sm text-stone-900 border border-stone-200 rounded-xl placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
                />
                <button type="submit" className="btn-primary w-full">
                  Đăng ký nhận tin
                </button>
              </form>
            </div>

            {/* Category links */}
            <div className="card-base p-6">
              <p className="label-text mb-4">Chủ đề</p>
              <div className="space-y-1">
                {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const count = allPosts.filter((a) => a.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`?category=${cat.id}`}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        activeCategory === cat.id
                          ? 'bg-stone-100 text-stone-900 font-medium'
                          : 'text-stone-600 hover:bg-stone-50',
                      )}
                    >
                      <span>{cat.label}</span>
                      <span className="text-xs text-stone-400">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Discover CTA */}
            <div className="card-base p-6">
              <p className="heading-sm mb-2">Từ điển hoa</p>
              <p className="body-sm mb-4">
                Tìm hiểu ý nghĩa sâu xa của 20+ loài hoa trong văn hóa Việt Nam.
              </p>
              <Link href="/flowers/meanings" className="btn-secondary w-full">
                Xem từ điển hoa
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
