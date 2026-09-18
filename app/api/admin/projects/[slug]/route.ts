import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/admin-auth';
import { normalizeProject, slugify, validateProject } from '@/lib/projects';

const writeLimiter = new RateLimiterMemory({ points: 30, duration: 60 });

function ipOf(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

type Ctx = { params: Promise<{ slug: string }> };

/** GET admin — detail satu project (termasuk draft). */
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });

  const { slug } = await ctx.params;
  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ error: 'Firebase Admin is not configured.' }, { status: 500 });

  const doc = await adminDb.collection('projects').doc(slug).get();
  if (!doc.exists) return NextResponse.json({ error: 'Project tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ slug: doc.id, ...doc.data() });
}

/** PUT admin — update penuh / PATCH parsial satu project. */
export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    await writeLimiter.consume(ipOf(req));
  } catch {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });

  const { slug } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ error: 'Firebase Admin is not configured.' }, { status: 500 });

  const ref = adminDb.collection('projects').doc(slug);
  const existing = await ref.get();
  if (!existing.exists) return NextResponse.json({ error: 'Project tidak ditemukan.' }, { status: 404 });

  const prev = existing.data() ?? {};
  const merged = { ...prev, ...body };
  const title = typeof merged.title === 'string' && merged.title.trim() ? merged.title : String(prev.title ?? '');
  if (!title.trim()) return NextResponse.json({ error: 'Title wajib diisi.' }, { status: 400 });

  const errors = validateProject(merged as Parameters<typeof validateProject>[0]);
  if (errors.length > 0) return NextResponse.json({ error: 'Validation failed.', details: errors }, { status: 400 });

  try {
    const data = normalizeProject(merged as Parameters<typeof normalizeProject>[0]);
    // Slug rename: bila body.slug berbeda & valid → pindah dokumen.
    const newSlugRaw = typeof body.slug === 'string' ? body.slug.trim() : '';
    const newSlug = newSlugRaw ? slugify(newSlugRaw) || slug : slug;
    if (newSlug !== slug) {
      const target = await adminDb.collection('projects').doc(newSlug).get();
      if (target.exists) return NextResponse.json({ error: `Slug "${newSlug}" sudah dipakai.` }, { status: 409 });
      await adminDb.collection('projects').doc(newSlug).set({ ...data, createdAt: prev.createdAt ?? FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      await ref.delete();
      return NextResponse.json({ success: true, slug: newSlug, renamed: true });
    }
    await ref.set({ ...data, createdAt: prev.createdAt ?? FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error('Admin project PUT error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/** DELETE admin — hapus project (likes counter ikut dibersihkan bila ada). */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await writeLimiter.consume(ipOf(req));
  } catch {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const auth = await verifyAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status ?? 401 });

  const { slug } = await ctx.params;
  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ error: 'Firebase Admin is not configured.' }, { status: 500 });

  try {
    const ref = adminDb.collection('projects').doc(slug);
    const existing = await ref.get();
    if (!existing.exists) return NextResponse.json({ error: 'Project tidak ditemukan.' }, { status: 404 });
    await ref.delete();
    // Bersihkan counter likes agar tidak yatim (best-effort).
    try {
      await adminDb.collection('project_likes').doc(slug).delete();
    } catch {
      /* abaikan */
    }
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error('Admin project DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
