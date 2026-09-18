/**
 * Migrasi sekali jalan: content/projects/*.mdx → koleksi Firestore `projects`.
 *
 * Cara pakai (butuh service account admin):
 *   $env:FIREBASE_PROJECT_ID="..."; $env:FIREBASE_CLIENT_EMAIL="..."; $env:FIREBASE_PRIVATE_KEY="..."
 *   npx tsx scripts/migrate-projects-mdx.ts
 *
 * Aman dijalankan ulang — dokumen yang sudah ada di-skip (tidak dioverwrite).
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function main() {
  const dir = path.join(process.cwd(), 'content', 'projects');
  if (!fs.existsSync(dir)) {
    console.error(`Direktori tidak ditemukan: ${dir}`);
    process.exit(1);
  }

  const { getAdminDb } = await import('../lib/firebase-admin');
  const adminDb = getAdminDb();
  if (!adminDb) {
    console.error('FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY belum dikonfigurasi.');
    process.exit(1);
  }

  const { FieldValue } = await import('firebase-admin/firestore');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  let created = 0;
  let skipped = 0;

  for (const [idx, filename] of files.entries()) {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
    const { data, content } = matter(raw);

    const ref = adminDb.collection('projects').doc(slug);
    const existing = await ref.get();
    if (existing.exists) {
      console.log(`- skip /${slug} (sudah ada)`);
      skipped++;
      continue;
    }

    await ref.set({
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
      status: 'published',
      order: typeof data.order === 'number' ? data.order : (files.length - idx) * 10,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`+ created /${slug}`);
    created++;
  }

  console.log(`\nSelesai: ${created} dibuat, ${skipped} di-skip.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
