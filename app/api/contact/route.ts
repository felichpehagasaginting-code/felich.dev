import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// Import the singleton db instance instead of re-initializing Firebase here.
// This eliminates the duplicate firebaseConfig block that previously lived
// in this file and ensures a single Firebase app instance on the server.
import { db } from '@/lib/firebase';

/** Basic email format validator — avoids a regex library dependency */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // ── Input validation ──────────────────────────────────────────────────────
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
    await addDoc(collection(db, 'contact_messages'), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: serverTimestamp(),
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
