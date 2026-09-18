import { describe, it, expect } from 'vitest';
import {
  slugify,
  parseYouTubeId,
  toYouTubeEmbed,
  toYouTubeThumbnail,
  isAllowedImageUrl,
  validateProject,
  normalizeProject,
  sortProjects,
} from '@/lib/projects';

describe('lib/projects', () => {
  describe('slugify', () => {
    it('membuat slug url-safe dari title', () => {
      expect(slugify('Photobooth AI 2.0!')).toBe('photobooth-ai-2-0');
    });
    it('memangkas maksimal 100 karakter', () => {
      expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(100);
    });
  });

  describe('YouTube helpers', () => {
    const id = 'dQw4w9WgXcQ';
    it.each([
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtu.be/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://www.youtube-nocookie.com/embed/${id}`,
      `https://www.youtube.com/shorts/${id}`,
    ])('parse %s', (url) => {
      expect(parseYouTubeId(url)).toBe(id);
    });
    it('return null untuk URL non-YouTube', () => {
      expect(parseYouTubeId('https://example.com/video.mp4')).toBeNull();
      expect(parseYouTubeId('')).toBeNull();
    });
    it('toYouTubeEmbed memakai nocookie domain', () => {
      expect(toYouTubeEmbed(`https://youtu.be/${id}`)).toBe(`https://www.youtube-nocookie.com/embed/${id}`);
    });
    it('toYouTubeThumbnail mengarah ke i.ytimg.com', () => {
      expect(toYouTubeThumbnail(`https://youtu.be/${id}`)).toBe(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    });
  });

  describe('isAllowedImageUrl', () => {
    it('mengizinkan host gratis', () => {
      expect(isAllowedImageUrl('https://cdn.jsdelivr.net/gh/u/r@main/a.webp')).toBe(true);
      expect(isAllowedImageUrl('https://ik.imagekit.io/u/a.png')).toBe(true);
      expect(isAllowedImageUrl('https://images.unsplash.com/photo-1')).toBe(true);
    });
    it('menolak host sembarang dan http', () => {
      expect(isAllowedImageUrl('https://evil.example.com/a.png')).toBe(false);
      expect(isAllowedImageUrl('http://cdn.jsdelivr.net/gh/u/r@main/a.png')).toBe(false);
      expect(isAllowedImageUrl('bukan-url')).toBe(false);
    });
    it('string kosong valid (opsional)', () => {
      expect(isAllowedImageUrl('')).toBe(true);
    });
  });

  describe('validateProject', () => {
    it('wajib title & description', () => {
      const errs = validateProject({});
      expect(errs.map((e) => e.field)).toContain('title');
      expect(errs.map((e) => e.field)).toContain('description');
    });
    it('lolos untuk project valid', () => {
      expect(
        validateProject({
          title: 'StackWay',
          description: 'Platform edukasi',
          github: 'https://github.com/x/y',
          coverImage: 'https://cdn.jsdelivr.net/gh/x/y@main/c.webp',
          demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          gallery: ['https://images.unsplash.com/photo-1'],
        })
      ).toEqual([]);
    });
    it('menolak galeri > 8 dan cover host liar', () => {
      const errs = validateProject({
        title: 'T',
        description: 'D',
        coverImage: 'https://evil.example.com/a.png',
        gallery: Array.from({ length: 9 }, (_, i) => `https://cdn.jsdelivr.net/gh/x/y@main/${i}.png`),
      });
      expect(errs.map((e) => e.field)).toContain('coverImage');
      expect(errs.map((e) => e.field)).toContain('gallery');
    });
  });

  describe('normalizeProject', () => {
    it('memangkas dan membatasi list', () => {
      const n = normalizeProject({
        title: '  StackWay  ',
        description: 'd',
        techStack: ['a', ' ', 'b'],
        gallery: Array.from({ length: 20 }, (_, i) => `g${i}`),
        order: 3.9,
      });
      expect(n.title).toBe('StackWay');
      expect(n.techStack).toEqual(['a', 'b']);
      expect(n.gallery).toHaveLength(8);
      expect(n.order).toBe(3);
    });
  });

  describe('sortProjects', () => {
    it('order > featured > date', () => {
      const rows = [
        { order: 0, featured: false, date: '2026-06-01' },
        { order: 0, featured: true, date: '2026-01-01' },
        { order: 1, featured: false, date: '2025-01-01' },
      ];
      const sorted = sortProjects(rows);
      expect(sorted[0]).toMatchObject({ order: 1 });
      expect(sorted[1]).toMatchObject({ featured: true });
    });
  });
});
