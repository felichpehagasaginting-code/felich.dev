import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { Metadata } from 'next';
import { getPosts } from '@/lib/sanity';
import Image from 'next/image';
import { createMetadata } from '@/lib/seo';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogDiveCta from '@/components/blog/BlogDiveCta';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description: 'Writings on software engineering, AI/ML, and building digital products. Explore technical articles and insights by Felich.',
  path: '/blog',
});

export default async function BlogList() {
  // 1. Fetch Local Posts (MDX)
  const files = fs.readdirSync(path.join(process.cwd(), 'content', 'blog'));
  const localPosts = files.map((filename) => {
    const slug = filename.replace('.mdx', '');
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'content', 'blog', filename),
      'utf-8'
    );
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      slug,
      frontMatter,
      source: 'local' as const,
    };
  });

  // 2. Fetch Sanity Posts (if configured)
  let sanityPosts: any[] = [];
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
        source: 'sanity' as const,
      }));
    } catch (error) {
      console.error('Failed to fetch from Sanity:', error);
    }
  }

  // 3. Combine and Sort
  const posts = [...localPosts, ...sanityPosts].sort((a: any, b: any) => 
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  );

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <BlogHeader count={posts.length} />

        <hr className="dotted-divider mb-12" />

        {posts.length === 0 ? (
          <div className="p-10 rounded-lg border border-dashed border-[var(--border-default)] text-center">
            <span className="text-[var(--text-muted)] italic">No entries found in the timeline yet...</span>
          </div>
        ) : (
          <div className="relative pl-8 md:pl-12">
            {/* The Timeline Vertical Line */}
            <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-transparent" />

            <div className="space-y-10">
              {posts.map((post, index) => (
                <div key={post.slug} className="relative group">
                  {/* Timeline Marker */}
                  <div className="absolute -left-8 md:-left-12 top-6 w-4 h-4 rounded-full bg-primary border-4 border-[var(--bg-base)] z-10 group-hover:scale-125 transition-transform duration-300" />

                  <Link
                    href={`/blog/${post.slug}`}
                    className="block p-5 md:p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all duration-300 relative overflow-hidden"
                    style={{ borderRadius: '8px' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                            {new Date(post.frontMatter.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          {post.frontMatter.topics?.slice(0, 2).map((topic: string) => (
                            <span key={topic} className="px-2.5 py-0.5 bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-muted)] text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                              {topic}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-lg md:text-xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors leading-snug mb-2">
                          {post.frontMatter.title}
                        </h2>
                        <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-2 max-w-xl">
                          {post.frontMatter.description}
                        </p>

                        <BlogDiveCta />
                      </div>

                      {/* Optional: Add image preview if post has one */}
                      {post.frontMatter.image && (
                        <div className="w-full md:w-40 h-28 rounded-lg overflow-hidden relative border border-[var(--border-default)] flex-shrink-0">
                          <Image
                            src={post.frontMatter.image}
                            alt={`${post.frontMatter.title} cover image`}
                            fill
                            sizes="(max-width: 768px) 100vw, 10rem"
                            className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
