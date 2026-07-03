import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = { _mock: true, type: 'firestore' };
const mockRtdb = { _mock: true, type: 'rtdb' };
const mockAuthVal = { _mock: true, type: 'auth' };
const mockProvider = { _mock: true, type: 'provider', setCustomParameters: vi.fn() };

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
  getRtdb: vi.fn(() => Promise.resolve(mockRtdb)),
  getAuth: vi.fn(() => Promise.resolve(mockAuthVal)),
  getGoogleProvider: vi.fn(() => Promise.resolve(mockProvider)),
}));

describe('Firebase module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getDb returns a firestore instance', async () => {
    const { getDb } = await import('@/lib/firebase');
    const db = await getDb();
    expect(db).toBeDefined();
    expect(db).toHaveProperty('type', 'firestore');
  });

  it('getRtdb returns a realtime database instance', async () => {
    const { getRtdb } = await import('@/lib/firebase');
    const rtdb = await getRtdb();
    expect(rtdb).toBeDefined();
    expect(rtdb).toHaveProperty('type', 'rtdb');
  });

  it('getAuth returns an auth instance', async () => {
    const { getAuth } = await import('@/lib/firebase');
    const auth = await getAuth();
    expect(auth).toBeDefined();
    expect(auth).toHaveProperty('type', 'auth');
  });

  it('getGoogleProvider returns a Google Auth provider', async () => {
    const { getGoogleProvider } = await import('@/lib/firebase');
    const provider = await getGoogleProvider();
    expect(provider).toBeDefined();
    expect(provider).toHaveProperty('type', 'provider');
  });
});
