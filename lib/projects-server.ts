import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAdminDb } from '@/lib/firebase-admin';
import { sortProjects, type Project } from '@/lib/projects';

function readMdxProjects(): Project[] {
  const directory = path.join(process.cwd(), 'content', 'projects');
  try {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory)
      .filter((f) => f.endsWith('.mdx'))
      .map((filename) => {
        const slug = filename.replace(/\.mdx$/, '');
        const raw = fs.readFileSync(path.join(directory, filename), 'utf-8');
        const { data, content } = matter(raw);
        return {
          slug,
          title: String(data.title ?? slug),
          description: String(data.description ?? ''),
          type: data.type ?? 'Web',
          category: data.category ?? 'Personal Project',
          featured: Boolean(data.featured),
          techStack: Array.isArray(data.techStack) ? data.techStack.map(String) : [],
          features: Array.isArray(data.features) ? data.features.map(String) : [],
          github: String(data.github ?? ''),
          live: String(data.live ?? ''),
          date: String(data.date ?? ''),
          coverImage: String(data.coverImage ?? ''),
          gallery: Array.isArray(data.gallery) ? data.gallery.map(String) : [],
          demoVideo: String(data.demoVideo ?? data.video ?? ''),
          content: content.trim(),
          status: 'published' as const,
          order: typeof data.order === 'number' ? data.order : 0,
          source: 'mdx' as const,
        } satisfies Project;
      });
  } catch (err) {
    console.error('readMdxProjects error:', err);
    return [];
  }
}

async function readFirestoreProjects(publishedOnly: boolean): Promise<Project[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('projects');
    if (publishedOnly) q = q.where('status', '==', 'published');
    const snap = await q.get();
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        slug: doc.id,
        title: String(d.title ?? doc.id),
        description: String(d.description ?? ''),
        type: d.type ?? 'Web',
        category: d.category ?? 'Personal Project',
        featured: Boolean(d.featured),
        techStack: Array.isArray(d.techStack) ? d.techStack.map(String) : [],
        features: Array.isArray(d.features) ? d.features.map(String) : [],
        github: String(d.github ?? ''),
        live: String(d.live ?? ''),
        date: String(d.date ?? ''),
        coverImage: String(d.coverImage ?? ''),
        gallery: Array.isArray(d.gallery) ? d.gallery.map(String) : [],
        demoVideo: String(d.demoVideo ?? ''),
        content: String(d.content ?? ''),
        status: d.status === 'published' ? 'published' : 'draft',
        order: typeof d.order === 'number' ? d.order : 0,
        createdAt: d.createdAt?.toDate?.()?.toISOString?.(),
        updatedAt: d.updatedAt?.toDate?.()?.toISOString?.(),
        source: 'firestore' as const,
      } satisfies Project;
    });
  } catch (err) {
    console.error('readFirestoreProjects error:', err);
    return [];
  }
}

/**
 * Gabungan Firestore (prioritas) + MDX (fallback/seed).
 * Slug yang sama → versi Firestore menang.
 */
export async function getProjectsMerged(opts: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  const publishedOnly = opts.publishedOnly ?? true;
  const [mdx, fsProjects] = await Promise.all([
    Promise.resolve(readMdxProjects()),
    readFirestoreProjects(publishedOnly),
  ]);
  const fsSlugs = new Set(fsProjects.map((p) => p.slug));
  const mdxOnly = publishedOnly ? mdx : mdx; // MDX selalu published
  const merged = [...fsProjects, ...mdxOnly.filter((p) => !fsSlugs.has(p.slug))];
  return sortProjects(merged);
}
