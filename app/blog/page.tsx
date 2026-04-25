import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { Metadata } from 'next';
import { getPosts } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writings on software engineering, AI/ML, and building digital products. Explore technical articles and insights by Felich.',
};

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
      <div>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Writings on software engineering, AI/ML, and building digital products. ✍️
          </p>
        </div>

        <hr className="dotted-divider mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
            >
              <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {post.frontMatter.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                <span>{new Date(post.frontMatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="flex gap-2">
                  {post.frontMatter.topics?.map((topic: string) => (
                    <span key={topic} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md font-semibold text-[10px] uppercase tracking-wider">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
                {post.frontMatter.description}
              </p>
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                Read article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
