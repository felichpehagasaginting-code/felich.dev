import type { ProjectFormValue } from '@/lib/projects';

export interface RepoRef {
  owner: string;
  repo: string;
}

/** Parse berbagai format input menjadi owner/repo. Return null bila tidak dikenali. */
export function parseRepoRef(input: string): RepoRef | null {
  const t = input.trim().replace(/\/+$/, '');
  if (!t) return null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i,
    /^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/i,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) return { owner: m[1], repo: m[2] };
  }
  return null;
}

export interface GithubRepoApi {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
}

function prettifyName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface ImportedFields {
  title: string;
  description: string;
  github: string;
  live: string;
  techStack: string[];
}

/** Petakan respons GitHub API menjadi field form. */
export function mapRepoToFields(repo: GithubRepoApi): ImportedFields {
  const tech = [...(repo.topics ?? []), ...(repo.language ? [repo.language] : [])]
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  // Hilangkan duplikat case-insensitive, pertahankan urutan
  const seen = new Set<string>();
  const techStack = tech.filter((t) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return {
    title: prettifyName(repo.name),
    description: (repo.description ?? '').trim().slice(0, 500),
    github: repo.html_url,
    live: (repo.homepage ?? '').trim(),
    techStack,
  };
}

export async function fetchRepo(ref: RepoRef): Promise<GithubRepoApi> {
  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.repo)}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (res.status === 404) throw new Error('Repo tidak ditemukan (cek owner/nama, repo privat butuh token).');
  if (res.status === 403) throw new Error('Rate limit GitHub tercapai — coba lagi ~1 menit.');
  if (!res.ok) throw new Error(`GitHub API error (${res.status}).`);
  return res.json() as Promise<GithubRepoApi>;
}

const IMPORTABLE_KEYS = ['title', 'description', 'github', 'live', 'techStack'] as const;

function isEmptyValue(v: ProjectFormValue[keyof ProjectFormValue]): boolean {
  return Array.isArray(v) ? v.length === 0 : !String(v ?? '').trim();
}

/**
 * Terapkan hasil import ke nilai form.
 * mode 'fill-empty' (default): hanya isi field yang masih kosong.
 * mode 'overwrite': timpa semua 5 field yang bisa diimport.
 * Return: nilai baru + daftar key yang berubah.
 */
export function applyImport(
  current: ProjectFormValue,
  imported: ImportedFields,
  mode: 'fill-empty' | 'overwrite' = 'fill-empty'
): { value: ProjectFormValue; changed: string[] } {
  const changed: string[] = [];
  const next = { ...current };
  for (const key of IMPORTABLE_KEYS) {
    if (mode === 'fill-empty' && !isEmptyValue(current[key])) continue;
    const incoming = imported[key];
    const same = JSON.stringify(current[key]) === JSON.stringify(incoming);
    if (same) continue;
    (next as Record<string, unknown>)[key] = incoming;
    changed.push(key);
  }
  return { value: next, changed };
}
