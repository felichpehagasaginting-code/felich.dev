import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getAdminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/admin-auth';
import { normalizeProject, slugify, validateProject } from '@/lib/projects';

const listLimiter = new RateLimiterMemory({ points: 60, duration: 60 });
const writeLimiter = new RateLimiterMemory({ points: 20, duration: 60 });

function ipOf(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/** GET — publik: hanya published. Admin: ?all=1 + Bearer token → termasuk draft. */
export async function GET(req: NextRequest) {
  try {
    await listLimiter.consume(ipOf(req));
  } catch {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ projects: [] });

  try {
    const wantAll = req.nextUrl.searchParams.get('all') === '1';
    if (wantAll) {
      const auth = await verifyAdmin(req);
      if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });
      const snap = await adminDb.collection('projects').get();
      const projects = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
      return NextResponse.json({ projects });
    }
    const snap = await adminDb.collection('projects').where('status', '==', 'published').get();
    const projects = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
    return NextResponse.json({ projects });
  } catch (err) {
    console.error('Admin projects GET error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/** POST admin — buat project baru. */
export async function POST(req: NextRequest) {
  try {
    await writeLimiter.consume(ipOf(req));
  } catch {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title : '';
  const requestedSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : slugify(title);
  if (!requestedSlug) return NextResponse.json({ error: 'Title wajib diisi untuk membuat slug.' }, { status: 400 });

  const errors = validateProject({ ...(body as object), title } as Parameters<typeof validateProject>[0]);
  if (errors.length > 0) return NextResponse.json({ error: 'Validation failed.', details: errors }, { status: 400 });

  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ error: 'Firebase Admin is not configured.' }, { status: 500 });

  try {
    const { FieldValue } = await import('firebase-admin/firestore');
    const ref = adminDb.collection('projects').doc(requestedSlug);
    const existing = await ref.get();
    if (existing.exists) return NextResponse.json({ error: `Slug "${requestedSlug}" sudah dipakai.` }, { status: 409 });

    const data = normalizeProject({ ...(body as object), title } as Parameters<typeof normalizeProject>[0]);
    await ref.set({ ...data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ success: true, slug: requestedSlug }, { status: 201 });
  } catch (err) {
    console.error('Admin projects POST error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
