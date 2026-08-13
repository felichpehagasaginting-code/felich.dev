import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getAdminDb } from '@/lib/firebase-admin';
import { getDb } from '@/lib/firebase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimiter = new RateLimiterMemory({
  points: 5,
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

    const { name, email, message } = await req.json();
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // ── Persist to Firestore ──────────────────────────────────────────────────
    // Preferred: Admin SDK (bypasses rules; rate limiting happens in this route).
    // Fallback: client SDK — Firestore rules validate the payload client-side.
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      read: false,
    };
    const adminDb = getAdminDb();
    if (adminDb) {
      const { FieldValue } = await import('firebase-admin/firestore');
      await adminDb.collection('contact_messages').add({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      });
    } else {
      const db = await getDb();
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'contact_messages'), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
