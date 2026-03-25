'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectTypes = ['All', 'Web', 'Mobile'];
const projectCategories = ['All', 'Personal Project', 'Freelance'];

const projects = [
  {
    title: 'Felich Portfolio',
    description: 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS, and Express.js.',
    image: null,
    type: 'Web',
    category: 'Personal Project',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'Express.js'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
      live: '/',
    },
  },
  {
    title: 'AI/ML Pipeline',
    description: 'Machine learning pipeline for financial data analysis with quantitative modeling capabilities.',
    image: null,
    type: 'Web',
    category: 'Personal Project',
    featured: false,
    techStack: ['Python', 'TensorFlow', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
  {
    title: 'FinTech Dashboard',
    description: 'A robust financial platform with real-time data visualization and transaction processing.',
    image: null,
    type: 'Web',
    category: 'Freelance',
    featured: false,
    techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: null,
    type: 'Web',
    category: 'Freelance',
    featured: false,
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
];

export default function Projects() {
  const [activeType, setActiveType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = projects.filter(p =>
    (activeType === 'All' || p.type === activeType) &&
    (activeCategory === 'All' || p.category === activeCategory)
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Projects</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          A showcase of both private and open-source projects I&apos;ve built or contributed to.
        </p>
      </motion.div>

      <hr className="dotted-divider mb-8" />

      {/* Type filter */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Type</span>
        <div className="flex gap-2">
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`filter-pill text-xs ${activeType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Category</span>
        <div className="flex flex-wrap gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-pill text-xs ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              layout
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="h-44 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 relative">
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-md flex items-center gap-1">
                    ⭐ Featured
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                  📦
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      Source
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Live
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
