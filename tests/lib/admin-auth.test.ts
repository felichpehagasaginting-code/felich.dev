import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdminEmail, verifyAdmin } from '@/lib/admin-auth';

const mockVerifyIdToken = vi.fn();

vi.mock('firebase-admin/app', () => ({
  getApps: () => [{ name: 'admin' }],
  getApp: () => ({ name: 'admin' }),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: mockVerifyIdToken,
  }),
}));

vi.mock('@/lib/firebase-admin', () => ({
  getAdminDb: vi.fn(() => ({})),
}));

function makeReq(headers: Record<string, string> = {}) {
  const map = new Map(Object.entries(headers));
  return {
    headers: {
      get: (k: string) => map.get(k.toLowerCase()) ?? null,
    },
  } as any;
}

describe('lib/admin-auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAILS = 'felich@example.com,admin@felich.dev';
  });

  describe('isAdminEmail', () => {
    it('returns true for allowed emails case-insensitively', () => {
      expect(isAdminEmail('felich@example.com')).toBe(true);
      expect(isAdminEmail('FELICH@EXAMPLE.COM')).toBe(true);
      expect(isAdminEmail('admin@felich.dev')).toBe(true);
    });

    it('returns false for unauthorized or invalid emails', () => {
      expect(isAdminEmail('other@example.com')).toBe(false);
      expect(isAdminEmail(null)).toBe(false);
      expect(isAdminEmail(undefined)).toBe(false);
    });
  });

  describe('verifyAdmin', () => {
    it('rejects untrusted origin', async () => {
      const req = makeReq({
        origin: 'https://evil-site.com',
        authorization: 'Bearer valid-token',
      });
      const res = await verifyAdmin(req);
      expect(res.ok).toBe(false);
      expect(res.status).toBe(403);
      expect(res.error).toMatch(/untrusted origin/i);
    });

    it('accepts trusted origins (localhost, felich.dev, vercel.app)', async () => {
      mockVerifyIdToken.mockResolvedValueOnce({ email: 'felich@example.com', uid: 'user-1' });
      const req = makeReq({
        origin: 'https://felich.dev',
        authorization: 'Bearer valid-token',
      });
      const res = await verifyAdmin(req);
      expect(res.ok).toBe(true);
      expect(res.email).toBe('felich@example.com');
    });

    it('rejects requests without authorization header', async () => {
      const req = makeReq({ origin: 'https://felich.dev' });
      const res = await verifyAdmin(req);
      expect(res.ok).toBe(false);
      expect(res.status).toBe(401);
      expect(res.error).toMatch(/Missing Authorization/i);
    });

    it('rejects non-admin emails with 403', async () => {
      mockVerifyIdToken.mockResolvedValueOnce({ email: 'random@test.com', uid: 'user-2' });
      const req = makeReq({
        origin: 'https://felich.dev',
        authorization: 'Bearer user-token',
      });
      const res = await verifyAdmin(req);
      expect(res.ok).toBe(false);
      expect(res.status).toBe(403);
      expect(res.error).toMatch(/Forbidden/i);
    });

    it('handles expired tokens with token-expired code', async () => {
      const err = new Error('Firebase ID token has expired');
      (err as any).code = 'auth/id-token-expired';
      mockVerifyIdToken.mockRejectedValueOnce(err);

      const req = makeReq({
        origin: 'http://localhost:3000',
        authorization: 'Bearer expired-token',
      });
      const res = await verifyAdmin(req);
      expect(res.ok).toBe(false);
      expect(res.status).toBe(401);
      expect(res.code).toBe('token-expired');
    });
  });
});
