import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const mockConsume = vi.fn(() => Promise.resolve());

class MockRateLimiterMemory {
  consume = mockConsume;
}

vi.mock('rate-limiter-flexible', () => ({
  RateLimiterMemory: MockRateLimiterMemory,
}));

const mockVerifyAdmin = vi.fn();

vi.mock('@/lib/admin-auth', () => ({
  verifyAdmin: (...args: unknown[]) => mockVerifyAdmin(...args),
}));

const mockGet = vi.fn();
const mockSet = vi.fn(() => Promise.resolve());
const mockAddDoc = vi.fn();
const mockWhere = vi.fn();
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockDelete = vi.fn(() => Promise.resolve());

vi.mock('@/lib/firebase-admin', () => ({
  getAdminDb: vi.fn(() => ({
    collection: mockCollection,
  })),
}));

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: vi.fn(() => 'mock-ts') },
}));

function req(body: unknown, search = '', token = 'Bearer test-token') {
  return {
    json: () => Promise.resolve(body),
    headers: new Map([
      ['x-forwarded-for', '127.0.0.1'],
      ['authorization', token],
    ]),
    nextUrl: { searchParams: new URLSearchParams(search) },
  } as any;
}

describe('Admin projects API', () => {
  let POST: any;
  let GET: any;

  beforeAll(async () => {
    const mod = await import('@/app/api/admin/projects/route');
    POST = mod.POST;
    GET = mod.GET;
  }, 30000);

  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyAdmin.mockResolvedValue({ ok: true, email: 'admin@example.com' });
    process.env.ADMIN_EMAILS = 'admin@example.com';
  });

  it('GET publik mengembalikan published saja', async () => {
    mockWhere.mockReturnValue({ get: mockGet });
    mockCollection.mockReturnValue({ where: mockWhere });
    mockGet.mockResolvedValue({ docs: [{ id: 'a', data: () => ({ title: 'A' }) }] });

    const res = await GET(req({}, ''));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.projects).toHaveLength(1);
    expect(mockWhere).toHaveBeenCalledWith('status', '==', 'published');
  }, 15000);

  it('POST menolak tanpa auth admin', async () => {
    mockVerifyAdmin.mockResolvedValueOnce({ ok: false, error: 'Forbidden', status: 403 });
    const res = await POST(req({ title: 'X', description: 'Y' }));
    expect(res.status).toBe(403);
  }, 15000);

  it('POST validasi title wajib', async () => {
    const res = await POST(req({ title: '', description: '' }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Title|Validation/i);
  }, 15000);

  it('POST membuat dokumen baru (201)', async () => {
    const docRef = { get: vi.fn(() => Promise.resolve({ exists: false })), set: mockSet };
    mockCollection.mockReturnValue({ doc: () => docRef });
    const res = await POST(
      req({ title: 'StackWay', description: 'Platform edukasi', status: 'draft' })
    );
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.slug).toBe('stackway');
    expect(mockSet).toHaveBeenCalled();
  }, 15000);

  it('POST 409 bila slug sudah dipakai', async () => {
    const docRef = { get: vi.fn(() => Promise.resolve({ exists: true })), set: mockSet };
    mockCollection.mockReturnValue({ doc: () => docRef });
    const res = await POST(req({ title: 'StackWay', description: 'd' }));
    expect(res.status).toBe(409);
  }, 15000);

  it('rate limit → 429', async () => {
    mockConsume.mockRejectedValueOnce(new Error('limit'));
    const res = await POST(req({ title: 'T', description: 'D' }));
    expect(res.status).toBe(429);
  }, 15000);

  // cegah unused warnings bila mock tidak terpakai di semua test
  void mockAddDoc;
  void mockDoc;
  void mockDelete;
});
