import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://felich.dev';

  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/achievements',
    '/contact',
    '/guestbook',
    '/links',
    '/uses',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Blog Routes
  let blogRoutes: any[] = [];
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir);
      blogRoutes = files.map((filename) => ({
        url: `${baseUrl}/blog/${filename.replace('.mdx', '')}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error('Sitemap blog error:', err);
  }

  return [...staticRoutes, ...blogRoutes];
}
