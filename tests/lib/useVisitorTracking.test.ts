import { renderHook, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve('mock-db')),
  getRtdb: vi.fn(() => Promise.resolve('mock-rtdb')),
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
