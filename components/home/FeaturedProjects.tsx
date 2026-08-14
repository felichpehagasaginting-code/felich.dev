'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from './SectionHeading';
import { getProjectIcon } from '@/lib/projectIcons';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function FeaturedProjects({ projects }: { projects: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});

  const featured = projects
    .filter((p) => p.featured)
    .concat(projects.filter((p) => !p.featured))
    .slice(0, 3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Staggered 3D entrance with reliable trigger
        gsap.fromTo(
          '.project-bento-card',
          {
            y: 40,
            opacity: 0,
            scale: 0.96,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 95%',
              once: true,
            },
          }
        );

        // 2. Scroll Velocity Inertial Skew
        let proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter('.project-bento-card', 'skewY', 'deg');
        const clamp = gsap.utils.clamp(-3, 3);

        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -400);
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

  const handleCardMouseMove = (slug: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [slug]: { x, y } }));
  };

  if (featured.length === 0) return null;

  return (
    <section ref={sectionRef} className="mb-16">
      <SectionHeading
        eyebrow="Featured Work"
        titleKey="home_featured_title"
        subKey="home_featured_sub"
        viewAllHref="/projects"
        viewAllKey="home_view_all_projects"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 [perspective:1000px]">
        {featured.map((project, i) => {
          const slug = project.slug || project.title;
          const types = Array.isArray(project.type) ? project.type.join(' · ') : project.type;
          const icon = getProjectIcon(project.slug);
          const isFlagship = i === 0;
          const pos = mousePos[slug] || { x: 0, y: 0 };

          return (
            <Link
              key={slug}
              href={`/projects/${project.slug || ''}`}
              onMouseMove={(e) => handleCardMouseMove(slug, e)}
              className={`project-bento-card group p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden rounded-3xl [transform-style:preserve-3d] hover:-translate-y-1.5 ${
                isFlagship ? 'md:col-span-2' : 'col-span-1'
              }`}
            >
              {/* Dynamic Interactive Mouse Radial Spotlight */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{
                  background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(59, 130, 246, 0.14), transparent 70%)`,
                }}
              />

              {/* Ambient Glow Corner */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--brand)]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center p-1 text-[var(--brand)] bg-[var(--brand-bg)] border border-[var(--brand)]/25 rounded-xl shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      {icon}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                      {types}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)]/50 group-hover:text-[var(--brand)] transition-colors">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base md:text-lg text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand)] transition-colors mb-2">
                  {project.title}
                </h3>

                <p
                  className={`text-xs md:text-sm text-[var(--text-muted)] leading-relaxed mb-6 ${
                    isFlagship ? 'line-clamp-3' : 'line-clamp-2'
                  }`}
                >
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-[var(--border-default)] flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(project.techStack || []).slice(0, isFlagship ? 5 : 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-[10px] font-mono bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold border border-[var(--border-default)] rounded-md group-hover:border-[var(--brand)]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.techStack || []).length > (isFlagship ? 5 : 3) && (
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold rounded-md">
                      +{(project.techStack || []).length - (isFlagship ? 5 : 3)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] group-hover:translate-x-1 transition-transform">
                  <span>Explore Interactive Case Study</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}