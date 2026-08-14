'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SectionHeading from './SectionHeading';
import { getProjectIcon } from '@/lib/projectIcons';

export default function FeaturedProjects({ projects }: { projects: any[] }) {
  const featured = projects
    .filter((p) => p.featured)
    .concat(projects.filter((p) => !p.featured))
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="mb-16">
      <Reveal width="100%">
        <SectionHeading
          eyebrow="Featured"
          titleKey="home_featured_title"
          subKey="home_featured_sub"
          viewAllHref="/projects"
          viewAllKey="home_view_all_projects"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((project, i) => {
            const types = Array.isArray(project.type) ? project.type.join(' · ') : project.type;
            const icon = getProjectIcon(project.slug);
            const isFlagship = i === 0;

            return (
              <Link
                key={project.slug || project.title}
                href="/projects"
                className={`group p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  isFlagship ? 'md:col-span-2' : 'col-span-1'
                }`}
                style={{ borderRadius: '8px' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center p-0.5 text-[var(--brand)] bg-[var(--brand-bg)] rounded">
                        {icon}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        {types}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]/60">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm md:text-base text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand)] transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className={`text-[12px] text-[var(--text-muted)] leading-relaxed mb-4 ${isFlagship ? 'line-clamp-3' : 'line-clamp-2'}`}>
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(project.techStack || []).slice(0, isFlagship ? 5 : 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold border border-[var(--border-default)]"
                        style={{ borderRadius: '4px' }}
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.techStack || []).length > (isFlagship ? 5 : 3) && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold" style={{ borderRadius: '4px' }}>
                        +{(project.techStack || []).length - (isFlagship ? 5 : 3)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform">
                    <span>View Case Study</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}