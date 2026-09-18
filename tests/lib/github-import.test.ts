import { describe, it, expect } from 'vitest';
import { parseRepoRef, mapRepoToFields, applyImport } from '@/lib/github-import';
import type { ProjectFormValue } from '@/lib/projects';
import { EMPTY_PROJECT } from '@/lib/projects';

const base: ProjectFormValue = { ...EMPTY_PROJECT };

describe('lib/github-import', () => {
  describe('parseRepoRef', () => {
    it.each([
      ['https://github.com/felich/repo', { owner: 'felich', repo: 'repo' }],
      ['http://www.github.com/felich/repo/', { owner: 'felich', repo: 'repo' }],
      ['github.com/felich/repo.git', { owner: 'felich', repo: 'repo' }],
      ['felich/repo', { owner: 'felich', repo: 'repo' }],
      ['  felich/my-repo  ', { owner: 'felich', repo: 'my-repo' }],
    ])('parse %s', (input, expected) => {
      expect(parseRepoRef(input)).toEqual(expected);
    });
    it('menolak input sampah', () => {
      expect(parseRepoRef('')).toBeNull();
      expect(parseRepoRef('cuma-satu-kata')).toBeNull();
      expect(parseRepoRef('https://example.com/a/b')).toBeNull();
    });
  });

  describe('mapRepoToFields', () => {
    it('memetakan field + menggabung topics & language tanpa duplikat', () => {
      const out = mapRepoToFields({
        name: 'my-cool-app',
        description: '  Deskripsi repo  ',
        html_url: 'https://github.com/u/my-cool-app',
        homepage: 'https://demo.example.com',
        language: 'TypeScript',
        topics: ['nextjs', 'TypeScript', 'ai'],
      });
      expect(out.title).toBe('My Cool App');
      expect(out.description).toBe('Deskripsi repo');
      expect(out.github).toBe('https://github.com/u/my-cool-app');
      expect(out.live).toBe('https://demo.example.com');
      expect(out.techStack).toEqual(['nextjs', 'TypeScript', 'ai']);
    });
    it('tahan terhadap null', () => {
      const out = mapRepoToFields({
        name: 'x',
        description: null,
        html_url: 'https://github.com/u/x',
        homepage: null,
        language: null,
      });
      expect(out).toMatchObject({ description: '', live: '', techStack: [] });
    });
  });

  describe('applyImport', () => {
    const imported = {
      title: 'Repo Title',
      description: 'Repo desc',
      github: 'https://github.com/u/r',
      live: 'https://demo.example.com',
      techStack: ['Go'],
    };
    it('fill-empty: hanya isi yang kosong', () => {
      const current: ProjectFormValue = { ...base, title: 'Ketikan Saya', description: '' };
      const { value, changed } = applyImport(current, imported, 'fill-empty');
      expect(value.title).toBe('Ketikan Saya');
      expect(value.description).toBe('Repo desc');
      expect(changed).toContain('description');
      expect(changed).not.toContain('title');
    });
    it('overwrite: timpa semua yang beda', () => {
      const current: ProjectFormValue = { ...base, title: 'Ketikan Saya' };
      const { value, changed } = applyImport(current, imported, 'overwrite');
      expect(value.title).toBe('Repo Title');
      expect(changed).toContain('title');
    });
    it('tidak melaporkan field yang sudah sama', () => {
      const current: ProjectFormValue = { ...base, ...imported };
      const { changed } = applyImport(current, imported, 'overwrite');
      expect(changed).toEqual([]);
    });
  });
});
