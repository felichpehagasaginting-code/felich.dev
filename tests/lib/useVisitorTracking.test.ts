import { renderHook, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve('mock-db')),
  getRtdb: vi.fn(() => Promise.resolve('mock-rtdb')),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'mock-doc' })),
  getDoc: vi.fn(() => Promise.resolve({ data: () => ({ count: 10 }), exists: true })),
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(() => ({ id: 'mock-ref' })),
  set: vi.fn(() => Promise.resolve()),
  remove: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((_ref: any, cb: any) => {
    if (typeof cb === 'function') {
      cb({ size: 1 });
    }
    return vi.fn();
  }),
  onDisconnect: vi.fn(() => ({ remove: vi.fn() })),
  serverTimestamp: vi.fn(() => 123456789),
}));

describe('useVisitorTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('returns onlineCount and totalViews', async () => {
    const { useVisitorTracking } = await import('@/lib/useVisitorTracking');
    const { result } = renderHook(() => useVisitorTracking('home'));
    expect(result.current).toHaveProperty('onlineCount');
    expect(result.current).toHaveProperty('totalViews');
    expect(typeof result.current.onlineCount).toBe('number');
  });

  it('initializes with 0 for onlineCount', async () => {
    const { useVisitorTracking } = await import('@/lib/useVisitorTracking');
    const { result } = renderHook(() => useVisitorTracking('home'));
    expect(result.current.onlineCount).toBe(0);
  });
});
