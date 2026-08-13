import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/app', () => {
  const MockApp = { name: '[DEFAULT]' };
  return {
    initializeApp: vi.fn(() => MockApp),
    getApps: vi.fn(() => []),
    getApp: vi.fn(() => MockApp),
  };
});

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ type: 'firestore' })),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => ({ type: 'rtdb' })),
}));

vi.mock('firebase/auth', () => {
  function GoogleAuthProvider() {
    return { type: 'provider', setCustomParameters: vi.fn() };
  }
  return {
    getAuth: vi.fn(() => ({ type: 'auth' })),
    GoogleAuthProvider,
  };
});

describe('Firebase module', () => {
  it('getDb resolves to a firestore instance', async () => {
    const { getDb } = await import('@/lib/firebase');
    const db = await getDb();
    expect(db).toHaveProperty('type', 'firestore');
  });

  it('getRtdb resolves to a realtime database instance', async () => {
    const { getRtdb } = await import('@/lib/firebase');
    const rtdb = await getRtdb();
    expect(rtdb).toHaveProperty('type', 'rtdb');
  });

  it('getAuth resolves to an auth instance', async () => {
    const { getAuth } = await import('@/lib/firebase');
    const auth = await getAuth();
    expect(auth).toHaveProperty('type', 'auth');
  });

  it('getGoogleProvider resolves to a Google Auth provider', async () => {
    const { getGoogleProvider } = await import('@/lib/firebase');
    const provider = await getGoogleProvider();
    expect(provider).toHaveProperty('type', 'provider');
  });
});
