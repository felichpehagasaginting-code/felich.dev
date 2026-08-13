import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';

const ALLOWED_COLLECTIONS = new Set(['blog_views', 'blog_likes', 'project_likes', 'page_views']);
const SLUG_MAX_LENGTH = 100;

const rateLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    try {
      await rateLimiter.consume(ip);
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { collection, slug } = await req.json();
    if (
      typeof collection !== 'string' ||
      !ALLOWED_COLLECTIONS.has(collection) ||
      typeof slug !== 'string' ||
      !slug ||
      slug.length > SLUG_MAX_LENGTH
    ) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { success: true, message: 'Firebase Admin is not configured. Counter skipped.' },
        { status: 200 }
      );
    }

    await adminDb
      .collection(collection)
      .doc(slug)
      .set({ count: FieldValue.increment(1), slug }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Counter API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}