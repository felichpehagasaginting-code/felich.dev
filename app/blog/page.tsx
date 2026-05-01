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
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
            The Archive
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg max-w-xl font-medium leading-relaxed">
            A chronological journey through software engineering, design systems, and digital manifestation. 📜
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center">
            <span className="text-neutral-500 italic">No entries found in the timeline yet...</span>
          </div>
        ) : (
          <div className="relative pl-8 md:pl-12">
            {/* The Timeline Vertical Line */}
            <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/20 to-transparent" />

            <div className="space-y-16">
              {posts.map((post, index) => (
                <div key={post.slug} className="relative group">
                  {/* Timeline Marker */}
                  <div className="absolute -left-8 md:-left-12 top-2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-[#0A0A0A] shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10 group-hover:scale-125 transition-transform duration-300" />
                  
                  {/* Date Badge */}
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {new Date(post.frontMatter.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="block p-6 md:p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-apple hover:shadow-2xl hover:border-primary/30 transition-all duration-500 liquid-glass"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                          {post.frontMatter.title}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                          {post.frontMatter.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.frontMatter.topics?.map((topic: string) => (
                            <span key={topic} className="px-3 py-1 bg-neutral-100 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-white/5">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                          Dive deeper
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Optional: Add image preview if post has one */}
                      {post.frontMatter.image && (
                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden relative border border-white/10">
                          <img src={post.frontMatter.image} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
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
