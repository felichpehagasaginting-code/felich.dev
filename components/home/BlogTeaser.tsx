'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from './SectionHeading';
import { ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function BlogTeaser({ posts }: { posts: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});
  const latest = posts.slice(0, 3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Staggered slide in with guaranteed visibility
        gsap.fromTo(
          '.blog-teaser-card',
          {
            x: -30,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 95%',
              once: true,
            },
          }
        );

        // Scroll velocity inertial skew
        let proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter('.blog-teaser-card', 'skewY', 'deg');
        const clamp = gsap.utils.clamp(-3, 3);

        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -500);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: 'power3.out',
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      });
    },
    { scope: sectionRef }
  );

  const handleMouseMove = (slug: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [slug]: { x, y } }));
  };

  if (latest.length === 0) return null;

  return (
    <section ref={sectionRef} className="mb-16">
      <SectionHeading
        eyebrow="Journal"
        titleKey="home_latest_title"
        subKey="home_latest_sub"
        viewAllHref="/blog"
        viewAllKey="home_view_all_posts"
      />

      <div className="space-y-3.5">
        {latest.map((post) => {
          const slug = post.slug;
          const pos = mousePos[slug] || { x: 0, y: 0 };

          return (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              onMouseMove={(e) => handleMouseMove(slug, e)}
              className="blog-teaser-card group p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all duration-300 flex items-start justify-between gap-6 rounded-2xl relative overflow-hidden hover:-translate-y-1"
            >
              {/* Dynamic Interactive Mouse Radial Spotlight */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(59, 130, 246, 0.15), transparent 70%)`,
                }}
              />

              <div className="min-w-0 flex-1 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  <span className="text-[var(--brand)] font-bold">
                    {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
                  <span className="truncate font-semibold">
                    {(post.frontMatter.topics || []).slice(0, 2).join(' · ')}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm md:text-base text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand)] transition-colors mb-1.5 leading-snug">
                  {post.frontMatter.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {post.frontMatter.description}
                </p>
              </div>

              <span className="flex-shrink-0 text-[var(--brand)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all mt-1 relative z-10">
                <ArrowRight size={18} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}