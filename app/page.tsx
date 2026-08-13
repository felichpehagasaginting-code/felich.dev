import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Script from 'next/script';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/home/Hero';
import StatsBand from '@/components/home/StatsBand';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import TerminalSection from '@/components/home/TerminalSection';
import SkillsSection from '@/components/home/SkillsSection';
import BlogTeaser from '@/components/home/BlogTeaser';
import ShortcutHint from '@/components/home/ShortcutHint';

export default function Home() {
  // Read projects MDX (featured-first for the home teaser)
  let projects: any[] = [];
  try {
    const projectDir = path.join(process.cwd(), 'content', 'projects');
    if (fs.existsSync(projectDir)) {
      projects = fs.readdirSync(projectDir).map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join(projectDir, filename), 'utf-8');
        const { data: frontMatter } = matter(markdownWithMeta);
        return { slug: filename.replace('.mdx', ''), ...frontMatter };
      });
      projects.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
  } catch (error) {
    console.error('Error fetching projects MDX:', error);
  }

  // Read blog MDX (latest-first for the home teaser)
  let posts: any[] = [];
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (fs.existsSync(blogDir)) {
      posts = fs.readdirSync(blogDir).map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join(blogDir, filename), 'utf-8');
        const { data: frontMatter } = matter(markdownWithMeta);
        return { slug: filename.replace('.mdx', ''), frontMatter };
      });
      posts.sort((a, b) => new Date(b.frontMatter.date || 0).getTime() - new Date(a.frontMatter.date || 0).getTime());
    }
  } catch (error) {
    console.error('Error fetching blog MDX:', error);
  }

  return (
    <PageTransition>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Felich',
            url: 'https://felich.dev',
            jobTitle: 'Software Engineer',
            knowsAbout: ['AI Engineering', 'FinTech', 'Next.js', 'TypeScript', 'Machine Learning'],
            sameAs: [
              'https://github.com/felichpehagasaginting-code',
              'https://www.linkedin.com/in/felich-pehagasa-ginting-b6a8a32a6/',
              'https://www.instagram.com/fel.comp',
            ],
          }),
        }}
      />
      <div>
        <Hero />
        <StatsBand />
        <FeaturedProjects projects={projects} />
        <TerminalSection />
        <SkillsSection />
        <BlogTeaser posts={posts} />
        <ShortcutHint />
      </div>
    </PageTransition>
  );
}