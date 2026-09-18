import type { NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export interface AdminAuthResult {
  ok: boolean;
  email?: string;
  uid?: string;
  error?: string;
  status?: number;
}

/**
 * Guard untuk semua /api/admin/* routes.
 * Client wajib kirim `Authorization: Bearer <Firebase ID token>`.
 * Server verifikasi token via Admin SDK lalu cocokkan email ke ADMIN_EMAILS.
 */
export async function verifyAdmin(req: NextRequest): Promise<AdminAuthResult> {
  const allowed = getAdminEmails();
  if (allowed.length === 0) {
    return { ok: false, error: 'ADMIN_EMAILS is not configured.', status: 500 };
  }

  const header = req.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, error: 'Missing Authorization Bearer token.', status: 401 };
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return { ok: false, error: 'Firebase Admin is not configured.', status: 500 };
  }

  try {
    const { getAuth } = await import('firebase-admin/auth');
    // getAuth() tanpa argumen memakai app default; admin app kita bernama 'admin'
    // — ambil via getApp('admin') bila ada.
    const { getApp, getApps } = await import('firebase-admin/app');
    const app = getApps().find((a) => a.name === 'admin') ?? getApp();
    const decoded = await getAuth(app).verifyIdToken(match[1], true);
    const email = (decoded.email ?? '').toLowerCase();
    if (!isAdminEmail(email)) {
      return { ok: false, error: 'Forbidden: not an admin.', status: 403 };
    }
    return { ok: true, email, uid: decoded.uid };
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return { ok: false, error: 'Invalid or expired token.', status: 401 };
  }
}
