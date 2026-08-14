import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const mockConsume = vi.fn(() => Promise.resolve());

class MockRateLimiterMemory {
  consume = mockConsume;
}

vi.mock('rate-limiter-flexible', () => ({
  RateLimiterMemory: MockRateLimiterMemory,
}));

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve('mock-db')),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'mock-collection'),
  addDoc: vi.fn(() => Promise.resolve('mock-doc-id')),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

function createMockRequest(body: any) {
  return {
    json: () => Promise.resolve(body),
    headers: new Map([['x-forwarded-for', '127.0.0.1']]),
  } as any;
}

describe('Contact API Route', () => {
  let POST: any;

  beforeAll(async () => {
    const mod = await import('@/app/api/contact/route');
    POST = mod.POST;
  }, 30000);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty request body', async () => {
    const res = await POST(createMockRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('required');
  }, 15000);

  it('rejects missing name', async () => {
    const res = await POST(createMockRequest({ email: 'test@test.com', message: 'hello' }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('required');
  }, 15000);

  it('rejects missing email', async () => {
    const res = await POST(createMockRequest({ name: 'Test', message: 'hello' }));
    const data = await res.json();
    expect(res.status).toBe(400);
  }, 15000);

  it('rejects invalid email format', async () => {
    const res = await POST(createMockRequest({ name: 'Test', email: 'not-an-email', message: 'hello' }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid email');
  }, 15000);

  it('accepts valid contact submission', async () => {
    const res = await POST(createMockRequest({ name: 'Test User', email: 'test@example.com', message: 'Hello, this is a test message' }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  }, 15000);

  it('returns 429 when rate limited', async () => {
    mockConsume.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const res = await POST(createMockRequest({ name: 'Test', email: 'test@test.com', message: 'hello' }));
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
  }, 15000);
});
