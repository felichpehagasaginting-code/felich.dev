import { NextResponse } from 'next/server';

function errStr(e: unknown): string {
  if (e instanceof Error) {
    const code = (e as { code?: string }).code ?? 'no-code';
    return `${code}: ${(e.message || '').slice(0, 160)}`;
  }
  return String(e).slice(0, 160);
}

/** SEMENTARA — diagnostik import firebase-admin di runtime. Akan dihapus. */
export async function GET() {
  const steps: Record<string, string> = {};
  try {
    await import('firebase-admin/app');
    steps.app = 'ok';
  } catch (e) {
    steps.app = `FAIL ${errStr(e)}`;
  }
  try {
    await import('firebase-admin/auth');
    steps.auth = 'ok';
  } catch (e) {
    steps.auth = `FAIL ${errStr(e)}`;
  }
  try {
    await import('firebase-admin/firestore');
    steps.firestore = 'ok';
  } catch (e) {
    steps.firestore = `FAIL ${errStr(e)}`;
  }
  try {
    const { getAdminDb } = await import('@/lib/firebase-admin');
    steps.admindb = getAdminDb() ? 'ok' : 'null-env-missing';
  } catch (e) {
    steps.admindb = `FAIL ${errStr(e)}`;
  }
  try {
    const { verifyAdmin } = await import('@/lib/admin-auth');
    void verifyAdmin;
    steps.adminauth = 'ok';
  } catch (e) {
    steps.adminauth = `FAIL ${errStr(e)}`;
  }
  return NextResponse.json({ steps });
}
