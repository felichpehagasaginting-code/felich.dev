import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/projects',
    '/achievements',
    '/contact',
    '/guestbook',
    '/links',
    '/uses',
  ].map((route) => ({
    url: `https://felich.dev${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
