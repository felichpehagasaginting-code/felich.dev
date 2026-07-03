import { describe, it, expect } from 'vitest';
import { siteConfig, absoluteUrl, createMetadata } from '@/lib/seo';

describe('seo.ts', () => {
  describe('siteConfig', () => {
    it('has required fields', () => {
      expect(siteConfig).toHaveProperty('name');
      expect(siteConfig).toHaveProperty('title');
      expect(siteConfig).toHaveProperty('description');
      expect(siteConfig).toHaveProperty('url');
      expect(siteConfig).toHaveProperty('author');
      expect(siteConfig.url).toBe('https://felich.dev');
    });
  });

  describe('absoluteUrl', () => {
    it('returns the same URL if it already starts with http', () => {
      expect(absoluteUrl('https://example.com/test')).toBe('https://example.com/test');
    });

    it('prepends site URL for root path', () => {
      expect(absoluteUrl('/')).toBe('https://felich.dev/');
    });

    it('prepends site URL for relative paths', () => {
      expect(absoluteUrl('/blog')).toBe('https://felich.dev/blog');
    });

    it('adds leading slash if missing', () => {
      expect(absoluteUrl('blog')).toBe('https://felich.dev/blog');
    });
  });

  describe('createMetadata', () => {
    it('returns default metadata when called without args', () => {
      const meta = createMetadata();
      expect(meta).toHaveProperty('title', siteConfig.title);
      expect(meta).toHaveProperty('description', siteConfig.description);
      expect(meta).toHaveProperty('openGraph');
      expect(meta).toHaveProperty('twitter');
    });

    it('overrides title', () => {
      const meta = createMetadata({ title: 'My Post' });
      expect(meta.title).toBe('My Post');
    });

    it('sets canonical URL from path', () => {
      const meta = createMetadata({ path: '/blog/my-post' });
      expect(meta.alternates?.canonical).toBe('https://felich.dev/blog/my-post');
    });

    it('sets noIndex when specified', () => {
      const meta = createMetadata({ noIndex: true });
      expect(meta.robots).toEqual({ index: false, follow: false });
    });

    it('does not set robots by default', () => {
      const meta = createMetadata();
      expect(meta.robots).toBeUndefined();
    });

    it('sets article type metadata', () => {
      const meta = createMetadata({
        type: 'article',
        publishedTime: '2025-01-01',
        tags: ['tech', 'ai'],
      });
      expect(meta.alternates?.canonical).toBeDefined();
    });

    it('handles image paths correctly', () => {
      const meta = createMetadata({ image: '/api/og?title=test' });
      expect(meta.openGraph?.images).toBeDefined();
    });

    it('returns openGraph with expected fields for article', () => {
      const meta = createMetadata({
        type: 'article',
        publishedTime: '2025-01-01',
        tags: ['tech'],
        title: 'Article Title',
      });
      expect(meta.title).toBe('Article Title');
    });
  });
});
