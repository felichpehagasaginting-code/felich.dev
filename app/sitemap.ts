import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getLastModified(filePath?: string) {
  if (!filePath || !fs.existsSync(filePath)) {
    return new Date('2026-06-24').toISOString();
  }

  const file = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(file);
  const frontmatterDate = data.updated ?? data.date;

  if (frontmatterDate) {
    return new Date(frontmatterDate).toISOString();
  }

  return fs.statSync(filePath).mtime.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://felich.dev';
  const appDir = path.join(process.cwd(), 'app');

  const staticRoutes = [
    { route: '', file: path.join(appDir, 'page.tsx'), priority: 1 },
    { route: '/about', file: path.join(appDir, 'about', 'page.tsx'), priority: 0.8 },
    { route: '/projects', file: path.join(appDir, 'projects', 'page.tsx'), priority: 0.8 },
    { route: '/achievements', file: path.join(appDir, 'achievements', 'page.tsx'), priority: 0.8 },
    { route: '/contact', file: path.join(appDir, 'contact', 'page.tsx'), priority: 0.8 },
    { route: '/guestbook', file: path.join(appDir, 'guestbook', 'page.tsx'), priority: 0.8 },
    { route: '/links', file: path.join(appDir, 'links', 'page.tsx'), priority: 0.8 },
    { route: '/uses', file: path.join(appDir, 'uses', 'page.tsx'), priority: 0.8 },
    { route: '/blog', file: path.join(appDir, 'blog', 'page.tsx'), priority: 0.8 },
  ].map(({ route, file, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: getLastModified(file),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  // Dynamic Blog Routes
  let blogRoutes: any[] = [];
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir);
      blogRoutes = files.map((filename) => ({
        url: `${baseUrl}/blog/${filename.replace('.mdx', '')}`,
        lastModified: getLastModified(path.join(blogDir, filename)),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error('Sitemap blog error:', err);
  }

  return [...staticRoutes, ...blogRoutes];
}
