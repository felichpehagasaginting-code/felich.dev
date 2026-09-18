import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormDraft } from '@/lib/useFormDraft';

const KEY = 'test-draft';
const baseline = { title: '', description: '' };
const edited = { title: 'Hasil ketikan', description: '' };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('lib/useFormDraft', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('tidak ada banner saat storage kosong', () => {
    const { result } = renderHook(() => useFormDraft(KEY, baseline, baseline, 10));
    expect(result.current.showBanner).toBe(false);
    expect(result.current.draftValue).toBeNull();
  });

  it('menyimpan otomatis (debounce) dan menampilkan banner di baseline', async () => {
    const { result, rerender } = renderHook(({ v }) => useFormDraft(KEY, v, baseline, 10), {
      initialProps: { v: edited },
    });
    await act(async () => {
      await sleep(30);
    });
    expect(window.localStorage.getItem(KEY)).not.toBeNull();

    // Mount baru dengan nilai baseline → banner muncul
    rerender({ v: baseline });
    const { result: r2 } = renderHook(() => useFormDraft(KEY, baseline, baseline, 10));
    expect(r2.current.showBanner).toBe(true);
    expect(r2.current.draftValue).toEqual(edited);
    expect(result.current).toBeDefined();
  });

  it('restore mengembalikan nilai, dismiss menyembunyikan, clear menghapus', async () => {
    window.localStorage.setItem(KEY, JSON.stringify({ value: edited, savedAt: new Date().toISOString() }));
    const { result } = renderHook(() => useFormDraft(KEY, baseline, baseline, 10));
    expect(result.current.showBanner).toBe(true);
    expect(result.current.restore()).toEqual(edited);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.showBanner).toBe(false);

    act(() => {
      result.current.clear();
    });
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('tidak menyimpan bila sama dengan baseline', async () => {
    renderHook(() => useFormDraft(KEY, baseline, baseline, 10));
    await act(async () => {
      await sleep(30);
    });
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
