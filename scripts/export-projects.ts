/**
 * Backup sekali jalan: koleksi Firestore `projects` → file JSON.
 *
 * Cara pakai (butuh service account admin):
 *   $env:FIREBASE_PROJECT_ID="..."; $env:FIREBASE_CLIENT_EMAIL="..."; $env:FIREBASE_PRIVATE_KEY="..."
 *   npm run export:projects
 *   # hasil: backups/projects-2026-09-18T06-30-00.json
 *
 * Simpan hasil di tempat aman (jangan commit bila berisi draf privat).
 */
import fs from 'fs';
import path from 'path';

function toJSON(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof (value as { toDate?: unknown }).toDate === 'function') {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return String(value);
    }
  }
  if (Array.isArray(value)) return value.map(toJSON);
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, toJSON(v)]));
  }
  return value;
}

async function main() {
  const { getAdminDb } = await import('../lib/firebase-admin');
  const adminDb = getAdminDb();
  if (!adminDb) {
    console.error('FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY belum dikonfigurasi.');
    process.exit(1);
  }

  const snap = await adminDb.collection('projects').get();
  const projects = snap.docs.map((doc) => ({ slug: doc.id, ...(toJSON(doc.data()) as Record<string, unknown>) }));

  const dir = path.join(process.cwd(), 'backups');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = path.join(dir, `projects-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify({ exportedAt: new Date().toISOString(), count: projects.length, projects }, null, 2));

  console.log(`Backup selesai: ${projects.length} projects → ${path.relative(process.cwd(), file)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
