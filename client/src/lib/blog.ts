import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  featured?: boolean;
  popular?: boolean;
  image?: string;
  content?: string;
}

export interface BlogCategory {
  id: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'meo-cham-hoa', label: 'Mẹo chăm hoa' },
  { id: 'y-nghia-hoa', label: 'Ý nghĩa hoa' },
  { id: 'xu-huong', label: 'Xu hướng' },
  { id: 'huong-dan-tang-hoa', label: 'Hướng dẫn tặng hoa' },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getCategoryLabel(id: string): string {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// ─── Blog Functions ───────────────────────────────────────────────────────────

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      category: data.category || 'other',
      author: data.author || 'Flowery Team',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || calculateReadTime(content),
      featured: data.featured || false,
      popular: data.popular || false,
      image: data.image,
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  if (category === 'all') return posts;
  return posts.filter((post) => post.category === category);
}

export function getFeaturedPost(): BlogPost | undefined {
  return getAllPosts().find((post) => post.featured);
}

export function getPopularPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.popular);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || '',
    category: data.category || 'other',
    author: data.author || 'Flowery Team',
    date: data.date || new Date().toISOString(),
    readTime: data.readTime || calculateReadTime(content),
    featured: data.featured || false,
    popular: data.popular || false,
    image: data.image,
    content: contentHtml,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}
