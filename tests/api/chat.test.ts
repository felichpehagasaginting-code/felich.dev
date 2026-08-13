import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockConsume = vi.fn(() => Promise.resolve());

class MockRateLimiterMemory {
  consume = mockConsume;
}

vi.mock('rate-limiter-flexible', () => ({
  RateLimiterMemory: MockRateLimiterMemory,
}));

function sseStream(chunks: string[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
      controller.close();
    },
  });
}

function createMockRequest(body: any) {
  return {
    json: () => Promise.resolve(body),
    headers: new Map([['x-forwarded-for', '127.0.0.1']]),
  } as any;
}

const validMessages = [{ role: 'user', content: 'hello' }];

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          body: sseStream([
            'data: {"candidates":[{"content":{"parts":[{"text":"Hi"}]}}]}\n\n',
            'data: {"candidates":[{"finishReason":"STOP"}]}\n\n',
          ]),
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('rejects invalid request body', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid request body');
  });

  it('rejects empty messages array', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: [] }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid request body');
  });

  it('rejects more than 10 messages', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const messages = Array.from({ length: 11 }, () => ({ role: 'user', content: 'x' }));
    const res = await POST(createMockRequest({ messages }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Too many messages');
  });

  it('rejects invalid role', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: [{ role: 'admin', content: 'x' }] }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid message payload');
  });

  it('rejects non-string content', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: [{ role: 'user', content: 42 }] }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid message payload');
  });

  it('rejects oversized message content', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: [{ role: 'user', content: 'x'.repeat(1001) }] }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain('Invalid message payload');
  });

  it('returns 429 when rate limited', async () => {
    mockConsume.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: validMessages }));
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
  });

  it('returns 500 when GEMINI_API_KEY is not set', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: validMessages }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('API key not configured');
  });

  it('streams assistant text chunks for valid input', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const res = await POST(createMockRequest({ messages: validMessages }));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('"text":"Hi"');
    expect(text).toContain('"done":true');
  });
});
