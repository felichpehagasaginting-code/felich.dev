'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SectionHeading from './SectionHeading';

export default function BlogTeaser({ posts }: { posts: any[] }) {
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="mb-16">
      <Reveal width="100%">
        <SectionHeading
          eyebrow="Journal"
          titleKey="home_latest_title"
          subKey="home_latest_sub"
          viewAllHref="/blog"
          viewAllKey="home_view_all_posts"
        />

        <div className="space-y-3">
          {latest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all duration-150 flex items-start justify-between gap-6"
              style={{ borderRadius: '8px' }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  <span className="text-[var(--brand)]">
                    {new Date(post.frontMatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
                  <span className="truncate">
                    {(post.frontMatter.topics || []).slice(0, 2).join(' · ')}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand)] transition-colors mb-1.5">
                  {post.frontMatter.title}
                </h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {post.frontMatter.description}
                </p>
              </div>
              <span className="flex-shrink-0 text-[var(--brand)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}