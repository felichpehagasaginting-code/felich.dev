import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PageTransition from '@/components/PageTransition';
import { Metadata } from 'next';
import { getPosts } from '@/lib/sanity';
import { createMetadata } from '@/lib/seo';
import BlogListClient, { BlogPostItem } from '@/components/blog/BlogListClient';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description: 'Writings on software engineering, AI/ML, and building digital products. Explore technical articles and insights by Felich.',
  path: '/blog',
});

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogList() {
  // 1. Fetch Local Posts (MDX)
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(blogDir);
  const localPosts: BlogPostItem[] = files.map((filename) => {
    const slug = filename.replace('.mdx', '');
    const markdownWithMeta = fs.readFileSync(path.join(blogDir, filename), 'utf-8');
    const { data: frontMatter, content } = matter(markdownWithMeta);
    return {
      slug,
      frontMatter: {
        title: frontMatter.title || slug,
        date: frontMatter.date || new Date().toISOString(),
        description: frontMatter.description || '',
        topics: frontMatter.topics || [],
        image: frontMatter.image,
      },
      readingTimeMinutes: calculateReadingTime(content),
      source: 'local' as const,
    };
  });

  // 2. Fetch Sanity Posts (if configured)
  let sanityPosts: BlogPostItem[] = [];
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const remotePosts = await getPosts();
      sanityPosts = remotePosts.map((p: any) => ({
        slug: p.slug,
        frontMatter: {
          title: p.title,
          date: p.date,
          description: p.description,
          topics: p.topics,
        },
        readingTimeMinutes: calculateReadingTime(p.description || ''),
        source: 'sanity' as const,
      }));
    } catch (error) {
      console.error('Failed to fetch from Sanity:', error);
    }
  }

  // 3. Combine and Sort
  const posts = [...localPosts, ...sanityPosts].sort((a, b) => 
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  );

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <BlogListClient posts={posts} />
      </div>
    </PageTransition>
  );
}
